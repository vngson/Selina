const { createClient } = require('redis')
const { REDIS_ENDPOINT_URI, REDIS_PASSWORD } = require('../configs/app_configs')


const redis_base = createClient({
    url: `redis://default:${REDIS_PASSWORD}@${REDIS_ENDPOINT_URI}`
})
redis_base.on('error', (err) => console.log('Redis Error', err))
redis_base.connect()

module.exports = { redis_base }
