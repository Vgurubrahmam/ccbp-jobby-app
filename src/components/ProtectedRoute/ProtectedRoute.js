import {Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = ({element: Component, ...rest}) => {
  const token = Cookies.get('jwt_token')

  if (token === undefined) {
    // Redirect to login if token is not found
    return <Redirect to="/login" />
  }

  // Render the protected component
  return <Route {...rest} element={<Component />} />
}

export default ProtectedRoute
