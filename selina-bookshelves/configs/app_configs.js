const ROUTES_PREFIX = `/selina-bookshelves-api`
const SECRET_KEY = process.env.SECRET_KEY
const APP_ENV = process.env.APP_ENV
const REDIS_ENDPOINT_URI = process.env.REDIS_ENDPOINT_URI
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
const MONGO_DB_URL = process.env.MONGO_DB_URL

module.exports = { 
    ROUTES_PREFIX,
    REDIS_ENDPOINT_URI,
    REDIS_PASSWORD,
    SECRET_KEY,
    APP_ENV,
    MONGO_DB_URL
}