const encode_key = "selina_8d58f12a545sd10cy39w4psu4cnk"
const decode_key = "selina_s4w87gyt54a8s127q08s97jy4o8n"

const ROUTES_PREFIX = `/selina-auth-api`
const APP_ENV = process.env.APP_ENV
const SECRET_KEY = process.env.SECRET_KEY
const REDIS_ENDPOINT_URI = process.env.REDIS_ENDPOINT_URI
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
const MONGO_DB_URL = process.env.MONGO_DB_URL

const services = {
    profile: {
        production: {
            domain: "https://selina-profile-l839.onrender.com/selina-profile-api"
        },
        staging: {
            domain: "https://selina-proflle-staging.herokuapp.com/selina-profile-api"
        },
        local: {
            domain: "http://127.0.0.1:8801/selina-profile-api"
        }
    }
}

module.exports = { 
    decode_key,
    encode_key, 
    ROUTES_PREFIX,
    services,
    SECRET_KEY,
    APP_ENV,
    REDIS_ENDPOINT_URI,
    REDIS_PASSWORD,
    MONGO_DB_URL
}