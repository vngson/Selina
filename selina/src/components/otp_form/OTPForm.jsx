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
import { useParams } from "react-router"

export default function ForgotPasswordForm () {
    const email = useParams().email
    const otpDom = useRef()
    const [message, set_message] = useState(`Vui lòng sử dụng OTP đã được gửi tới Email ${email}`)
    const [form_error, set_form_error] = useState(false)
    const [countdown, set_countdown] = useState(-1)
    const [loading, set_loading] = useState(false)
    const navigate = useNavigate()
    let timer = null
    
    useEffect(() => {
        timer = countdown > -1 && setInterval(() => {
            set_countdown(countdown - 1)
            set_message(`Xác thực thành công, chuyển hướng đến Đăng nhập (${countdown})`)
            
            if (countdown <= 0) {
                clearInterval(timer)
                set_countdown(0)
                navigate("/")
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [countdown, timer])

    const submit_form = async () => {
        set_loading(true)

        const response = await axios.post(
            `${SELINA_API_SERVICE_INFOS.profile[APP_ENV].domain}/approve-account`,
            {
                email: email,
                otp: otpDom.current.value
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
            <label htmlFor="form__otp-input" className="form__input-label">Vui lòng nhập OTP</label>
            <input 
                type="email" 
                className="form__input" 
                id="form__otp-input"
                placeholder="Enter your Email"  
                ref={otpDom}
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