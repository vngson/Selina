import "./horizontal_book_card.css"
import axios from "axios"
import { useState } from "react"
import { APP_ENV } from "../../configs/app_config"
import SELINA_API_SERVICE_INFOS from "../../configs/selina_service_infos"
import { useNavigate } from "react-router-dom"

export default function HorizontalBookCard({set_has_token, book_data}) {
    console.log(book_data)
    const navigate = useNavigate()
    const [hidden, set_hidden] = useState(false)

    const approve_handle = async () => {
        const response = await axios.post(
            `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/consider-post-new-book?book_id=${book_data.product_id}`,
            {
                approved: true
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
        console.log(book_data.product_id)
        if (response.data.status_code.toString() === "1") {
            set_hidden(true)
        }
    }

    const reject_handle = async () => {
        const response = await axios.post(
            `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/consider-post-new-book?book_id=${book_data.product_id}`,
            {
                approved: false
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

        if (response.data.status_code.toString() === "1") {
            set_hidden(true)
        }
    }

    return (
        <>
            {
                !hidden
                ? <div className="horizontal-book-card">
                    <div className="horizontal-book-card__sub-area">
                        <div className="horizontal-book-card__shop-avt-area">
                            <img src={book_data.seller_info.avatar_url || "/images/default_avt.png"} className="horizontal-book-card__shop-avt-img" />
                        </div>
                        <div className="horizontal-book-card__shop-name">
                            {book_data.seller_info.full_name}
                        </div>
                    </div>
                    <div className="horizontal-book-card__sub-area">
                        <div className="horizontal-book-card__book-area">
                            <div className="horizontal-book-card__book-img-area">
                                <img src={book_data.image} alt="" className="horizontal-book-card__book-img" />
                            </div>
                            <div className="horizontal-book-card__book-info">
                                <div className="horizontal-book-card__book-info-item horizontal-book-card__book-info-item--font-large">
                                    <b>{book_data.name}</b>
                                </div>
                                <div className="horizontal-book-card__book-info-item">
                                    <b>Tác giả</b>: {book_data.author}
                                </div>
                                <div className="horizontal-book-card__book-info-item">
                                    <b>Tóm tắt</b>: {book_data.desc}
                                </div>
                                <div className="horizontal-book-card__book-info-item">
                                    <b>Giá</b>: {book_data.price} đ
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="horizontal-book-card__sub-area">
                        <div className="horizontal-book-card__buttons">
                            <div className="horizontal-book-card__button horizontal-book-card__approve-btn" onClick={approve_handle}>
                                <div className="horizontal-book-card__button-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="11.25" stroke="white"/>
                                        <path d="M7 12L10.75 15.75L17 8.25" stroke="white"/>
                                    </svg>
                                </div>
                                <div className="horizontal-book-card__button-label">
                                    Phê duyệt
                                </div>
                            </div>
                            <div className="horizontal-book-card__button horizontal-book-card__reject-btn" onClick={reject_handle}>
                                <div className="horizontal-book-card__button-icon">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.5 0.5L0.5 15.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M0.5 0.5L15.5 15.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div className="horizontal-book-card__button-label">
                                    Từ chối
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :<></>
            }
        </>
    )
}