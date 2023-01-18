const { redis_base } = require('./redis_base')

const get_session_data = async (req) => {
    const access_token = req.headers.authorization
    const user_session = await redis_base.get(`access_token_${access_token.replace("Bearer ", "")}`)

    return user_session
}

module.exports = get_session_data