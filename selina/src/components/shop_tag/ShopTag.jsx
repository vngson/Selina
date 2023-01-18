import "./shop_tag.css"
import { useNavigate } from "react-router-dom"

export default function ShopTag({user}) {
    const owner = JSON.parse(sessionStorage.getItem("user_info"))
    const navigate = useNavigate()
    
    const click_shop_tag = () => {
        if (owner?.user_id !== user?.user_id) {
            sessionStorage.setItem("shop_tag_data", JSON.stringify(user))
            navigate(`/shop/${user?.user_id}`)
        }
    }

    return (
        <div className="shop-tag" onClick={click_shop_tag}>
            <div className="shop-tag__wrapper">
                <img 
                    src={user?.avatar_url || "/images/default_avt.png"}
                    alt="" 
                    className="shop-tag__avatar" 
                />
                <div className="shop-tag__name">
                    {user?.full_name}
                </div>
            </div>
        </div>
    )
}