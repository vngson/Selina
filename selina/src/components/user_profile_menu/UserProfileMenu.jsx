import { Link, useLocation  } from "react-router-dom"
import "./user_profile_menu.css"

export default function UserProfileMenu({menu}) {
    const current_route = useLocation().pathname

    return (
        <div className="user-profile-menu">
            {
                menu.map((m, idx) => (
                    <Link 
                        to={m.to} 
                        className={
                            current_route === m.to 
                            ? "user-profile-menu__item active" 
                            : "user-profile-menu__item"
                        }
                        key={idx}
                    >
                        <div className="user-profile-menu__logo">
                            {current_route === m.to ? m.icon_active : m.icon}
                        </div>
                        <div className="user-profile-menu__name">
                            {m.label}
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}