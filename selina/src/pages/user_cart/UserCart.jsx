import MainLayout from "../../components/main_layout/MainLayout"
import CartBody from "../../components/cart_body/CartBody"

export default function UserCart({set_has_token}) {

    return (
        <MainLayout body={<CartBody set_has_token={set_has_token}/>}/>
    )
}