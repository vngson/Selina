import "./shop_section.css"
import ShopTag from "../shop_tag/ShopTag"
import CartItem from "../cart_item/CartItem"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import SELINA_API_SERVICE_INFOS from "../../configs/selina_service_infos"
import { useNavigate } from "react-router-dom"
import { APP_ENV } from "../../configs/app_config"

export default function ShopSection({ set_has_token, set_origin_shops_data, shop_data, set_total_price, set_checkout_id, set_checkout_shop }) {
    const [seller_tag, set_seller_tag] = useState({
        avatar_url: shop_data?.seller_avt,
        full_name: shop_data?.seller_name,
        user_id: shop_data?.seller_id
    })
    const [books, set_books] = useState(shop_data?.books)
    const [shop_total_price, set_shop_total_price] = useState(shop_data?.total_price)
    const navigate = useNavigate()
    const check_dom = useRef()

    useEffect(() => {
        if (books === null) {
            remove_section()
        }
    }, [books?.length])

    const synchronize_total_price = () => {
        if (check_dom.current.checked) {
            set_total_price(shop_total_price)
        }
    }
    
    const check_handle = (e) => {
        set_total_price(shop_total_price)
        set_checkout_id(shop_data?.group_id)
        set_checkout_shop(shop_data)
    }

    const remove_section = async () => {
        const response = await axios.post(
            `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/remove-book-group`,
            {
                book_group_id: shop_data?.group_id
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
            set_origin_shops_data(shops_data => shops_data.filter(shop => shop.group_id !== shop_data.group_id))
        }
    }

    return (
        <>
            {
                books?.length
                ? <div className="shop-section">
                    <div className="shop-section__selector">
                        <input
                            type="radio"
                            name="shop-selector"
                            className="shop-section__selector-checkbox"
                            ref={check_dom}
                            onChange={check_handle}
                        />
                        <ShopTag user={seller_tag}/>
                    </div>
                    {
                        books.map(book => <CartItem 
                            origin_books_data={books}
                            set_origin_books_data={set_books}
                            book_data={book}
                            key={book.book_id}
                            set_shop_total_price={set_shop_total_price}
                            synchronize_total_price={synchronize_total_price}
                            set_has_token={set_has_token}
                        />)
                    } 
                </div>
                : <></>
            }
        </>
    )
}