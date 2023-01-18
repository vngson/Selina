import "./checkout_info_card.css"
import ShopTag from "../shop_tag/ShopTag"
import { Link } from "react-router-dom"

export default function CheckoutInfoCard({ checkout_data }) {
    const seller = {
        avatar_url: checkout_data?.seller_avt,
        full_name: checkout_data?.seller_name,
        user_id: checkout_data?.seller_id
    }

    return (
        <div className="checkout-info-card">
            <div className="checkout-info-card__seller-tag">
                <ShopTag user={seller}/>
            </div>
            <div className="checkout-info-card__books">
                {checkout_data && checkout_data?.books?.map(book => (
                    <div className="checkout-info-card__book" key={book?.book_id}>
                        <div className="checkout-info-card__book-group">
                            <Link className="checkout-info-card__book-img" to={`/book/${book?.book_id}`}>
                                <img src={book?.image} alt="" />
                            </Link>
                            <div className="checkout-info-card__book-info">
                                <div className="checkout-info-card__book-name">
                                    <span>{book?.name}</span>
                                </div>
                                <div className="checkout-info-card__book-quantity">
                                    <span>x{book?.quantity}</span>
                                </div>
                            </div>
                        </div>
                        <div className="checkout-info-card__book-group">
                            <div className="checkout-info-card__book-total">
                                <span>{book?.total_price}đ</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="checkout-info-card__total">
                Tổng cộng:
                <b>{checkout_data?.total_price}đ</b>
            </div>
        </div>
    )
}