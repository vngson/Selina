import SELINA_API_SERVICE_INFOS from "../../configs/selina_service_infos"
import { APP_ENV } from "../../configs/app_config"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Pagination } from "@mui/material"
import HorizontalBookCard from "../horizontal_book_card/HorizontalBookCard"
import "./seller_requirements_body.css"
import CircularProgress from '@mui/material/CircularProgress'
import ContentPasteOffIcon from '@mui/icons-material/ContentPasteOff'

export default function SellerRequirementsBody({set_has_token}) {
    const navigate = useNavigate()
    const [books, set_books] = useState([])
    const [curr_page, set_curr_page] = useState(1)
    const [num_pages, set_num_pages] = useState(1)
    const [loading, set_loading] = useState(true)

    const click_pagination_bar = function(e, page) {
        set_curr_page(page)
    }

    useEffect(() => {
        const get_data = async () => {
            const response = await axios.get(
                `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/get-pending-books?page=${curr_page}`,
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
            const books_data = response.data.data.books
            set_books(books_data)
            set_num_pages(response.data.data.pages)
            set_loading(false)
        }
        get_data()
    }, [curr_page])

    return (
        <div className="seller-requirements-body">
            <div className="seller-requirements-body__loading">
                {loading ? <CircularProgress/> : <></>}
            </div>
            <div className="seller-requirements-body__books">
                {
                    books.map((book, idx) => <HorizontalBookCard key={idx} set_has_token={set_has_token} book_data={book}/>)
                }
            </div>
            {
                books.length
                ? <div className="seller-requirements-body__pagination">
                    <Pagination 
                        count={num_pages} 
                        variant="outlined"
                        onChange={click_pagination_bar}
                    />
                </div>
                : (
                    !loading
                    ? <div className="seller-requirements-body__empty">
                        <div className="seller-requirements-body__empty-message">
                            Không có sản phẩm nào cần kiểm duyệt!
                        </div>
                        <div className="seller-requirements-body__empty-icon">
                            <ContentPasteOffIcon fontSize="large"/>
                        </div>
                    </div>
                    :<></>
                )
            }
        </div>
    )
}