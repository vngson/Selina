const response_data = require("../helpers/response")
const upload_image = require("../helpers/upload_image_to_storage")
const get_session_data = require("../helpers/get_session_data")
const Product = require('../models/product')
const BookInCart = require('../models/book_in_cart')
const BookGroup = require('../models/book_group')
const Order = require('../models/order')
const { APP_ENV } = require('../configs/app_configs')
const  SELINA_API_SERVICE_INFOS = require('../configs/selina_service_infos')
const axios = require("axios")

const add_new_product = async (req, res, next) => {
    try {
        const session_data = JSON.parse(await get_session_data(req))
        const seller_id = session_data.user_id
        const body = req.body
        const product_image = req.file

        if (product_image && !product_image.mimetype.includes("image")) {
            return res.json(response_data(
                "image_invalid",
                status_code=4,
                message="Hình ảnh không hợp lệ!",
                role=req?.role
            ))
        }
        const upload_image_res = await upload_image(product_image)
        const image_url = upload_image_res?.data?.url

        const new_product_data = {
            seller_id: seller_id,
            name: body?.name,
            desc: body?.desc,
            price: body?.price,
            quantity: body?.quantity,
            author: body?.author,
            image: image_url
        }

        const new_product = new Product(new_product_data)
        const new_product_validate = new_product.validateSync()

        if (!!new_product_validate) {
            return res.json(response_data(
                "product_info_invalid",
                status_code=4,
                message="Thêm sản phẩm thất bại!",
                role=req?.role
            ))
        }

        const save_res = Boolean(await new_product.save())

        if (!save_res) {
            return res.json(response_data(
                "add_new_product_fail",
                status_code=4,
                message="Thêm sản phẩm thất bại!",
                role=req?.role
            ))
        }
        
        return res.json(response_data("success", status_code=1, message="Thành công!", role=req?.role))
    }
    catch (err) {
        return res.json(response_data(
            data=err.message, 
            status_code=4, 
            message="Lỗi hệ thống!",
            role=req?.role
        ))
    }
}

const get_product_info = async (req, res) => {
    try {
        const user_role = req?.user_role
        const session_data = JSON.parse(await get_session_data(req))
        const product_id = Number(req?.query?.id)

        database_query = { "product_id": product_id }

        switch (user_role) {
            case "admin":
                database_query.status = "pending"
                break
            case "seller":
                database_query.status = "approved"
                database_query.seller_id = session_data.user_id
                break
            case "normal_user":
                database_query.status = "approved"
                break
        }
        database_query.is_deleted = false
        
        let product_info = await Product.findOne(
            database_query
        )

        console.log("--->", product_info)

        const seller_info_response = await axios.post(
            `${SELINA_API_SERVICE_INFOS.profile[APP_ENV].domain}/get-user-info-by-id`,
            {
                user_id: product_info?.seller_id
            }
        ).then(function (response) {
            return response.data
        })

        const seller_info = seller_info_response.data

        const book = product_info.toObject()
        book.seller_info = seller_info

        return res.json(response_data(
            book,
            status_code=1,
            message="Thành công",
            role=user_role
        ))
    }
    catch(err) {
        return res.json(response_data(
            data=err.message,
            status_code=4,
            message="Lỗi hệ thống!",
            role=req?.user_role
        ))
    }
}

const find_products = async (req, res) => {
    try {
        const page = Number(req?.query?.page) || 1
        const limit = Number(req?.query?.limit) || 20
        const user_role = req?.user_role // middlewares/get_user_role
        const session_data = JSON.parse(await get_session_data(req))
        const seller_id = Number(session_data?.user_id)

        let database_query = req?.temp_database_query || {}
        switch (user_role) {
            case "admin":
                database_query.status = "pending"
                break
            case "seller":
                database_query.status = "approved"
                database_query.seller_id = seller_id
                break
            case "normal_user":
                database_query.status = "approved"
                break
        }
        database_query.is_deleted = false
        // if (Object.keys(database_query).length == 0) {
        //     throw Error("invalid role")
        // }
        const query_options = {
            page: page,
            limit: limit
        }
        let products = await Product.paginate(database_query, query_options)
        return res.json(response_data(
            data=products,
            status_code=1, 
            message="Thành công",
            role=user_role
        ))
    }
    catch (err) {
        return res.json(response_data(
            data=err.message, 
            status_code=4, 
            message="Lỗi hệ thống!",
            role=req?.user_role
        ))
    }
}

