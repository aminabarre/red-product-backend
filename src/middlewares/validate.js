const validate = (schema) => {
    return (req, res, next) => {
        console.log('Body reçu :', req.body) // ← ajoute ça
        
        const { error } = schema.validate(req.body, {
            abortEarly : false,
            convert    : true,
            allowUnknown: false
        })

        if (error) {
            const messages = error.details.map(d => d.message)
            console.log('Erreurs Joi :', messages) // ← ajoute ça
            return res.status(400).json({
                message : 'Données invalides.',
                errors  : messages
            })
        }

        next()
    }
}

module.exports = validate