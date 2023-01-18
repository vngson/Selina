const router = require('express').Router()
const { add_new_permission } = require('../controllers/permission')

router.post("/add-new-permission", add_new_permission)

module.exports = router