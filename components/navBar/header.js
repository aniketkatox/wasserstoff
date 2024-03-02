import LogInLogOut from "./login-btn"
import { CategoryPane } from "./categoryPane"

export const Header = ({ headerProp }) => {

    const categoryPaneProp = {
        setSelectedCategory : headerProp.setSelectedCategory
    };

    return (
        <div id="header" className="p-3 bg-slate-500 text-white flex justify-between items-center">
            <div id="welcome-message">
                PDF-Bucket!
            </div>
            <div id="categories" className="float-left">
                <CategoryPane categoryPaneProp = { categoryPaneProp }/>
            </div>
            <div id="login-logout-button" className="float-right">
                <LogInLogOut/>
            </div>
        </div>
    )
}