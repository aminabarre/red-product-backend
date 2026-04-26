const express = require('express')
const router = express.Router()
const { getKpis } = require('../controllers/dashboardController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/kpis', authMiddleware, getKpis)

module.exports = router