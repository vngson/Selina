import "./order_body.css"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { APP_ENV } from "../../configs/app_config"
import SELINA_API_SERVICE_INFOS from "../../configs/selina_service_infos"
import OrderInfoCard from "../order_info_card/OrderInfoCard"
import CircularProgress from '@mui/material/CircularProgress'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart'

export default function OrderBody({set_has_token}) {
    const navigate = useNavigate()
    const [orders_data, set_orders_data] = useState([])
    const [loading, set_loading] = useState(true)

    useEffect(() => {
        const get_orders = async () => {
            const orders_response = await axios.get(
                `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/get-orders`,
                {
                    headers: {
                        authorization: localStorage.getItem('access_token')
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

            const orders = orders_response.data.data.data
            set_orders_data(orders)
            set_loading(false)
        }
        get_orders()
    }, [])

    return (
        <div className="order-body">
            <div className="order-body__wrapper">
                <div className="order-body__loading">
                    {loading ? <CircularProgress/> : <></>}
                </div>
                {
                    orders_data.length
                    ? orders_data.map((order, idx) => (<OrderInfoCard key={idx} order={order} set_has_token={set_has_token}/>)) 
                    : (
                        !loading
                        ? <div className="order-body__empty">
                            <div className="order-body__empty-message">
                                Bạn không có đơn hàng nào!
                            </div>
                            <div className="order-body__empty-icon">
                                <RemoveShoppingCartIcon fontSize="large"/>
                            </div>
                        </div>
                        : <></>
                    )
                }
            </div>
        </div>
    )
}