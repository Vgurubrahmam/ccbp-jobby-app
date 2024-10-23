import {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const LoginForm = () => {
  const [username, setuserName] = useState('')
  const [password, setPassword] = useState('')
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errormsg, setErrorMsg] = useState('')
  const history = useHistory()
  useEffect(() => {
    const getJwtToken = Cookies.get('jwt_token')
    if (getJwtToken !== undefined) {
      history.replace('/')
    }
  }, [])
  const onChangeUsername = event => {
    setuserName(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const submitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
    setShowSubmitError(false)
    setErrorMsg('')
  }
  const submitError = errmsg => {
    setShowSubmitError(true)
    setErrorMsg(errmsg)
  }

  const onSubmitData = async event => {
    event.preventDefault()
    const userDatails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDatails),
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      submitSuccess(data.jwt_token)
      setuserName('')
      setPassword('')
      setErrorMsg('')
    } else {
      submitError(data.error_msg)
    }
  }

  return (
    <div className="login-con">
      <div className="card-con">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="logo"
        />
        <form onSubmit={onSubmitData}>
          <label htmlFor="USERNAME">USERNAME</label>
          <input
            className="input-con"
            type="text"
            placeholder="username"
            id="USERNAME"
            value={username}
            onChange={onChangeUsername}
          />
          <label htmlFor="password">PASSWORD</label>
          <input
            className="input-con"
            type="password"
            placeholder="password"
            id="password"
            value={password}
            onChange={onChangePassword}
          />
          <button className="login-btn" type="submit">
            Login
          </button>
          {showSubmitError && <p className="error-msg">{errormsg}</p>}
        </form>
      </div>
    </div>
  )
}

export default LoginForm
