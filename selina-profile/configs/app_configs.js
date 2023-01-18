const password_encode_key = "selina_8d58f12a545sd10cy39w4psu4cnk"
const ROUTES_PREFIX = `/selina-profile-api`

const otp_length = 8

const SECRET_KEY = process.env.SECRET_KEY
const APP_ENV = process.env.APP_ENV
const REDIS_ENDPOINT_URI = process.env.REDIS_ENDPOINT_URI
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
const MONGO_DB_URL = process.env.MONGO_DB_URL

module.exports = { 
    password_encode_key, 
    ROUTES_PREFIX,
    otp_length,
    REDIS_ENDPOINT_URI,
    REDIS_PASSWORD,
    SECRET_KEY,
    APP_ENV,
    MONGO_DB_URL
}