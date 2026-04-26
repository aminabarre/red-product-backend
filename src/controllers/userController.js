const User = require('../models/User')

// GET profil de l'utilisateur connecté
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' })
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getMe }