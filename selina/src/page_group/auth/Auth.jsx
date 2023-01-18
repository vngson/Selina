import {
    Routes,
    Route,
    Navigate
} from "react-router-dom"
import Home from "../../pages/home/Home"

export default function Auth({set_has_token, owner_role, has_token}){
    return (
        <Routes>
            <Route 
                path="/" 
                element={
                    has_token 
                    ? <Home set_has_token={set_has_token} owner_role={owner_role}/>
                    : <Navigate to="/authorization"/>
                }
            />
        </Routes>
    )
}