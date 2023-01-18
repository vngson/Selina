const router = require('express').Router()
const { login, refresh_token, ping, logout, get_user_tokens } = require('../controllers/authen')
const { auth_user_middleware } = require('../middlewares/auth_user')

router.post("/login", login)
router.post("/refresh-token", refresh_token)
router.get("/ping", auth_user_middleware, ping)
router.get("/logout", logout)
router.post("/get-user-tokens", get_user_tokens)

module.exports = router