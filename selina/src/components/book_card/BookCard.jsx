import "./book_card.css"
import { Link } from "react-router-dom"

export default function BookCard({book}) {
    return (
        <Link to={`/book/${book.product_id}`} className="book-card">
            <div className="book-card__img-area">
                <img src={book?.image} alt="" className="book-card__img" />
            </div>
            <div className="book-card__shortcut-info">
                <div className="book-card__info book-card__book-name">
                    <b>{book?.name}</b>
                </div>
                <div className="book-card__info book-card__desc">
                    {book?.author}
                </div>
                <div className="book-card__info book-card__price">
                    {book?.price}đ
                </div>
            </div>
        </Link>
    )
}