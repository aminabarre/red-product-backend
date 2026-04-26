const express = require('express')
const router = express.Router()
const {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword
} = require('../controllers/authController')
const validate = require('../middlewares/validate')
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} = require('../utils/validators')

router.post('/register',        validate(registerSchema),       register)
router.post('/login',           validate(loginSchema),          login)
router.post('/logout',                                          logout)
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword)
router.post('/reset-password',  validate(resetPasswordSchema),  resetPassword)

module.exports = router