const { redis_base } = require('./redis_base')
const { otp_length } = require('../configs/app_configs')

const generate_otp = async (email, key) => {
    let otp = ""

    for (let i = 0; i < otp_length; i++) {
        otp += Math.floor(Math.random() * 10)
    }
    const key_redis = key + email
    await redis_base.set(key_redis, otp, {
        EX: 5*60,
    })

    return otp
}

module.exports = generate_otp