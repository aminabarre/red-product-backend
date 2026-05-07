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

        // Générer token d'activation
        const activationToken = crypto.randomBytes(32).toString('hex')

        const user = new User({
            name,
            email,
            password: hashedPassword,
            activationToken,
            isActive: false
        })

        await user.save()

        // Lien d'activation
        const activationLink = `https://red-product-backend-tzk6.onrender.com/api/auth/activate/${activationToken}`

        // Envoyer email d'activation
        await sendEmail({
            to: user.email,
            subject: 'Activez votre compte - RED PRODUCT',
            html: `
                <div style="font-family: Poppins, sans-serif; max-width: 500px; margin: auto;">
                    <h2 style="color: rgb(86,108,157);">RED PRODUCT</h2>
                    <p>Bonjour <strong>${user.name}</strong>,</p>
                    <p>Merci pour votre inscription ! Cliquez sur le bouton ci-dessous pour activer votre compte :</p>
                    <a href="${activationLink}"
                       style="display: inline-block; padding: 12px 24px; background: rgb(86,108,157); color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
                        Activer mon compte
                    </a>
                    <p style="color: #aaa; font-size: 0.85rem;">Si vous n'avez pas créé ce compte, ignorez cet email.</p>
                </div>
            `
        })

        res.status(201).json({ message: 'Compte créé ! Vérifiez votre email pour activer votre compte.' })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// ACTIVATION DU COMPTE
const activateAccount = async (req, res) => {
    try {
        const { token } = req.params

        const user = await User.findOne({ activationToken: token })

        if (!user) {
            return res.status(400).json({ message: 'Lien d\'activation invalide.' })
        }

        user.isActive = true
        user.activationToken = undefined
        await user.save()

        // Rediriger vers la page de connexion avec message de succès
        res.redirect('https://teal-pavlova-ab2348.netlify.app/index.html?activated=true')

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

        // Vérifier si le compte est activé
        if (!user.isActive) {
            return res.status(403).json({ message: 'Votre compte n\'est pas encore activé. Vérifiez votre email.' })
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

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'Aucun compte avec cet email.' })
        }

        const resetToken = crypto.randomBytes(32).toString('hex')
        user.resetPasswordToken   = resetToken
        user.resetPasswordExpires = Date.now() + 3600000
        await user.save()

        const resetLink = `https://teal-pavlova-ab2348.netlify.app/reset-password.html?token=${resetToken}`
        await sendEmail({
            to: user.email,
            subject: 'Réinitialisation de votre mot de passe - RED PRODUCT',
            html: `
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

        const user = await User.findOne({
            resetPasswordToken  : token,
            resetPasswordExpires: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ message: 'Token invalide ou expiré.' })
        }

        user.password             = await bcrypt.hash(password, 10)
        user.resetPasswordToken   = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        res.json({ message: 'Mot de passe réinitialisé avec succès !' })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { register, login, logout, activateAccount, forgotPassword, resetPassword }