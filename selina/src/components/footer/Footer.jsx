import "./footer.css"

export default function Footer() {
    
    return (
        <div className="footer">
            <div className="footer__item">
                <img src="/images/logo.png" alt="" className="footer__logo"/>
            </div>
            <div className="footer__trademark">
                <pre><b>Copyright &copy; 2022</b> Selina. All right reserved</pre>
            </div>
        </div>
    )
}