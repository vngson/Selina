const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')
const cors = require('cors')

dotenv.config()

const { 
    ROUTES_PREFIX,
    APP_ENV,
    MONGO_DB_URL
} = require('./configs/app_configs')

const product_router = require('./routers/product')
const cart_router = require('./routers/cart')

const app = express()

mongoose.connect(
    MONGO_DB_URL,
    { 
        useNewUrlParser: true 
    },
    () => {
        console.log('Connected to MongoDB...')
    }
)

app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(cors());

app.get("/", (req, res) => {
    res.send(`Selina - Bookshelves Service (${APP_ENV})`)
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.use(ROUTES_PREFIX + "", product_router)
app.use(ROUTES_PREFIX + "", cart_router)

app.listen(process.env.PORT || 8802 , () => {
    console.log(`Bookshelves service (env: ${process.env.APP_ENV}) is running...`)
})