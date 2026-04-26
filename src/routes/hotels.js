const express = require('express')
const router = express.Router()
const upload = require('../utils/upload')
const authMiddleware = require('../middlewares/authMiddleware')
const validate = require('../middlewares/validate')
const { hotelSchema } = require('../utils/validators')
const {
    getAllHotels,
    getOneHotel,
    createHotel,
    updateHotel,
    deleteHotel
} = require('../controllers/hotelController')

router.get('/',     getAllHotels)
router.get('/:id',  getOneHotel)
router.post('/',    authMiddleware, upload.single('photo'), validate(hotelSchema), createHotel)
router.put('/:id',  authMiddleware, upload.single('photo'), updateHotel)
router.delete('/:id', authMiddleware, deleteHotel)

module.exports = router