const modify_product_info = async (req, res, next) => {
    try {
        const session_data = JSON.parse(await get_session_data(req))
        const seller_id = session_data.user_id
        const body = req.body
        const book_id = body?.book_id
        const product_image = req.file
        let image_url = ""

        if (req?.user_role !== "seller") {
            return res.json(response_data(
                "no_permit",
                4,
                "Bạn không có quyền thực hiện chức năng này!",
                req?.user_role
            ))
        }

        if (product_image) {
            if (!!product_image.mimetype.includes("image")) {
                return res.json(response_data(
                    "image_invalid",
                    status_code=4,
                    message="Hình ảnh không hợp lệ!",
                    role=req?.role
                ))
            }
            else {
                const upload_image_res = await upload_image(product_image)
                image_url = upload_image_res?.data?.url
            }
        }

        const update_res = await Product.updateOne({
                seller_id: seller_id,
                product_id: book_id
            },
            image_url 
            ? {
                name: body?.name,
                desc: body?.desc,
                price: Number(body?.price),
                image: image_url,
                quantity: Number(body?.quantity),
                author: body.author
            }
            :{
                name: body?.name,
                desc: body?.desc,
                price: Number(body?.price),
                quantity: Number(body?.quantity),
                author: body.author
            }
        )
        if (update_res.matchedCount === 1) {
            return res.json(response_data("modify_success", 1, "Sửa thông tin thành công!", req.user_role))
        }
        else {
            return res.json(response_data("product_not_found", 1, "Không tìm thấy thông tin sản phẩm!", req.user_role))
        }
    }
    catch (err) {
        return res.json(response_data(
            data=err.message, 
            status_code=4, 
            message="Lỗi hệ thống!",
            role=req?.user_role
        ))
    }
}

const remove_product = async (req, res) => {
    try {
        const body = req.body
        const session_data = JSON.parse(await get_session_data(req))
        const user_id = session_data.user_id
        const book_id = Number(body.book_id)

        if (req.user_role !== "seller") {
            return res.json(response_data(
                "no_permit",
                4,
                "Bạn không có quyền thực hiện chức năng này!",
                req?.user_role
            ))
        }

        const remove_res = await Product.updateOne({
            seller_id: user_id,
            product_id: book_id
        }, 
        {
            is_deleted: true
        })
        if (remove_res.matchedCount === 1) {
            return res.json(response_data("success", 1, "Thành công!", req.user_role))
        }
        else {
            return res.json(response_data("product_not_found", 4, "", req.user_role))
        }
    }
    catch (err) {
        return res.json(response_data(
            data=err.message, 
            status_code=4, 
            message="Lỗi hệ thống!",
            role=req?.user_role
        ))
    }
}

