import { useLocation } from "react-router-dom"
import { useMemo, useEffect } from "react"
import { APP_ENV } from "../../configs/app_config"
import SELINA_API_SERVICE_INFOS from "../../configs/selina_service_infos"
import ProductGrid from "../product_grid/ProductGrid"
import "./search_body.css"

export default function SearchBody({set_has_token}) {
    const useQuery = () => {
        const { search } = useLocation();
        return useMemo(() => new URLSearchParams(search), [search])
    }
    
    const query = useQuery()

    return (
        <div className="search-body">
            <div className="search-body__main-area">
                <ProductGrid 
                    api={
                        `${SELINA_API_SERVICE_INFOS.bookshelves[APP_ENV].domain}/search?searchterm=${query.get("keyword")}&`
                    }
                    set_has_token={set_has_token}
                />
            </div>
        </div>
    )
}