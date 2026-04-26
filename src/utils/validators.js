const Joi = require('joi')

const registerSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty' : 'Le nom est obligatoire.',
        'string.min'   : 'Le nom doit faire au moins 2 caractères.',
        'any.required' : 'Le nom est obligatoire.'
    }),
    email: Joi.string().trim().email().required().messages({
        'string.empty' : 'L\'email est obligatoire.',
        'string.email' : 'L\'email est invalide.',
        'any.required' : 'L\'email est obligatoire.'
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty' : 'Le mot de passe est obligatoire.',
        'string.min'   : 'Le mot de passe doit faire au moins 6 caractères.',
        'any.required' : 'Le mot de passe est obligatoire.'
    })
})

const loginSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        'string.empty' : 'L\'email est obligatoire.',
        'string.email' : 'L\'email est invalide.',
        'any.required' : 'L\'email est obligatoire.'
    }),
    password: Joi.string().required().messages({
        'string.empty' : 'Le mot de passe est obligatoire.',
        'any.required' : 'Le mot de passe est obligatoire.'
    })
})

const hotelSchema = Joi.object({
    nom: Joi.string().trim().min(2).required().messages({
        'string.empty' : 'Le nom de l\'hôtel est obligatoire.',
        'string.min'   : 'Le nom doit faire au moins 2 caractères.',
        'any.required' : 'Le nom de l\'hôtel est obligatoire.'
    }),
    adresse: Joi.string().trim().required().messages({
        'string.empty' : 'L\'adresse est obligatoire.',
        'any.required' : 'L\'adresse est obligatoire.'
    }),
    email: Joi.string().trim().email().required().messages({
        'string.empty' : 'L\'email est obligatoire.',
        'string.email' : 'L\'email est invalide.',
        'any.required' : 'L\'email est obligatoire.'
    }),
    telephone: Joi.string().trim().required().messages({
        'string.empty' : 'Le téléphone est obligatoire.',
        'any.required' : 'Le téléphone est obligatoire.'
    }),
    prix: Joi.number().positive().required().messages({
        'number.base'     : 'Le prix doit être un nombre.',
        'number.positive' : 'Le prix doit être positif.',
        'any.required'    : 'Le prix est obligatoire.'
    }),
    devise: Joi.string().valid('XOF', 'EUR', 'USD').default('XOF').messages({
        'any.only' : 'La devise doit être XOF, EUR ou USD.'
    })
})

const forgotPasswordSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        'string.empty' : 'L\'email est obligatoire.',
        'string.email' : 'L\'email est invalide.',
        'any.required' : 'L\'email est obligatoire.'
    })
})

const resetPasswordSchema = Joi.object({
    token: Joi.string().required().messages({
        'string.empty' : 'Le token est obligatoire.',
        'any.required' : 'Le token est obligatoire.'
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty' : 'Le mot de passe est obligatoire.',
        'string.min'   : 'Le mot de passe doit faire au moins 6 caractères.',
        'any.required' : 'Le mot de passe est obligatoire.'
    })
})

module.exports = {
    registerSchema,
    loginSchema,
    hotelSchema,
    forgotPasswordSchema,
    resetPasswordSchema
}