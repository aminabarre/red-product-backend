const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')

// INSCRIPTION
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const userExiste = await User.findOne({ email })
        if (userExiste) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ name, email, password: hashedPassword })
        await user.save()
        res.status(201).json({ message: 'Compte créé avec succès !' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// CONNEXION
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect.' })
        }
        const passwordCorrect = await bcrypt.compare(password, user.password)
        if (!passwordCorrect) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect.' })
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        res.json({
            message: 'Connexion réussie !',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// DÉCONNEXION
const logout = async (req, res) => {
    res.json({ message: 'Déconnexion réussie !' })
}

// MOT DE PASSE OUBLIÉ
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'Aucun compte avec cet email.' })
        }

        // Générer un token aléatoire
        const resetToken = crypto.randomBytes(32).toString('hex')

        // Sauvegarder le token + expiration (1 heure)
        user.resetPasswordToken   = resetToken
        user.resetPasswordExpires = Date.now() + 3600000 // 1 heure
        await user.save()

        // Lien de reset — pointe vers ta page frontend
        const resetLink = `http://127.0.0.1:5500/red-product-frontend/reset-password.html?token=${resetToken}`

        // Envoyer l'email
        await sendEmail({
            to      : user.email,
            subject : 'Réinitialisation de votre mot de passe - RED PRODUCT',
            html    : `
                <div style="font-family: Poppins, sans-serif; max-width: 500px; margin: auto;">
                    <h2 style="color: rgb(86,108,157);">RED PRODUCT</h2>
                    <p>Bonjour <strong>${user.name}</strong>,</p>
                    <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
                    <p>Cliquez sur le bouton ci-dessous — ce lien expire dans <strong>1 heure</strong> :</p>
                    <a href="${resetLink}" 
                       style="display: inline-block; padding: 12px 24px; background: rgb(86,108,157); color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
                        Réinitialiser mon mot de passe
                    </a>
                    <p style="color: #aaa; font-size: 0.85rem;">Si vous n'avez pas fait cette demande, ignorez cet email.</p>
                </div>
            `
        })

        res.json({ message: 'Email de réinitialisation envoyé !' })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// RESET MOT DE PASSE
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body

        // Trouver l'utilisateur avec ce token non expiré
        const user = await User.findOne({
            resetPasswordToken  : token,
            resetPasswordExpires: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ message: 'Token invalide ou expiré.' })
        }

        // Hasher le nouveau mot de passe
        user.password             = await bcrypt.hash(password, 10)
        user.resetPasswordToken   = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        res.json({ message: 'Mot de passe réinitialisé avec succès !' })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { register, login, logout, forgotPassword, resetPassword }