const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const multer = require('multer')
const cors = require('cors')

dotenv.config()

const app = express()

const { ROUTES_PREFIX, MONGO_DB_URL, APP_ENV } = require('./configs/app_configs')

const account_router = require('./routes/account')
const user_info_router = require('./routes/user_info')
const upload_router = require('./routes/upload_file_to_fb')


mongoose.connect(
    MONGO_DB_URL,
    { useNewUrlParser: true },
    () => {
        console.log('Connected to MongoDB...')
    }
)

app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(cors())

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
})

app.get("/", (req, res) => {
    res.send(`Selina - Profile Service (${APP_ENV})`)
})
app.use(ROUTES_PREFIX + "", account_router)
app.use(ROUTES_PREFIX + "", user_info_router)
app.use(ROUTES_PREFIX + "", upload_router)

app.listen(process.env.PORT || 8801 , () => {
    console.log(`Profile service (env: ${APP_ENV}) is running...`)
})
