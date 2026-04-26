const User = require('../models/User')
const Hotel = require('../models/Hotel')

const getKpis = async (req, res) => {
    try {
        const hotels = await Hotel.countDocuments()
        const users  = await User.countDocuments()

        res.json({
            users,
            hotels,
            messages : 40,
            emails   : 25,
            entities : 2,
            forms    : 125
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getKpis }