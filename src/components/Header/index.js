import {AiFillHome} from 'react-icons/ai'
import {MdEmail} from 'react-icons/md'
import {IoIosLogOut} from 'react-icons/io'
import Cookies from 'js-cookie'
import {useHistory, Link} from 'react-router-dom'
import './index.css'

const Header = () => {
  const history = useHistory()
  const ondeleteUser = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <>
      <div className="check">
        <div className="header-con">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              className="logo"
              alt="website logo"
            />
          </Link>

          <div className="links-con">
            <Link className="link" to="/">
              Home
            </Link>
            <Link className="link" to="/jobs">
              Jobs
            </Link>
          </div>
          <button className="logout-btn" onClick={ondeleteUser}>
            Logout
          </button>
        </div>
      </div>
      <div className="header-con-smallSize">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="logo"
          alt="website logo"
        />
        <div className="links-con-sm">
          <Link className="link" to="/">
            <AiFillHome />
          </Link>
          <Link className="link" to="/jobs">
            <MdEmail />
          </Link>
        </div>
        <button className="logout-btn-sm" onClick={ondeleteUser}>
          <IoIosLogOut />
        </button>
      </div>
    </>
  )
}
export default Header
