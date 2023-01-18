import "./cart_item.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { APP_ENV } from "../../configs/app_config"
import SELINA_API_SERVICE_INFOS from "../../configs/selina_service_infos"
import { useNavigate } from "react-router-dom"
import DeleteIcon from '@mui/icons-material/Delete'

export default function CartItem({ set_has_token, set_origin_books_data, origin_books_data, book_data, set_shop_total_price, synchronize_total_price }) {
    const price = book_data?.price
    const navigate = useNavigate()
    const [quantity, set_quantity] = useState(book_data?.quantity)
    const [total, set_total] = useState(book_data?.total_price)
    const [hidden, set_hidden] = useState(false)

    const quantity_decrement_handler = async () => {
        if (quantity <= 1) return

        axios.post(
            `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/modify-quantity-book-in-cart`,
            {
                quantity: quantity - 1,
                book_in_cart_id: book_data.book_in_cart_id 
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

        set_quantity(quantity - 1)
        set_shop_total_price(total_price => total_price - price)
        return
    }

    const quantity_increment_handler = async () => {
        axios.post(
            `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/modify-quantity-book-in-cart`,
            {
                quantity: quantity + 1,
                book_in_cart_id: book_data.book_in_cart_id 
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
        set_quantity(quantity + 1)
        set_shop_total_price(total_price => total_price + price)
        return
    }

    const delete_handle = async () => {
        const response = await axios.post(
            `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/remove-book-in-cart `,
            {
                book_in_cart_id: book_data.book_in_cart_id
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
            // origin_books_data = origin_books_data.filter(book => book !== book_data)
            set_origin_books_data(
                origin => {
                    console.log(origin)
                    const new_origin = origin.filter(b => Number(b.book_in_cart_id) != Number(book_data.book_in_cart_id))
                    console.log(new_origin)
                    return new_origin.length ? new_origin : null
                }
            )
        }
    }

    useEffect(() => {
        set_total(price * quantity)
        synchronize_total_price()
    }, [quantity])

    return (
        <>
            {
                !hidden
                ? <div className="cart-item">
                    <div className="cart-item__group">
                        <Link className="cart-item__img" to={`/book/${book_data?.book_id}`}>
                            <img src={book_data?.image} alt="" />
                        </Link>
                        <div className="cart-item__details">
                            <h4 className="cart-item__name">{book_data?.name}</h4>
                            <div className="cart-item__description">{book_data?.desc}</div>
                        </div>
                    </div>
                    <div className="cart-item__group">
                        <div className="cart-item__price">
                            <p><b>Giá</b></p>
                            <p>{price}đ</p>
                        </div>
                        <div className="cart-item__quantity">
                            <p><b>Số lượng</b></p>
                            <div className="cart-item__quantity-controller">
                                <span className="quantity-controller--decrement" onClick={quantity_decrement_handler}>&lt;</span>
                                <span>{quantity}</span>
                                <span className="quantity-controller--increment" onClick={quantity_increment_handler}>&gt;</span>
                            </div>
                        </div>
                        <div className="cart-item__total">
                            <p><b>Tổng cộng</b></p>
                            <p>{total}đ</p>
                        </div>
                    </div>     
                    <div className="cart-item__group">
                        <div className="cart-item__del-btn" onClick={delete_handle}>
                            <DeleteIcon/>
                        </div>
                    </div>
                </div>
                :<></>
            }
        </>
    )
}