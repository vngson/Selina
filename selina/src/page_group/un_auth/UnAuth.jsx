import {
    Routes,
    Route,
    Navigate
} from "react-router-dom"
import UnAuthorization from "../../pages/un_authorization/UnAuthorization"
import ForgotPassword from "../../pages/forgot_password/ForgotPassword"

export default function UnAuth({set_has_token, set_owner_role, has_token}){
    return (
        <>
            <Route 
                path="/" 
                element={
                    has_token 
                    ? <Navigate to="/"/>
                    : <UnAuthorization set_has_token={set_has_token} set_owner_role={set_owner_role}/>
                }
            />
            <Route 
                path="/forgot-password" 
                element={
                    has_token 
                    ? <Navigate to="/"/>
                    : <ForgotPassword/>
                }
            />
        </>
    )
}