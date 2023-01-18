const router = require('express').Router()
const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage()
})

const {
    add_new_product,
    get_product_info,
    find_products,
    modify_product_info,
    remove_product,
    consider_post_new_book,
    take_an_order,
    get_order_infos,
    get_pending_books,
    consider_an_order,
    get_shop_data,
    remove_book_group,
    modify_order_status
} = require("../controllers/product_handler")

const { 
    add_new_product_validator
} = require('../validation/add_product_validate')

const {
    search_term_validator
} = require('../validation/search_term_validate')

const {
    page_and_limit_validator
} = require('../validation/page_and_limit_validate')

const {
    consider_post_new_book_validator
} = require('../validation/consider_post_new_book_validate')

const {
    product_id_validator
} = require('../validation/product_id_validate')
const {
    take_an_order_validate
} = require('../validation/take_an_order_validate')

const { 
    auth_user_middleware
} = require('../middlewares/auth_user')

const {
    validate_request_middleware
} = require('../middlewares/validate_request')

const {
    process_search_term_middleware
} = require('../middlewares/process_search_term')

const {
    get_user_role_middleware
} = require('../middlewares/get_user_role')

const {
    consider_an_order_validator
} = require("../validation/consider_an_order")

const {
    modify_order_status_validator
} = require("../validation/modify_order_status_validate")

router.post(
    "/add-new-product", 
    auth_user_middleware,
    get_user_role_middleware,
    upload.single('image'),
    add_new_product_validator(),
    validate_request_middleware, 
    add_new_product
)

router.post(
    "/modify-product-info", 
    auth_user_middleware,
    get_user_role_middleware,
    upload.single('image'),
    add_new_product_validator(),
    validate_request_middleware, 
    modify_product_info
)

router.post(
    "/take-an-order", 
    auth_user_middleware,
    get_user_role_middleware,
    take_an_order_validate(),
    validate_request_middleware, 
    take_an_order
)

router.get(
    "/get-shop-data/:seller_id", 
    auth_user_middleware,
    get_user_role_middleware,
    get_shop_data
)

router.get(
    "/get-orders", 
    auth_user_middleware,
    get_user_role_middleware,
    get_order_infos
)

router.post(
    "/remove-product", 
    auth_user_middleware,
    get_user_role_middleware,
    remove_product
)

router.post(
    "/consider-post-new-book",
    auth_user_middleware,
    get_user_role_middleware,
    consider_post_new_book_validator(),
    validate_request_middleware,
    consider_post_new_book
)

router.get(
    "/get-product-info",
    auth_user_middleware,
    get_user_role_middleware,
    product_id_validator(),
    validate_request_middleware,
    get_product_info
)

router.get(
    "/search",
    auth_user_middleware,
    get_user_role_middleware,
    page_and_limit_validator(),
    search_term_validator(),
    validate_request_middleware,
    process_search_term_middleware,
    find_products
)

router.get(
    "/get-products-at-home",
    auth_user_middleware,
    get_user_role_middleware,
    page_and_limit_validator(),
    validate_request_middleware,
    find_products
)

router.get(
    "/get-pending-books", 
    auth_user_middleware,
    get_user_role_middleware,
    get_pending_books
)

router.post(
    "/consider-an-order", 
    auth_user_middleware,
    get_user_role_middleware,
    consider_an_order_validator(),
    validate_request_middleware, 
    consider_an_order
)

router.post(
    "/modify-order-status", 
    auth_user_middleware,
    get_user_role_middleware,
    modify_order_status_validator(),
    validate_request_middleware, 
    modify_order_status
)

router.post(
    "/remove-book-group",
    auth_user_middleware,
    get_user_role_middleware,
    remove_book_group
)

module.exports = router