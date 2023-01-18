import "./un_authorization_layout.css"

function UnAuthorizationLayout ({ nav, body }){ 
    return (
      <div className="un-authorization-layout">
        <div className="un-authorization-layout__main-region">
          <img className="main-region__logo" src="/images/logo.png" alt="selina logo"/>
          <div className="main-region__nav">
            {nav}
          </div>
          <div className="main-region__body">
            {body}
          </div>
        </div>
      </div>
    );
  };
  
  export default UnAuthorizationLayout;