const take_an_order = async (req, res) => {
    try {
        const body = req.body
        const address = body.address
        const phone_num = body.phone_num
        const book_group_id = Number(body.book_group_id)
        const user_session = JSON.parse(await get_session_data(req))

        if (req.user_role !== "normal_user") {
            return res.json(response_data(
                "no_permit",
                4,
                "Bạn không có quyền thực hiện chức năng này!",
                req?.user_role
            ))
        }

        const user_id = user_session.user_id
        const user_address = address
        const user_phone = phone_num

        if (!user_address) {
            return res.json(response_data(
                "order_info_invalid",
                status_code=4,
                message="Vui lòng thêm địa chỉ để tiến hành đặt hàng!",
                role=req?.role
            ))
        }
        else if (!user_phone) {
            return res.json(response_data(
                "order_info_invalid",
                status_code=4,
                message="Vui lòng thêm số điện thoại để tiến hành đặt hàng!",
                role=req?.role
            ))
        }

        const book_group = await BookGroup.findOne({
            group_id: book_group_id,
            is_deleted: false
        })

        if (!book_group) {
            return res.json(response_data("book_group_not_found", 4, "Đặt hàng không thành công!", req.user_role)) 
        }
        
        const books_in_cart = await BookInCart.find({
            book_group_id: book_group_id,
            is_deleted: false
        })

        if(!books_in_cart) {
            return res.json(response_data("books_in_cart_empty", 4, "Đặt hàng không thành công!", req.user_role))
        }

        const list_book_id = books_in_cart.map(b => b.book_id)

        const origin_books = await Product.find({
            product_id: {
                $in: list_book_id
            }
        })

        for (const origin_book of origin_books) {
            for (const book_in_cart of books_in_cart) {
                if (origin_book.product_id === book_in_cart.book_id) {
                    if (book_in_cart.quantity > origin_book.quantity) {
                        return res.json(response_data(
                            "not_enough_quantity",
                            4,
                            `Sản phẩm "${origin_book.name}" không còn đủ số lượng cho đơn hàng của bạn!`,
                            req.user_role
                        ))
                    }
                }
            }
        }

        let total_price = 0
        books_in_cart.forEach(book => total_price += Number(book.price))

        const new_order_data = {
            buyer_id: user_id,
            seller_id: book_group.seller_id,
            book_group_id: book_group_id,
            delivered_to: user_address,
            phone_number: user_phone,
            total_price: Number(total_price)
        }
        const new_order = new Order(new_order_data)

        if (!!new_order.validateSync()) {
            console.log(new_order.errors)
            return res.json(response_data(
                "order_info_invalid",
                status_code=4,
                message="Đặt hàng không thành công!",
                role=req?.role
            )) 
        }

        if (!Boolean(await new_order.save())) {
            return res.json(response_data(
                "product_info_invalid",
                status_code=4,
                message="Đặt hàng không thành công!",
                role=req?.role
            )) 
        }

        book_group.is_deleted = true
        await book_group.save()
        books_in_cart.forEach(book => {
            book.is_deleted = true
            book.save()
        })
        return res.json(response_data("success", 1, "Đặt hàng thành công!", req.user_role))
    }
    catch (err) {
        return res.json(response_data(
            data=err.message, 
            status_code=4, 
            message="Lỗi hệ thống!",
            role=req?.user_role
        ))
    }
}

const get_order_infos = async (req, res, next) => {
    try {
        const user_session = JSON.parse(await get_session_data(req))
        const user_role = req.user_role
        const query = {}
        const page = Number(req?.query?.page) || 1
        const limit = Number(req?.query?.limit) || 2

        switch (user_role) {
            case "normal_user":
                query.buyer_id = user_session.user_id
                break;
            case "seller":
                query.seller_id = user_session.user_id
                query.status = "waiting"
                break;
        }

        if (!query) {
            return res.json(response_data(
                "no_permit",
                4,
                "Bạn không có quyền thực hiện chức năng này!",
                req?.user_role
            ))
        }

        const orders_docs = await Order.find(
            query

        )
        const orders = orders_docs
        const orders_res = []
        
        for (let order of orders) {
            const books_in_cart = await BookInCart.find({
                book_group_id: order.book_group_id
            })
            order_temp = order.toObject()

            const rest_user_query = user_role === "normal_user"
            ? {
                user_id: order.seller_id
            }
            : {
                user_id: order.buyer_id
            }
            
            const rest_user = await axios.post(
                `${SELINA_API_SERVICE_INFOS.profile[APP_ENV].domain}/get-user-info-by-id`,
                rest_user_query
            ).then(function (response) {
                return response.data
            })
            
            order_temp.rest_user = rest_user.data
            order_temp.books = books_in_cart
            orders_res.push(order_temp)
        }

        const res_data = {
            data: orders_res
        }

        return res.json(response_data(res_data, 1, "", req.user_role))
    }
    catch (err) {
        return res.json(response_data(
            data=err.message, 
            status_code=4, 
            message="Lỗi hệ thống!",
            role=req?.user_role
        ))
    }
}

