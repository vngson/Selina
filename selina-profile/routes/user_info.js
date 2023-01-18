const router = require('express').Router()
const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage()
})

const { 
    get_user_info_by_id, 
    get_user_info_by_email,
    get_list_user_info_by_id,
    get_personal_info,
    modify_personal_info,
    get_all_user,
    ban_user,
    unlock_user
} = require('../controllers/user_info')

const {
    personal_info_modification_form_validator,
    user_id_input_validator
} = require('../validation/user_info')

const {
    auth_user_middleware
} = require('../middlewares/auth_user')

router.post("/get-user-info-by-id", get_user_info_by_id)
router.post("/get-user-info-by-email", get_user_info_by_email)
router.post("/get-list-user-info-by-id", get_list_user_info_by_id)

router.get("/get-personal-info", auth_user_middleware, get_personal_info)
router.get("/get-all-users", auth_user_middleware, get_all_user)
router.post(
    "/modify-personal-info",
    auth_user_middleware,
    personal_info_modification_form_validator(),
    upload.single('image'),
    modify_personal_info
)

router.post(
    "/ban-user",
    auth_user_middleware,
    user_id_input_validator(),
    ban_user
)

router.post(
    "/unlock-user",
    auth_user_middleware,
    user_id_input_validator(),
    unlock_user
)

module.exports = router