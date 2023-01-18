import "./login_register_nav.css"

export default function LoginRegisterNav (props){ 
    const nav_handler = () => {
        props.nav_control(!props.curr_nav)
    }

    return (
        <div className={props.curr_nav ? "login-register-nav in_register" : "login-register-nav"}>
            <div className="login-register-nav__labels"> 
                <div className="login-register-nav__label" onClick={nav_handler}>
                    Đăng nhập
                </div>
                <div className="login-register-nav__label" onClick={nav_handler}>
                    Đăng ký
                </div>
            </div>
            <div className="login-register-nav__layer">{props.curr_nav ? "Đăng ký" : "Đăng nhập"}</div>
        </div>
    );
}