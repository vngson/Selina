import MainLayout from "../../components/main_layout/MainLayout"
import SearchBody from "../../components/search_body/SearchBody"
import { useEffect } from "react"

export default function Search({set_has_token}) {

    return (
        <MainLayout body={<SearchBody set_has_token={set_has_token}/>}/>
    )
}