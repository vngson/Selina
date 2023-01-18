import MainLayout from "../../components/main_layout/MainLayout"
import ShopDetailBody from "../../components/shop_detail_body/ShopDetailBody"

export default function ShopDetail({set_has_token}) {
    return (
        <MainLayout body={<ShopDetailBody set_has_token={set_has_token}/>}/>
    )
}