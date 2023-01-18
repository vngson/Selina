import MainLayout from "../../components/main_layout/MainLayout"
import HomeBody from "../../components/home_body/HomeBody"
import SecondaryLayout from "../../components/secondary_layout/SecondaryLayout"
import UserProfileMenu from "../../components/user_profile_menu/UserProfileMenu"
import AdminHome from "../../components/admin_home/AdminHome"

export default function Home({set_has_token, owner_role, origin_user_data}) {

    return (
        <>
            {
                ["normal_user", "seller"].includes(owner_role)
                ? <MainLayout body={<HomeBody set_has_token={set_has_token}/>}/>
                : (
                    owner_role === "admin" 
                    ? <SecondaryLayout
                        set_has_token={set_has_token}
                        origin_user_data={origin_user_data}
                        nav={
                            <UserProfileMenu
                                menu={
                                    [
                                        {
                                            to: "/",
                                            icon: (
                                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="18" cy="12" r="6" fill="#000"/>
                                                    <path d="M8.65092 23.7508C9.57272 21.0319 12.2717 19.5 15.1426 19.5H20.8574C23.7283 19.5 26.4273 21.0319 27.3491 23.7508C27.8733 25.297 28.3373 27.1275 28.4652 29.0007C28.5028 29.5517 28.0523 30 27.5 30H8.5C7.94772 30 7.49717 29.5517 7.53479 29.0007C7.66267 27.1275 8.12668 25.297 8.65092 23.7508Z" fill="#000"/>
                                                </svg>
                                            ),
                                            icon_active: (
                                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="18" cy="12" r="6" fill="#32a4ea"/>
                                                    <path d="M8.65092 23.7508C9.57272 21.0319 12.2717 19.5 15.1426 19.5H20.8574C23.7283 19.5 26.4273 21.0319 27.3491 23.7508C27.8733 25.297 28.3373 27.1275 28.4652 29.0007C28.5028 29.5517 28.0523 30 27.5 30H8.5C7.94772 30 7.49717 29.5517 7.53479 29.0007C7.66267 27.1275 8.12668 25.297 8.65092 23.7508Z" fill="#32a4ea"/>
                                                </svg>
                                            ),
                                            label: "Người dùng"
                                        },
                                        {
                                            to: "/seller-requirements",
                                            icon: (
                                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M15 4.5C13.3431 4.5 12 5.84315 12 7.5H11.25C9.14331 7.5 8.08996 7.5 7.33329 8.00559C7.00572 8.22447 6.72447 8.50572 6.50559 8.83329C6 9.58996 6 10.6433 6 12.75V27C6 29.8284 6 31.2426 6.87868 32.1213C7.75736 33 9.17157 33 12 33H24C26.8284 33 28.2426 33 29.1213 32.1213C30 31.2426 30 29.8284 30 27V12.75C30 10.6433 30 9.58996 29.4944 8.83329C29.2755 8.50572 28.9943 8.22447 28.6667 8.00559C27.91 7.5 26.8567 7.5 24.75 7.5H24C24 5.84315 22.6569 4.5 21 4.5H15ZM15.5 7.5C15.5 6.94772 15.9477 6.5 16.5 6.5H19.5C20.0523 6.5 20.5 6.94772 20.5 7.5C20.5 8.05228 20.0523 8.5 19.5 8.5H16.5C15.9477 8.5 15.5 8.05228 15.5 7.5ZM13.5 17C12.9477 17 12.5 17.4477 12.5 18C12.5 18.5523 12.9477 19 13.5 19H22.5C23.0523 19 23.5 18.5523 23.5 18C23.5 17.4477 23.0523 17 22.5 17H13.5ZM13.5 23C12.9477 23 12.5 23.4477 12.5 24C12.5 24.5523 12.9477 25 13.5 25H19.5C20.0523 25 20.5 24.5523 20.5 24C20.5 23.4477 20.0523 23 19.5 23H13.5Z" fill="#000"/>
                                                </svg>
                                            ),
                                            icon_active: (
                                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M15 4.5C13.3431 4.5 12 5.84315 12 7.5H11.25C9.14331 7.5 8.08996 7.5 7.33329 8.00559C7.00572 8.22447 6.72447 8.50572 6.50559 8.83329C6 9.58996 6 10.6433 6 12.75V27C6 29.8284 6 31.2426 6.87868 32.1213C7.75736 33 9.17157 33 12 33H24C26.8284 33 28.2426 33 29.1213 32.1213C30 31.2426 30 29.8284 30 27V12.75C30 10.6433 30 9.58996 29.4944 8.83329C29.2755 8.50572 28.9943 8.22447 28.6667 8.00559C27.91 7.5 26.8567 7.5 24.75 7.5H24C24 5.84315 22.6569 4.5 21 4.5H15ZM15.5 7.5C15.5 6.94772 15.9477 6.5 16.5 6.5H19.5C20.0523 6.5 20.5 6.94772 20.5 7.5C20.5 8.05228 20.0523 8.5 19.5 8.5H16.5C15.9477 8.5 15.5 8.05228 15.5 7.5ZM13.5 17C12.9477 17 12.5 17.4477 12.5 18C12.5 18.5523 12.9477 19 13.5 19H22.5C23.0523 19 23.5 18.5523 23.5 18C23.5 17.4477 23.0523 17 22.5 17H13.5ZM13.5 23C12.9477 23 12.5 23.4477 12.5 24C12.5 24.5523 12.9477 25 13.5 25H19.5C20.0523 25 20.5 24.5523 20.5 24C20.5 23.4477 20.0523 23 19.5 23H13.5Z" fill="#32a4ea"/>
                                                </svg>
                                            ),
                                            label: "Yêu cầu"
                                        }
                                    ]
                                }
                            />
                        }
                        body={<AdminHome set_has_token={set_has_token}/>}
                    />
                    : <></>
                )
            }
        </>
    )
}