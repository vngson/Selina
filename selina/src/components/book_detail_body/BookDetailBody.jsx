import ProductForm from "../product_form/ProductForm"
import BookDetailInfo from "../book_detail_info/BookDetailInfo"
import { useEffect, useState } from "react"
import axios from "axios"
import { APP_ENV } from "../../configs/app_config"
import SELINA_API_SERVICE_INFOS from "../../configs/selina_service_infos"
import { useNavigate } from "react-router-dom"
import "./book_detail_body.css"
import CircularProgress from '@mui/material/CircularProgress'

export default function BookDetailBody({set_has_token, book_id}) {
    const [book, set_book] = useState({})
    const [role, set_role] = useState("")
    const [loading, set_loading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const get_book_data = async (book_id) => {
            const response = await axios.get(
                `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/get-product-info?id=${book_id}`,
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
            set_book(response?.data?.data)
            set_role(response?.data?.user_role)
            set_loading(false)
        }
        get_book_data(book_id)
    }, [])


    return (
        <div className="book-detail-body">
            <div className="book-detail-body__loading">
                {loading ? <CircularProgress/> : <></>}
            </div>
            {
                role === "normal_user"
                ? <BookDetailInfo set_has_token={set_has_token} book_data={book}/>
                : (
                    role === "seller"
                    ? <ProductForm set_has_token={set_has_token} book_data={book}/>
                    : <></>
                )
            }
        </div>
    )
}