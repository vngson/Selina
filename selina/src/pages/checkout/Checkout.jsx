import CheckoutBody from "../../components/checkout_body/CheckoutBody"
import MainLayout from "../../components/main_layout/MainLayout"
import { useParams } from "react-router-dom"

export default function Checkout({ set_has_token, user_data }) {
    const checkout_id = useParams().checkout_id

    return (
        <MainLayout body={<CheckoutBody origin_user_data={user_data} set_has_token={set_has_token} checkout_id={checkout_id}/>}/>
    )
}