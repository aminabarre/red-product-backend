const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    try {
        // Récupérer le token dans le header
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Accès refusé. Token manquant.' })
        }

        // Extraire le token (enlever "Bearer ")
        const token = authHeader.split(' ')[1]

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Injecter l'utilisateur dans la requête
        req.user = decoded

        // Passer à la suite
        next()

    } catch (error) {
        res.status(401).json({ message: 'Token invalide ou expiré.' })
    }
}

module.exports = authMiddleware