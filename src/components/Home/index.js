// Consolidate imports from 'react-router-dom' into one statement
import {useHistory, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const Home = () => {
  const history = useHistory()
  const jwtToken = Cookies.get('jwt_token')

  if (jwtToken === undefined) {
    history.replace('/login')
  }

  return (
    <div className="home-con">
      <Header />
      <div className="home-data-con">
        <h1 className="main-heading">Find The Job That Fits Your Life</h1>
        <p className="home-description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button className="findJobs-btn">Find Jobs</button>
        </Link>
      </div>
    </div>
  )
}

export default Home
