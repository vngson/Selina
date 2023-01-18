import LoginForm from "../../components/login_form/LoginForm"
import RegisterForm from "../../components/register_form/RegisterForm"
import UnAuthorizationLayout from "../../components/un_authorization_layout/UnAuthoizationLayout"
import LoginRegisterNav from "../../components/login_register_nav/LoginRegisterNav"
import {
    useState
} from "react"

export default function UnAuthorization({set_has_token, set_owner_role, set_user_data}) {
    const [in_register, set_in_register] = useState(false)
    
    return (
    <div className="login">
        <UnAuthorizationLayout 
            nav={<LoginRegisterNav curr_nav={in_register} nav_control={set_in_register}/>}
            body={in_register ? <RegisterForm/> : <LoginForm set_has_token={set_has_token} set_owner_role={set_owner_role} set_user_data={set_user_data}/>}
        />
    </div>
  )
}