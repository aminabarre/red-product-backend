const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    adresse: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    prix: {
        type: Number,
        required: true
    },
    devise: {
        type: String,
        default: 'XOF'
    },
    photo: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Hotel', hotelSchema)