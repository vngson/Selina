import TopBar from "../topbar/Topbar"
import Footer from "../footer/Footer"
import "./main_layout.css"

export default function MainLayout({body}) {

    return (
        <div className="main-layout">
            <div className="main-layout__top">
                {/* <TopBar/> */}
            </div>
            <div className="main-layout__body">
                {body}
            </div>
            <div className="main-layout__footer">
                {/* <Footer/> */}
            </div>
        </div>
    )
}