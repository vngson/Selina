import "../others/css/form.css"
import {
    useState,
    useRef,
    useEffect
} from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { APP_ENV } from "../../configs/app_config"
import CircularProgress from '@mui/material/CircularProgress'
import SELINA_API_SERVICE_INFOS from "../../configs/selina_service_infos"

export default function ForgotPasswordForm () {
    const [message, set_message] = useState(`Mật khẩu mới sẽ được gửi tới Email của bạn!`)
    const guest_email = useRef()
    const email_regex_validate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const [form_error, set_form_error] = useState(false)
    const [countdown, set_countdown] = useState(-1)
    const [loading, set_loading] = useState(false)
    const navigate = useNavigate()
    let timer = null
    
    useEffect(() => {
        timer = countdown > -1 && setInterval(() => {
            set_countdown(countdown - 1)
            set_message(`Thành công, chuyển hướng đến Đăng nhập (${countdown})`)
            
            if (countdown <= 0) {
                clearInterval(timer)
                set_countdown(0)
                navigate("/")
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [countdown, timer])

    const submit_form = async () => {
        const user_email = guest_email.current.value
        set_loading(true)

        if (user_email === "") {
            set_form_error(true)
            set_message("Vui lòng điền Email để tiến hành khôi phục mật khẩu!")
            set_loading(false)
            return
        }

        if (!email_regex_validate.test(user_email)) {
            set_form_error(true)
            set_message("Định dạng Email không được chấp nhận!")
            set_loading(false)
            return
        }

        const response = await axios.post(
            `${SELINA_API_SERVICE_INFOS.profile[APP_ENV].domain}/recover-password`,
            {
                email: user_email
            }
        )
        const response_data = response.data

        if (response_data.status_code !== 1) {
            set_form_error(true)
            set_message(response_data.message)
        }
        else {
            set_form_error(false)
            set_countdown(5)
        }
        set_loading(false)
    }

    const submit_form_by_enter = (e) => {
        if (e.key === 'Enter') {
            submit_form()
        }
    }
    return (
        <div className={form_error ? "form error" : "form"} onKeyDown={submit_form_by_enter}>
            <label htmlFor="form__forgot-password-input" className="form__input-label">Email</label>
            <input 
                type="email" 
                className="form__input" 
                id="form__forgot-password-input"
                placeholder="Email"  
                ref={guest_email}
            />
            <span className="form__message">{message}</span>
            <div className="form__submit-btn" onClick={submit_form}>
                {
                    loading
                    ? <CircularProgress color="inherit" style={{padding: "8px"}}/>
                    : "Xác nhận"
                }
            </div>
        </div>
    )
}