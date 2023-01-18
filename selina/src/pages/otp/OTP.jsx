import UnAuthorizationLayout from "../../components/un_authorization_layout/UnAuthoizationLayout"
import OTPForm from "../../components/otp_form/OTPForm"

function ForgotPassword (){ 
  console.log(1)
  return (
    <UnAuthorizationLayout 
      body={<OTPForm/>}
    />
  );
};

export default ForgotPassword;