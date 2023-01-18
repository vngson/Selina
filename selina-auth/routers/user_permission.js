const router = require('express').Router()
const { 
    add_user_permission,
    get_user_permissions,
    add_user_permissions 
} = require('../controllers/user_permission')

const { 
    add_user_permission_validator,
    get_user_permissions_validator,
    add_user_permissions_validator
} = require('../validation/user_permission')

router.post("/add-user-permission", add_user_permission_validator(), add_user_permission)
router.post("/get-user-permission", get_user_permissions_validator(), get_user_permissions)
router.post("/add-user-permissions", add_user_permissions_validator(), add_user_permissions)

module.exports = router