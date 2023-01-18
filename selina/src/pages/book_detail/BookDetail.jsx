import MainLayout from "../../components/main_layout/MainLayout"
import BookDetailBody from "../../components/book_detail_body/BookDetailBody"
import { useParams } from "react-router"

export default function BookDetail({set_has_token}) {
    const book_id = useParams().book_id
    
    return (
        <MainLayout
            body={<BookDetailBody set_has_token={set_has_token} book_id={book_id}/>}
        />
    )
}