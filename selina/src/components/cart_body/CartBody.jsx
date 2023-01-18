import "./cart_body.css"
import ShopSection from "../shop_section/ShopSection"
import axios from "axios"
import { useState, useEffect, forwardRef } from "react"
import SELINA_API_SERVICE_INFOS from "../../configs/selina_service_infos"
import { APP_ENV } from "../../configs/app_config"
import { useNavigate } from "react-router-dom"
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import DeleteIcon from '@mui/icons-material/Delete'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
})

export default function CartBody({set_has_token}) {
    const [shops, set_shops] = useState([])
    const [checkout_id, set_checkout_id] = useState(0)
    const [checkout_shop, set_checkout_shop] = useState(null)
    const [open, set_open_toastify] = useState(false)
    const [total_price, set_total_price] = useState(0)
    const [loading, set_loading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const get_cart_info = async () => {
            const response = await axios.get(
                `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/get-cart-info`,
                {
                    headers: {
                        Authorization: localStorage.getItem("access_token")
                    }
                }
            ).then(response => {
                if (response?.data?.status_code?.toString() === '2') {
                    localStorage.removeItem("access_token")
                    set_has_token(false)
                    return navigate("/authorization")
                }
                return response
            })
            set_shops(response?.data?.data)
            set_loading(false)
        }
        get_cart_info()
    }, [])

    const handle_close_toastify = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        set_open_toastify(false);
    }

    const checkout_handler = (e) => {
        if (!checkout_shop) {
            // set_open_toastify(true)
            return
        }
        const shop_str_data = JSON.stringify(checkout_shop)
        sessionStorage.setItem("checkout_data", shop_str_data)
        navigate(`/checkout/${checkout_id}`)
    }

    const remove_section = async () => {
        console.log(checkout_shop)
        if (!checkout_shop) {
            // set_open_toastify(true)
            return
        }
        const response = await axios.post(
            `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/remove-book-group`,
            {
                book_group_id: checkout_id
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

        if (response?.data?.status_code === 1) {
            set_shops(shops_data => shops_data.filter(shop => shop.group_id !== checkout_id))
            set_checkout_shop(null)
            set_total_price(0)
        }
    }

    return (
        <>
            <Stack spacing={2} sx={{ width: '0' }}>
                <Snackbar open={open} autoHideDuration={3000} onClose={handle_close_toastify}>
                    <Alert onClose={handle_close_toastify} severity="error" color="error" sx={{ width: '100%' }}>
                        Vui lòng chọn hóa đơn để thanh toán!
                    </Alert>
                </Snackbar>
            </Stack>
            <div className="cart-body">
                {
                    loading
                    ? <>
                        <div className="cart-body__loading">
                            <CircularProgress/>
                        </div>
                    </>
                    : (

                        !shops.length
                        ? (
                            <>
                                <div className="cart-body--no-item">
                                    Không có sản phẩm nào trong giỏ hàng!
                                </div>
                            </>
                        )
                        : (
                            <>
                                {
                                    shops.map(shop => <ShopSection 
                                        shop_data={shop}
                                        set_origin_shops_data={set_shops}
                                        set_checkout_id={set_checkout_id}
                                        set_checkout_shop={set_checkout_shop}
                                        set_total_price={set_total_price}
                                        key={shop.group_id}
                                        set_has_token={set_has_token}
                                    />)
                                }
                                <div className="cart-body__receipt">
                                    <div className="cart-body__receipt-content">
                                        Tổng cộng:
                                        <span className="cart-body__total"><b>{total_price}đ</b></span>
                                    </div>
                                    <div className="cart-body__btn-area">
                                        <div className={`cart-body__payment-btn cart-body__remove-btn ${checkout_shop || "disabled"}`} onClick={checkout_shop ? remove_section : () => {}}>
                                            <div className="cart-body__payment-btn-content">
                                                <DeleteIcon/> Xóa
                                            </div>
                                        </div>
                                        <div className={`cart-body__payment-btn ${checkout_shop || "disabled"}`} onClick={checkout_shop ? checkout_handler : () => {}}>
                                            <div className="cart-body__payment-btn-content">
                                                <ShoppingCartCheckoutIcon/>
                                                Thanh toán
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    )
                }
            </div>
        </>

    )
}