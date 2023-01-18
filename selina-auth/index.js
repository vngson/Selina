const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')
const cors = require('cors')

const app = express()

dotenv.config()

const { 
    ROUTES_PREFIX,
    MONGO_DB_URL,
    APP_ENV
} = require('./configs/app_configs')

const authen_router = require('./routers/authen')
const permission_router = require('./routers/permission')
const user_permission_router = require('./routers/user_permission')


mongoose.connect(
    MONGO_DB_URL,
    { useNewUrlParser: true },
    () => {
        console.log('Connected to MongoDB...')
    }
)

// Middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(cors())
// app.use(cors({origin: process.env.CLIENT_URL}))

app.get("/", (req, res) => {
    res.send(`Selina - Authorization Service (${APP_ENV})`)
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.use(ROUTES_PREFIX + "", authen_router)
app.use(ROUTES_PREFIX + "", user_permission_router)
app.use(ROUTES_PREFIX + "", permission_router)

app.listen(process.env.PORT || 8800 , () => {
    console.log(`Authorization service (env: ${APP_ENV}) is running...`)
})

