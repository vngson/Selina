import "./profile_form.css"
import { useRef, useState, useEffect, forwardRef } from "react"
import axios from "axios"
import { APP_ENV } from "../../configs/app_config"
import SELINA_API_SERVICE_INFOS from "../../configs/selina_service_infos"
import { useNavigate } from "react-router-dom"
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
})

export default function ProfileForm({set_has_token, set_origin_user_data}) {
    const navigate = useNavigate()
    const [preview_new_avt, set_preview_new_avt] = useState(null)
    const [new_avt_img, set_new_avt_img] = useState(null)
    const [open, set_open_toastify] = useState(false)
    const [submit_loading, set_submit_loading] = useState(false)
    const [message, set_message] = useState({})

    const full_name_dom = useRef()
    const email_dom = useRef()
    const phone_dom = useRef()
    const address_dom = useRef()
    const genre_dom = useRef()
    const avt_dom = useRef()
    
    useEffect(() => {
        const get_user_data = async () => {
            const user_data_response = await axios.get(
                `${SELINA_API_SERVICE_INFOS.profile[APP_ENV].domain}/get-personal-info`,
                {
                    headers: {
                        authorization: localStorage.getItem('access_token')
                    }
                }
            ).then((response) => {
                if (response?.data?.status_code?.toString() === '2') {
                    localStorage.removeItem("access_token")
                    set_has_token(false)
                    return navigate("/authorization")
                }
                return response
            })
            const user_data = user_data_response.data.data

            full_name_dom.current.value = user_data.full_name || ""
            email_dom.current.value = user_data.email || ""
            phone_dom.current.value = user_data.phone_num || ""
            address_dom.current.value = user_data.address || ""
            genre_dom.current.checked = user_data.gender

            set_preview_new_avt(user_data.avatar_url)
        }
        get_user_data()
    }, [])

    const up_new_avt_handler = (e) => {
        set_new_avt_img(e.target.files[0])
        set_preview_new_avt(URL.createObjectURL(e.target.files[0]))
    }

    const modify_info_handler = async () => {
        const full_name = full_name_dom.current.value
        const phone_num = phone_dom.current.value
        const address = address_dom.current.value
        const gender = genre_dom.current.checked
        const file = new_avt_img
        const vietnam_phone_nm_re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g

        if (!phone_num.match(vietnam_phone_nm_re)) {
            set_message({
                content: "Số điện thoại không hợp lệ!",
                severity: "error",
                color: "error"
            })
            set_open_toastify(true)
            return
        }

        if (!address || !full_name) {
            set_message({
                content: "Vui lòng điền đầy đủ thông tin cá nhân!",
                severity: "error",
                color: "error"
            })
            set_open_toastify(true)
            return
        }

        const form_data = new FormData()

        set_submit_loading(true)
        form_data.append("full_name", full_name)
        form_data.append("phone_num", phone_num)
        form_data.append("address", address)
        form_data.append("gender", gender)
        form_data.append("image", file)

        const modify_response = await axios.post(
            `${SELINA_API_SERVICE_INFOS.profile[APP_ENV].domain}/modify-personal-info`,
            form_data,
            {
                headers: {
                    authorization: localStorage.getItem("access_token")
                }
            }
        ).then((response) => {
            if (response?.data?.status_code?.toString() === '2') {
                localStorage.removeItem("access_token")
                set_has_token(false)
                return navigate("/authorization")
            }
            return response
        })
        set_submit_loading(false)
        if (modify_response.data.status_code.toString() === "1") {
            set_origin_user_data(modify_response.data.data)
            set_message({
                content: "Sửa thông tin thành công!",
                severity: "success",
                color: "info"
            })
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
        <div className="profile-form">
            <Stack spacing={2} sx={{ width: '0' }}>
                <Snackbar open={open} autoHideDuration={3000} onClose={handle_close_toastify}>
                    <Alert onClose={handle_close_toastify} severity={message.severity} color={message.color} sx={{ width: '100%' }}>
                        {message.content}
                    </Alert>
                </Snackbar>
            </Stack>
            <div className="profile-form__wrapper">
                <div className="profile-form__row">
                    <div className="profile-form__title">Hồ sơ của bạn</div>
                </div>
                <div className="profile-form__row profile-form__main">
                    <div className="profile-form__form">
                        <div className="profile-form__form-labels">
                            <label htmlFor="profile-form__email-id" className="profile-form__form-label">Email</label>
                            <label htmlFor="profile-form__full-name-id" className="profile-form__form-label">Họ và tên</label>
                            <label htmlFor="profile-form__phone-id" className="profile-form__form-label">Số điện thoại</label>
                            <label className="profile-form__form-label">Giới tính</label>
                            <label htmlFor="profile-form__address-id" className="profile-form__form-label">Địa chỉ</label>
                        </div>
                        <div className="profile-form__form-inputs">
                            <div className="profile-form__form-item profile-form__form-item--readonly">
                                <input ref={email_dom} readOnly type="text" className="profile-form__form-input" id="profile-form__email-id" />
                            </div>
                            <div className="profile-form__form-item">
                                <input ref={full_name_dom} type="text" className="profile-form__form-input" id="profile-form__full-name-id" />
                            </div>
                            <div className="profile-form__form-item">
                                <input ref={phone_dom} type="text" className="profile-form__form-input" id="profile-form__phone-id" />
                            </div>
                            <div className="profile-form__form-item profile-form__form-item--radio">
                                <div className="profile-form__radio-area">
                                    <input ref={genre_dom} type="radio" className="profile-form__form-input-radio" id="profile-form__genre-male-id" name="profile-form__genre-id" />
                                    <label htmlFor="profile-form__genre-male-id" className="profile-form__radio-label">Nam</label>
                                    <input defaultChecked={true} type="radio" className="profile-form__form-input-radio" id="profile-form__genre-female-id" name="profile-form__genre-id" />
                                    <label htmlFor="profile-form__genre-female-id" className="profile-form__radio-label">Nữ</label>
                                </div>
                            </div>
                            <div className="profile-form__form-item">
                                <input ref={address_dom} type="text" className="profile-form__form-input" id="profile-form__address-id" />
                            </div>
                            <div className="profile-form__form-item">
                                <div className="profile-form__form-submit-btn" onClick={modify_info_handler}>
                                    {submit_loading ? <CircularProgress color="inherit" style={{padding: "8px"}}/> : "Lưu"}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profile-form__avt-area">
                        <div className="profile-form__avt">
                            <img 
                                ref={avt_dom} 
                                className="profile-form__avt-img" 
                                src={
                                    !preview_new_avt
                                    ? "/images/default_avt.png"
                                    : preview_new_avt
                                }
                            />
                        </div>
                        <label className="profile-form__avt-btn">
                            <input 
                                type="file" 
                                className="profile-form__avt-input" 
                                accept=".png, .jpg, .jpeg"
                                onChange={up_new_avt_handler}
                            />
                            Chọn ảnh đại diện
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}