import "./product_grid.css"
import BookCard from "../book_card/BookCard"
import {
    useState,
    useEffect
} from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Pagination } from "@mui/material"
import CircularProgress from '@mui/material/CircularProgress'
import SearchOffIcon from '@mui/icons-material/SearchOff'

export default function ProductGrid({api, set_has_token}) {
    const [products, set_products] = useState([])
    const [curr_page, set_curr_page] = useState(1)
    const [num_pages, set_num_pages] = useState(1)
    const [loading, set_loading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const get_data = async () => {
            set_loading(true)
            const response = await axios.get(
                `${api}page=${curr_page.toString()}`,
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

            set_products(response?.data?.data?.docs)
            set_num_pages(response?.data?.data?.pages)
            set_curr_page(response?.data?.data?.page || 1)
            set_loading(false)
        }
        get_data(api)
    }, [curr_page, api])

    const click_pagination_bar = function(e, page) {
        set_curr_page(page)
    }

    return (
        <div className="product-grid">
            {
                products.length && !loading
                ? <>
                    <div className="product-grid__grid">
                        {
                            products.map((product, idx) => <BookCard book={product} key={idx}/>)
                        }
                    </div>
                    <div className="product-grid__pagination">
                        <Pagination 
                            variant="outlined" 
                            color="primary"
                            defaultPage={curr_page}
                            count={num_pages} 
                            showFirstButton
                            showLastButton
                            onChange={click_pagination_bar}
                        />
                    </div>
                </>
                : (
                    !loading 
                    ? <div className="product-grid__empty">
                        <div className="product-grid__empty-message">
                            Không tìm thấy sản phẩm nào!
                        </div>
                        <div className="product-grid__empty-icon">
                            <SearchOffIcon fontSize="large"/>
                        </div>
                    </div>
                    : <CircularProgress/>
                )
            }
        </div>
    )
}