const consider_post_new_book = async (req, res) => {
    try {
        const user_role = req?.user_role
        const book_id = req?.query?.book_id
        const approved = req?.body?.approved

        if (user_role !== "admin") {
            return res.json(response_data(
                "no_permit",
                4,
                "Bạn không có quyền thực hiện chức năng này!",
                user_role
            ))
        }
        const book = await Product.findOne({ product_id: book_id })
        if (!Boolean(book) || book.is_deleted) {
            return res.json(response_data("product_not_found", 4, "Sản phẩm không tồn tại hoặc đã bị xóa", user_role))
        }
        else if (book.status !== "pending") {
            return res.json(response_data("product_not_pending", 4, "Sản phẩm đã được duyệt/từ chối trước đó", user_role))
        }
        else {
            const consider_res = await Product.updateOne(
                { product_id: book_id }, 
                { status: approved ? "approved" : "rejected" }
            )
            return res.json(response_data("success", 1, "Thành công!", req.user_role))
        }
    }
    catch (err) {
        return res.json(response_data(
            data=err.message,
            status_code=4,
            message="Lỗi hệ thống!",
            role=req?.user_role
        ))
    }
}

const consider_an_order = async (req, res) => {
    try {
        if (req.user_role !== "seller") {
            return res.json(response_data(
                "no_permit",
                4,
                "Bạn không có quyền thực hiện chức năng này!",
                req?.user_role
            ))
        }

        const body = req.body
        const order_id = body.order_id
        const result = body.result

        const order_status = result ? "delivering" : "rejected"

        const update_res = await Order.updateOne({
            order_id: order_id
        }, {
            $set: {
                status: order_status
            }
        })
        if (update_res.modifiedCount === 0) {
            return res.json(response_data("fail", 4, "Duyệt đơn hàng không thành công!", req.user_role))
        }

        const order = await Order.findOne({
            order_id: order_id
        })

        if (!order) {
            return res.json(response_data("fail", 4, "Duyệt đơn hàng không thành công!", req.user_role)) 
        }

        const books_in_cart = await BookInCart.find({
            book_group_id: order.book_group_id
        })

        const list_book_id = books_in_cart.map(b => b.book_id)
        const books = await Product.find({
            product_id: {
                $in: list_book_id
            }
        })   
        
        for (const book of books) {
            for (const book_in_cart of books_in_cart) {
                if (book.product_id === book_in_cart.book_id) {
                    book.quantity -= book_in_cart.quantity
                    await book.save()
                }
            }
        }
        return res.json(response_data())
    }
    catch (err) {
        return res.json(response_data(
            data=err.message, 
            status_code=4, 
            message="Lỗi hệ thống!",
            role=req?.user_role
        ))
    } 
}

const get_pending_books = async (req, res) => {
    try {
        if (req.user_role !== "admin") {
            return res.json(response_data(
                "no_permit",
                4,
                "Bạn không có quyền thực hiện chức năng này!",
                req?.user_role
            ))
        }

        const page = Number(req?.query?.page) || 1
        const limit = Number(req?.query?.limit) || 10
        
        const books_docs = await Product.paginate(
            {
                status: "pending"
            },
            {
                page: page,
                limit: limit
            }
        )

        const books = books_docs.docs
        const rest_dest = { docs, ...rest } = books_docs
        
        const list_seller_id = books.map(book => book.seller_id)
    
        const sellers_data_response = await axios.post(
            `${SELINA_API_SERVICE_INFOS.profile[APP_ENV].domain}/get-list-user-info-by-id`,
            {
                list_user_id: list_seller_id
            }
        ).then(response => response)
    
        const sellers = sellers_data_response.data.data
    
        let books_res = []
    
        for (let seller of sellers) {
            for (let book of books) {
                if (book.seller_id === seller.user_id) {
                    let _book = book.toObject()
                    delete seller.password
                    _book.seller_info = seller
                    books_res.push(_book)
                }
            }
        }
    
        return res.json(response_data({
            books: books_res,
            ...rest
        }))
    }
    catch (err) {
        return res.json(response_data(
            data=err.message, 
            status_code=4, 
            message="Lỗi hệ thống!",
            role=req?.user_role
        ))
    }
}

