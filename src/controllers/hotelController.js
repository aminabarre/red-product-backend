const Hotel = require('../models/Hotel')

const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find()
        res.json(hotels)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getOneHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id)
        if (!hotel) return res.status(404).json({ message: 'Hôtel non trouvé' })
        res.json(hotel)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createHotel = async (req, res) => {
    try {
        const photoUrl = req.file ? req.file.path : null

        const hotel = new Hotel({
            ...req.body,
            photo: photoUrl
        })

        await hotel.save()
        res.status(201).json({ message: 'Hôtel créé !', hotel })
    } catch (error) {
        console.log('Erreur détaillée :', JSON.stringify(error, null, 2))
        res.status(500).json({ message: error.message })
    }
}

const updateHotel = async (req, res) => {
    try {
        const updateData = { ...req.body }
        if (req.file) {
            updateData.photo = req.file.path
        }
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, updateData, { new: true })
        if (!hotel) return res.status(404).json({ message: 'Hôtel non trouvé' })
        res.json({ message: 'Hôtel modifié !', hotel })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id)
        if (!hotel) return res.status(404).json({ message: 'Hôtel non trouvé' })
        res.json({ message: 'Hôtel supprimé !' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getAllHotels, getOneHotel, createHotel, updateHotel, deleteHotel }