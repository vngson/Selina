import ProductGrid from "../product_grid/ProductGrid"
import SELINA_API_SERVICE_INFOS from "../../configs/selina_service_infos"
import { APP_ENV } from "../../configs/app_config"
import { useState } from "react"
import { useParams } from "react-router"
import ShopTag from "../shop_tag/ShopTag"

export default function HomeBody({set_has_token}) {
    const [shop_data, set_shop_data] = useState(JSON.parse(sessionStorage.getItem("shop_tag_data")))
    const shopId = useParams().shop_id

    return (
        <div className="home-body">
            <ShopTag user={shop_data}/>
            <div className="home-body__main-area">
                <ProductGrid 
                    api={
                        `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/get-shop-data/${shopId}?`
                    }
                    set_has_token={set_has_token}
                />
            </div>
        </div>
    )
}