import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import "./order_info_card.css"
import { useState, forwardRef } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { APP_ENV } from "../../configs/app_config"
import SELINA_API_SERVICE_INFOS from "../../configs/selina_service_infos"
const { useNavigate } = require("react-router-dom")

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
})

export default function OrderInfoCard({order, set_has_token}) {
    const navigate = useNavigate()
    const [open, set_open_toastify] = useState(false)
    const [user_role, set_user_role] = useState(
        JSON.parse(sessionStorage.getItem("user_info")).user_type
    )
    const [hidden, set_hidden] = useState(false)
    const [loading, set_loading] = useState(false)
    const cancel_order = async () => {
        set_loading(true)
        const response = await axios.post(
            `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/modify-order-status`,
            {
                order_id: order.order_id,
                order_status: "cancelled"
            },
            {
                headers: {
                    authorization: localStorage.getItem("access_token")
                }
            }
        ).then((response) => {
            if (response?.data?.status_code?.toString() === '2') {
                localStorage.removeItem("access_token")
                set_has_token(false)
                return navigate("/authorization")
            }
            return response
        })

        if (response.data.status_code === 1) {
            order.status = "cancelled"
            set_order_status(order_status_adapter("cancelled"))
        }
        set_loading(false)
    }

    const received_order = async () => {
        set_loading(true)
        const response = await axios.post(
            `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/modify-order-status`,
            {
                order_id: order.order_id,
                order_status: "delivered"
            },
            {
                headers: {
                    authorization: localStorage.getItem("access_token")
                }
            }
        ).then((response) => {
            if (response?.data?.status_code?.toString() === '2') {
                localStorage.removeItem("access_token")
                set_has_token(false)
                return navigate("/authorization")
            }
            return response
        })

        if (response.data.status_code === 1) {
            order.status = "delivered"
            set_order_status(order_status_adapter("delivered"))
        }
        set_loading(false)
    }

    const order_status_adapter = (status) => {
        switch (status) {
            case "rejected":
                return {
                    message: "Bị từ chối",
                    modifier: "rejected",
                    button: false
                }
            case "delivering":
                return {
                    message: "Đang giao",
                    modifier: "delivering",
                    button: (
                        <>
                            <div className="order-info-cart__modify-btn-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="11.25" stroke="white"/>
                                    <path d="M7 12L10.75 15.75L17 8.25" stroke="white"/>
                                </svg>
                            </div>
                            <div className="order-info-cart__modify-btn-lab">
                                Đã nhận hàng
                            </div>
                        </>
                    ),
                    event: received_order
                }
            case "waiting":
                return {
                    message: "Chờ xác nhận",
                    modifier: "waiting",
                    button: (
                        <>
                            <div className="order-info-cart__modify-btn-icon">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.5 0.5L0.5 15.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M0.5 0.5L15.5 15.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="order-info-cart__modify-btn-lab">
                                Hủy đơn hàng
                            </div>
                        </>
                    ),
                    event: cancel_order
                }
            case "delivered":
                return {
                    message: "Đã nhận",
                    modifier: "delivered",
                    button: false
                }
            case "cancelled":
                return {
                    message: "Đã hủy",
                    modifier: "cancelled",
                    button: false
                }
        }
    }
    const [order_status, set_order_status] = useState(order_status_adapter(order.status))

    const handle_close_toastify = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        set_open_toastify(false);
    }

    const approve_an_order_handle = async () => {
        set_loading(true)
        const response = await axios.post(
            `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/consider-an-order`,
            {
                order_id: order.order_id,
                result: true
            },
            {
                headers: {
                    authorization: localStorage.getItem("access_token")
                }
            }
        ).then((response) => {
            if (response?.data?.status_code?.toString() === '2') {
                localStorage.removeItem("access_token")
                set_has_token(false)
                return navigate("/authorization")
            }
            return response
        })

        if(response.data.status_code.toString() === "1") {
            set_hidden(true)
            set_open_toastify(true)
        }
        set_loading(false)
    }
    
    const reject_an_order_handle = async () => {
        set_loading(true)
        const response = await axios.post(
            `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/consider-an-order`,
            {
                order_id: order.order_id,
                result: false
            },
            {
                headers: {
                    authorization: localStorage.getItem("access_token")
                }
            }
        ).then((response) => {
            if (response?.data?.status_code?.toString() === '2') {
                localStorage.removeItem("access_token")
                set_has_token(false)
                return navigate("/authorization")
            }
            return response
        })

        if(response.data.status_code.toString() === "1") {
            set_open_toastify(true)
            set_hidden(true)
        }
        set_loading(false)
    }
    
    return (
        <>
            <Stack spacing={2} sx={{ width: '0' }}>
                <Snackbar open={open} autoHideDuration={3000} onClose={handle_close_toastify}>
                    <Alert onClose={handle_close_toastify} severity="success" sx={{ width: '100%' }}>
                        Thành công!
                    </Alert>
                </Snackbar>
            </Stack>
            {
                !hidden
                ? <div className="order-info-cart">
                    <Link to="/" className="order-info-cart__row order-info-cart__row--p">
                        <img src={order.rest_user.avatar_url || "/images/default_avt.png"} alt="" className="order-info-cart__shop-img" />
                        <div className="order-info-cart__shop-name">
                            <b>{order.rest_user.full_name}</b>
                        </div>
                    </Link>
                    <div className="order-info-cart__row order-info-cart__row--p">
                        {
                            order.books.map((book, idx) => (
                                <div className="order-info-cart__book" key={idx}>
                                    <Link to={`/book/${book.book_id}`} className="order-info-cart__book-img-wrapper">
                                        <img src={book.image} className="order-info-cart__book-img" />
                                    </Link>
                                    <div className="order-info-cart__book--30">
                                        <div className="order-info-cart__book-name">
                                            {book.name}
                                        </div>
                                        <div className="order-info-cart__book-quantity">
                                            x{book.quantity}
                                        </div>
                                    </div>
                                    <div className="order-info-cart__book-desc">
                                        {book.desc}
                                    </div>
                                    <div className="order-info-cart__book-price">
                                        {book.price}đ
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    {
                        user_role === "normal_user"
                        ? <>
                            <div className="order-info-cart__row order-info-cart__row--border order-info-cart__row--p order-info-cart__row--df">
                                <div className="order-info-cart__order-status">
                                    <div className="order-info-cart__order-status-label">Trạng thái đơn hàng: </div>
                                    <div className={`order-info-cart__order-status-result ${order_status.modifier}`}>{order_status.message}</div>
                                </div>
                                <div className="order-info-cart__order-price">
                                    Tổng cộng: 
                                    <div className="order-info-cart__order-price-num">
                                        {order.total_price + "đ"}
                                    </div>
                                </div>
                            </div>
                            <div className="order-info-cart__row">
                                {
                                    order_status.button
                                    ? <div className="order-info-cart__modify-order">
                                        <div className={`order-info-cart__modify-btn ${order_status.modifier}`} onClick={order_status.event}>
                                            {
                                                loading
                                                ? <CircularProgress color="inherit" style={{padding: "8px"}}/>
                                                : order_status.button
                                            }
                                        </div>
                                    </div>
                                    : <></>
                                }
                            </div>
                        </>
                        : <></>
                    }
                    <div className="order-info-cart__row">
                        {
                            user_role === "seller"
                            ? <div className="order-info-cart__order-price order-info-cart__order-price--border">
                                Tổng cộng: 
                                <div className="order-info-cart__order-price-num">
                                    {order.total_price + "đ"}
                                </div>
                            </div>
                            : <></>
                        }
                    </div>
                    <div className="order-info-cart__row order-info-cart__row--p">
                        {
                            user_role === "seller"
                            ? <div className="order-info-cart__cus-info">
                                <div className="order-info-cart__cus-info-left">
                                    <div className="order-info-cart__cus-info-left-item order-info-cart__cus-name">
                                        <b>Tên khách hàng</b>: {order.rest_user.full_name}
                                    </div>
                                    <div className="order-info-cart__cus-info-left-item order-info-cart__cus-phone">
                                        <b>Số điện thoại khách hàng</b>: {order.phone_number}
                                    </div>
                                    <div className="order-info-cart__cus-info-left-item order-info-cart__cus-address">
                                        <b>Địa chỉ giao hàng</b>: {order.delivered_to}
                                    </div>
                                </div>
                                <div className="order-info-cart__cus-info-right">
                                    <div className="order-info-cart__submit-label">
                                        Xác nhận đơn hàng?
                                    </div>
                                    <div className="order-info-cart__btn-area">
                                        <div className="order-info-cart__submit-btn" onClick={approve_an_order_handle}>
                                            {
                                                loading
                                                ? <CircularProgress color="inherit" style={{padding: "8px"}}/>
                                                : <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="12" r="11.25" stroke="white"/>
                                                    <path d="M7 12L10.75 15.75L17 8.25" stroke="white"/>
                                                </svg>
                                            }
                                        </div>
                                        <div className="order-info-cart__reject-btn" onClick={reject_an_order_handle}>
                                            {
                                                loading
                                                ? <CircularProgress color="inherit" style={{padding: "8px"}}/>
                                                : <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15.5 0.5L0.5 15.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M0.5 0.5L15.5 15.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : <></>
                        }
                    </div>
                </div>
                : <></>
            }     
        </>
    )
}