const get_shop_data = async (req, res) => {
    try {
        const seller_id = req?.params?.seller_id
        const page = Number(req?.query?.page) || 1
        const limit = Number(req?.query?.limit) || 20

        if (!seller_id) {
            return res.json(response_data(
                data="shop_not_found", 
                status_code=4, 
                message="Lỗi hệ thống!",
                role=req?.user_role
            ))
        }

        const products = await Product.paginate(
            {
                seller_id: seller_id,
                status: "approved"
            },
            {
                limit: limit,
                page: page
            }
        )

        return res.json(response_data(products))
    }
    catch (err) {
        return res.json(response_data(
            data=err.message, 
            status_code=4, 
            message="Lỗi hệ thống!",
            role=req?.user_role
        ))
    }
}

const remove_book_group = async (req, res) => {
    try {
        if (req.user_role !== "normal_user") {
            return res.json(response_data(
                "no_permit",
                4,
                "Bạn không có quyền thực hiện chức năng này!",
                req?.user_role
            ))
        }
        const user_session = JSON.parse(await get_session_data(req))
        const book_group_id = Number(req.body?.book_group_id)

        const book_group = await BookGroup.findOne({
            group_id: book_group_id,
            is_deleted: false
        })
        if (!book_group) {
            return res.json(response_data(
                "book_group_not_found",
                4,
                "Book group không tồn tại",
                req?.user_role
            ))
        }
        if (book_group.buyer_id !== user_session.user_id) {
            return res.json(response_data(
                "no_permit",
                4,
                "Bạn không có quyền thực hiện chức năng này!",
                req?.user_role
            ))
        }

        const remove_group = await BookGroup.updateOne({
            group_id: book_group_id
        }, {
            $set: {
                is_deleted: true
            }
        })
        if (remove_group.modifiedCount === 0) {
            return res.json(response_data("fail", 4, "Xóa book group không thành công", req?.user_role))
        }

        const remove_group_books_res = await BookInCart.updateMany({
            book_group_id: book_group_id,
            is_deleted: false
        }, {
            $set: {
                is_deleted: true
            }
        })
        if (remove_group_books_res.matchedCount !== remove_group_books_res.modifiedCount) {
            return res.json(response_data("fail", 4, "Xóa book group không thành công", req?.user_role))
        }
        return res.json(response_data("success", 1, "Thành công", req?.user_role))
    }
    catch (err) {
        return res.json(response_data(
            data=err.message,
            status_code=4,
            message="Lỗi hệ thống!",
            role=req?.user_role
        ))
    }
}

const modify_order_status = async (req, res, next) => {
    try {
        if (req.user_role !== "normal_user") {
            return res.json(response_data(
                "no_permit",
                4,
                "Bạn không có quyền thực hiện hiện chức năng này!",
                req.user_role
            ))
        }
        const body = req.body
        const user_session = JSON.parse(await get_session_data(req))
        const order_id = body.order_id
        const order_status = body.order_status
        const user_id = user_session.user_id

        const modify_res = await Order.updateOne({
            order_id: order_id,
            buyer_id: user_id
        },
        {
            $set: {
                status: order_status
            }
        })
        if (modify_res.modifiedCount !== 0) {
            return res.json(response_data())
        }
        else {
            return res.json(response_data("no_modify", 4, "no_modify", req.user_role))
        }
    }
    catch (err) {
        return res.json(response_data(
            data=err.message,
            status_code=4,
            message="Lỗi hệ thống!",
            role=req?.user_role
        ))
    }
}

module.exports = {
    add_new_product,
    get_product_info,
    find_products,
    modify_product_info,
    remove_product,
    consider_post_new_book,
    take_an_order,
    get_order_infos,
    consider_an_order,
    get_pending_books,
    get_shop_data,
    remove_book_group,
    modify_order_status
}