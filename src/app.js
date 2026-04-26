const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path')
const connectDB = require('./db')

dotenv.config({ path: path.join(__dirname, '../.env') })
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Routes
app.use('/api/auth',      require('./routes/auth'))
app.use('/api/hotels',    require('./routes/hotels'))
app.use('/api/users',     require('./routes/users'))
app.use('/api/dashboard', require('./routes/dashboard'))

app.get('/', (req, res) => {
    res.json({ message: 'RED PRODUCT API fonctionne !' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`)
})