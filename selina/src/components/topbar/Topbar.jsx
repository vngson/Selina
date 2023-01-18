import { useRef, useState, forwardRef } from 'react';
import { useNavigate, Link } from "react-router-dom"
import MuiAlert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import "./topbar.css"

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
})

export default function TopBar({user_data}) {
    const [open, set_open_toastify] = useState(false)
    const keyword = useRef()
    const navigate = useNavigate()

    const submit_search_handler = (e) => {
        if (["normal_user", "seller"].includes(user_data.user_type)) {
            if (e.key === 'Enter') {
                const k = keyword?.current?.value
    
                if (k) {
                    navigate(`/search?keyword=${k}`)
                }
            }
        }
        else {
            set_open_toastify(true)
        }
    }
    const handle_close_toastify = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        set_open_toastify(false);
    }

    return (
        <div className="top-bar">
            <div className="top-bar__items">
                <div className="top-bar__item">
                    <Link className="top-bar__logo" to='/'>
                        <img src="/images/logo.png" alt="" className="top-bar__logo-img" />
                    </Link>
                </div>
                <div className="top-bar__item top-bar__item-search">
                    <div className="top-bar__search-area" onKeyDown={submit_search_handler}>
                        <div className="top-bar__search-left">
                            <label className="top-bar__search-label" htmlFor="top-bar__search-input">
                                <svg width="25" height="25" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M27.065 25.105L21.965 20.02C23.6105 17.9237 24.5033 15.335 24.5 12.67C24.5 10.2966 23.7962 7.97657 22.4776 6.00318C21.1591 4.02979 19.2849 2.49172 17.0922 1.58346C14.8995 0.675213 12.4867 0.437573 10.1589 0.900595C7.83115 1.36362 5.69295 2.50651 4.01472 4.18474C2.33649 5.86297 1.1936 8.00116 0.730582 10.3289C0.267559 12.6567 0.505199 15.0695 1.41345 17.2622C2.3217 19.4549 3.85977 21.3291 5.83316 22.6477C7.80655 23.9662 10.1266 24.67 12.5 24.67C15.165 24.6733 17.7537 23.7805 19.85 22.135L24.935 27.235C25.0745 27.3756 25.2404 27.4872 25.4231 27.5634C25.6059 27.6395 25.802 27.6787 26 27.6787C26.198 27.6787 26.3941 27.6395 26.5769 27.5634C26.7597 27.4872 26.9256 27.3756 27.065 27.235C27.2056 27.0956 27.3172 26.9297 27.3933 26.7469C27.4695 26.5641 27.5087 26.368 27.5087 26.17C27.5087 25.972 27.4695 25.7759 27.3933 25.5932C27.3172 25.4104 27.2056 25.2445 27.065 25.105ZM3.50001 12.67C3.50001 10.89 4.02785 9.14993 5.01678 7.66989C6.00571 6.18984 7.41132 5.03629 9.05585 4.3551C10.7004 3.67391 12.51 3.49568 14.2558 3.84295C16.0016 4.19022 17.6053 5.04739 18.864 6.30606C20.1226 7.56473 20.9798 9.16838 21.3271 10.9142C21.6743 12.66 21.4961 14.4696 20.8149 16.1142C20.1337 17.7587 18.9802 19.1643 17.5001 20.1532C16.0201 21.1422 14.28 21.67 12.5 21.67C10.1131 21.67 7.82387 20.7218 6.13604 19.034C4.44822 17.3462 3.50001 15.057 3.50001 12.67Z" fill="#b0b1b3"/>
                                </svg>
                            </label>
                        </div>
                        <div className="top-bar__search-right">
                            <input ref={keyword} type="text" className="top-bar__search-input" id="top-bar__search-input" placeholder="Nhập tên sách bạn muốn tìm kiếm..."/>
                        </div>
                    </div>
                </div>
                {
                    user_data.user_type === "normal_user"
                    ? <div className="top-bar__item">
                    <div className="top-bar__utility-tools">
                        <Link className="top-bar__utility-tool" to='/cart'>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 12L12 10.5C12 7.18629 14.6863 4.5 18 4.5V4.5C21.3137 4.5 24 7.18629 24 10.5L24 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M22.5 21V18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M13.5 21V18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M6 16C6 14.1144 6 13.1716 6.58579 12.5858C7.17157 12 8.11438 12 10 12H26C27.8856 12 28.8284 12 29.4142 12.5858C30 13.1716 30 14.1144 30 16V23.5C30 27.2712 30 29.1569 28.8284 30.3284C27.6569 31.5 25.7712 31.5 22 31.5H14C10.2288 31.5 8.34315 31.5 7.17157 30.3284C6 29.1569 6 27.2712 6 23.5V16Z" stroke="white" strokeWidth="2"/>
                            </svg>
                        </Link>
                    </div>
                    </div>
                    : <></>
                }
                <div className="top-bar__item">
                    <div className="top-bar__user-area">
                        <div className="top-bar__user-name">
                            Xin chào, <b>{user_data?.full_name}</b>
                        </div>
                        {
                            user_data.user_type !== "admin"
                            ? <Link to="/profile/me" className="top-bar__user-avatar">
                                <img 
                                    src={user_data?.avatar_url || "/images/default_avt.png"} 
                                    className="top-bar__user-avatar-img" 
                                />
                            </Link>
                            : <div className="top-bar__user-avatar">
                                <img 
                                    src={user_data?.avatar_url || "/images/default_avt.png"} 
                                    className="top-bar__user-avatar-img" 
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>
            <Stack spacing={2} sx={{ width: '0' }}>
                <Snackbar open={open} autoHideDuration={3000} onClose={handle_close_toastify}>
                    <Alert onClose={handle_close_toastify} severity="info" sx={{ width: '100%' }}>
                        Chức năng đang phát triển!
                    </Alert>
                </Snackbar>
            </Stack>
        </div>
    )
}