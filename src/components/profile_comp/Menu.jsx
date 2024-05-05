import React from "react";
// import {logo} from "../../assets/profile_assets/index"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";


const Menu =()=>{

    const { logout } = useAuth()
    const navigate = useNavigate()
    
    async function handleLogout() {
      try {
          await logout()
          navigate("/")
      } catch {
          console.log("Failed to log out")
      }
    }

    return (
        <>
          <div className="menu_N">
            <span className="logo_N">
              <img crossOrigin='anonymous' src="https://drive.lienuc.com/uc?export=view&id=1jCd9ThKgNM5Ayst2U3e0-N_qxOi_lkj8" alt="err" style={{height:"30px"}}/>
            </span>
            <span className="logo_N">
              <Link to="/" className="Head_N"><span >Home</span></Link>
              <Link to="/auction" className="Head_N"><span>Auctions</span></Link>
              <Link to="/node" className="Head_N"><span>Connections</span></Link>
            </span>

            <div className="logt_N">
            <button className="btn2_N" onClick={handleLogout}>Log Out</button>
            </div>

          </div>

        </>
    )
}

export default Menu;