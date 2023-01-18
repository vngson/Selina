import "./checkout_body.css"
import CheckoutInfoCard from "../checkout_info_card/CheckoutInfoCard"
import axios from "axios"
import { APP_ENV } from "../../configs/app_config"
import SELINA_API_SERVICE_INFOS from "../../configs/selina_service_infos"
import { useState, useEffect, useRef, forwardRef } from "react"
import { useNavigate } from "react-router-dom"
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
})

export default function CheckoutBody({ set_has_token, checkout_id, origin_user_data }) {
    const navigate = useNavigate()
    const [checkout_data, set_checkout_data] = useState(null)
    const [open, set_open_toastify] = useState(false)
    const [message, set_message] = useState({})
    const address_dom = useRef()
    const phone_num_dom = useRef()
    const [page_loading, set_page_loading] = useState(true)
    const [submit_loading, set_submit_loading] = useState(false)
    const [active_submit_btn, set_active_submit_btn] = useState(true)

    useEffect(() => {
        const get_checkout = async (checkout_id) => {
            const response = await axios.get(
                `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/get-checkout/${checkout_id}`,
                {
                    headers: {
                        Authorization: localStorage.getItem("access_token")
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
            set_checkout_data(response.data.data[0])
            set_page_loading(false)
            // address_dom.current.value = response.data.data[0]?.user_info?.address
            // phone_num_dom.current.value = response.data.data[0]?.user_info?.phone_num
        }
        get_checkout(checkout_id)
    }, [origin_user_data])

    const take_an_order = async () => {
        const vietnam_phone_nm_re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g

        if (!phone_num_dom?.current?.value.match(vietnam_phone_nm_re)) {
            set_message({
                content: "Số điện thoại không hợp lệ!",
                severity: "error",
                color: "error"
            })
            set_open_toastify(true)
            return
        }
        set_submit_loading(true)
        const response = await axios.post(
            `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/take-an-order`,
            {
                book_group_id: checkout_id,
                address: address_dom?.current?.value,
                phone_num: phone_num_dom?.current?.value
            },
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

        if (response?.data?.status_code?.toString() === '1') {
            set_message({
                content: response?.data?.message,
                severity: "success",
                color: "success"
            })
            set_active_submit_btn(false)
            set_open_toastify(true)
            // setTimeout(() => navigate("/cart"), 3000)
        } else {
            set_message({
                content: response?.data?.message,
                severity: "error",
                color: "error"
            })
            set_open_toastify(true)
        }
        set_submit_loading(false)
    }

    const handle_close_toastify = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        set_open_toastify(false);
    }

    return (
        <>
            <Stack spacing={2} sx={{ width: '0' }}>
                <Snackbar open={open} autoHideDuration={3000} onClose={handle_close_toastify}>
                    <Alert onClose={handle_close_toastify} severity={message.severity} color={message.color} sx={{ width: '100%' }}>
                        {message.content}
                    </Alert>
                </Snackbar>
            </Stack>
            <div className="checkout-body">
                {
                    page_loading
                    ? <>
                        <div className="checkout-body__loading">
                            <CircularProgress/>
                        </div>
                    </>
                    : <>
                        <div className="checkout-body__personal-info">
                            <div className="checkout-body__form-labels">
                                <label htmlFor="checkout-body__user-address" className="checkout-body__form-label">Địa chỉ giao hàng</label>
                                <label htmlFor="checkout-body__user-phone-number" className="checkout-body__form-label">Số điện thoại</label>
                            </div>
                            <div className="checkout-body__form-inputs">
                                <input
                                    type="text"
                                    className="checkout-body__form-input"
                                    id="checkout-body__user-address"
                                    defaultValue={checkout_data?.user_info?.address}
                                    ref={address_dom}
                                />
                                <input
                                    type="text"
                                    className="checkout-body__form-input"
                                    id="checkout-body__user-phone-number"
                                    defaultValue={checkout_data?.user_info?.phone_num}
                                    ref={phone_num_dom}
                                />
                            </div>
                        </div>
                        <div className="checkout-body__order-info">
                            {
                                checkout_data && <CheckoutInfoCard checkout_data={checkout_data}/>
                            }
                        </div>
                        <div className="checkout-body__checkout">
                            <div className={`checkout-body__checkout-btn ${active_submit_btn || "disabled"}`} onClick={!submit_loading && active_submit_btn ? take_an_order : () => {}}>
                                {
                                    submit_loading
                                    ? <CircularProgress color="inherit" style={{padding: "8px"}}/>
                                    : <div className="checkout-body__checkout-btn-content">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 4H5.62563C6.193 4 6.47669 4 6.70214 4.12433C6.79511 4.17561 6.87933 4.24136 6.95162 4.31912C7.12692 4.50769 7.19573 4.7829 7.33333 5.33333L7.51493 6.05972C7.616 6.46402 7.66654 6.66617 7.74455 6.83576C8.01534 7.42449 8.5546 7.84553 9.19144 7.96546C9.37488 8 9.58326 8 10 8V8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                                        <path d="M18 17H7.55091C7.40471 17 7.33162 17 7.27616 16.9938C6.68857 16.928 6.28605 16.3695 6.40945 15.7913C6.42109 15.7367 6.44421 15.6674 6.49044 15.5287V15.5287C6.54177 15.3747 6.56743 15.2977 6.59579 15.2298C6.88607 14.5342 7.54277 14.0608 8.29448 14.0054C8.3679 14 8.44906 14 8.61137 14H14" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M14.5279 14H10.9743C9.75838 14 9.15042 14 8.68147 13.7246C8.48343 13.6083 8.30689 13.4588 8.15961 13.2825C7.81087 12.8652 7.71092 12.2655 7.51103 11.0662C7.30849 9.85093 7.20722 9.2433 7.44763 8.79324C7.54799 8.60536 7.68722 8.44101 7.85604 8.31113C8.26045 8 8.87646 8 10.1085 8H16.7639C18.2143 8 18.9395 8 19.2326 8.47427C19.5257 8.94854 19.2014 9.59717 18.5528 10.8944L18.1056 11.7889C17.5677 12.8647 17.2987 13.4026 16.8154 13.7013C16.3321 14 15.7307 14 14.5279 14Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                                        <circle cx="17" cy="20" r="1" fill="#FFFFFF"/>
                                        <circle cx="9" cy="20" r="1" fill="#FFFFFF"/>
                                        </svg>
                                        Đặt hàng
                                    </div>
                                }
                            </div>
                        </div>
                    </>
                }
            </div>
        </>   
    )
}