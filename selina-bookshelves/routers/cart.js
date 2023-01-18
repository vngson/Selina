const router = require('express').Router()

const { 
    auth_user_middleware
} = require('../middlewares/auth_user')

const {
    validate_request_middleware
} = require('../middlewares/validate_request')

const {
    get_user_role_middleware
} = require('../middlewares/get_user_role')

const {
    add_product_to_cart,
    get_cart_info,
    modify_quantity_book_in_cart,
    get_checkout,
    remove_book_in_cart
} = require("../controllers/cart_handler")

const {
    add_product_to_cart_validator
} = require("../validation/add_product_to_cart")

router.post(
    "/add-product-to-cart",
    auth_user_middleware,
    get_user_role_middleware,
    add_product_to_cart_validator(),
    validate_request_middleware,
    add_product_to_cart
)

router.post(
    "/modify-quantity-book-in-cart",
    auth_user_middleware,
    get_user_role_middleware,
    modify_quantity_book_in_cart
)

router.get(
    "/get-cart-info",
    auth_user_middleware,
    get_user_role_middleware,
    get_cart_info
)

router.get(
    "/get-checkout/:checkout_id",
    auth_user_middleware,
    get_user_role_middleware,
    get_checkout
)

router.post(
    "/remove-book-in-cart",
    auth_user_middleware,
    get_user_role_middleware,
    remove_book_in_cart
)

module.exports = router