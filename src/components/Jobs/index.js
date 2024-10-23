import {MdEmail, MdLocationOn} from 'react-icons/md'
import {FaStar} from 'react-icons/fa'
import {BsSearch} from 'react-icons/bs'
import {useEffect, useState} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {useHistory} from 'react-router-dom'

import Header from '../Header'
import './index.css'

const apiStatusContains = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Jobs = ({employmentTypesList, salaryRangesList}) => {
  const history = useHistory()
  const jwtToken = Cookies.get('jwt_token')
  const [profileData, setProfileData] = useState({})
  const [jobsData, setJobsData] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [apiStatus, setApiStatus] = useState(apiStatusContains.initial)
  const [error, setError] = useState(false)
  const [profile, setProfile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEmploymentTypes, setEmploymentTypes] = useState([])
  const [selectedSalary, setSelectedSalary] = useState('')

  const onGettingSingleJob = id => {
    history.replace(`/jobs/${id}`)
  }

  const onChangeInput = event => {
    setSearchInput(event.target.value)
  }

  const getProfileData = async () => {
    setApiStatus(apiStatusContains.inProgress)
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      setProfileData(data.profile_details)
      setApiStatus(apiStatusContains.success)
    } else {
      setProfile(true)
      setIsLoading(true)
      setApiStatus(apiStatusContains.failure)
    }
  }

  const getJobsData = async () => {
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${selectedEmploymentTypes.join(
      ',',
    )}&minimum_package=${selectedSalary}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      setJobsData(data.jobs)
      setApiStatus(apiStatusContains.success)
    } else {
      setError(true)
      setIsLoading(true)
      setApiStatus(apiStatusContains.failure)
    }
  }

  const handleEmploymentTypesChange = event => {
    const {value, checked} = event.target
    if (checked) {
      setEmploymentTypes(prevEmployment => [...prevEmployment, value])
    } else {
      setEmploymentTypes(prevEmployment =>
        prevEmployment.filter(type => type !== value),
      )
    }
  }

  const handleSalaryOfEmployment = event => {
    setSelectedSalary(event.target.value)
  }

  useEffect(() => {
    getProfileData()
    getJobsData()
  }, [])

  useEffect(() => {
    getJobsData()
  }, [selectedEmploymentTypes, selectedSalary, searchInput])

  const renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  const renderProfile = () => (
    <div className="profile-container">
      <img
        alt="profile"
        src={profileData?.profile_image_url}
        className="profile"
      />
      <h1 className="name">{profileData?.name}</h1>
      <p className="bio">{profileData?.short_bio}</p>
    </div>
  )

  const renderProfileFailure = () => (
    <div className="failure-con">
      <button className="retry-btn" onClick={getProfileData}>
        Retry
      </button>
    </div>
  )

  const renderJobsList = () => {
    if (isLoading) return renderLoader()
    if (error) {
      return (
        <div className="failure-con">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
            className="no-jobs-img"
          />
          <h1>Oops! Something Went Wrong</h1>
          <p>We cannot seem to find the page you are looking for.</p>
          <button className="retry-btn" onClick={getJobsData}>
            Retry
          </button>
        </div>
      )
    }
    if (jobsData.length > 0) {
      return jobsData.map(eachJobData => (
        <li
          className="job-card"
          key={eachJobData.id}
          onClick={() => onGettingSingleJob(eachJobData.id)}
        >
          <div className="company-data">
            <img
              src={eachJobData.company_logo_url}
              alt="company logo"
              className="logo"
            />
            <div>
              <h1>{eachJobData.title}</h1>{' '}
              <p>
                <FaStar className="rating" />
                {eachJobData.rating}
              </p>
            </div>
          </div>
          <div className="company-location">
            <div className="location">
              <p>
                <MdLocationOn />
                {eachJobData.location}
              </p>
              <p>
                <MdEmail />
                {eachJobData.employment_type}
              </p>
            </div>
            <p>{eachJobData.package_per_annum}</p>
          </div>
          <hr className="hr-con" />
          <h3 className="bio-heading">Description</h3>
          <p>{eachJobData.job_description}</p>
        </li>
      ))
    }
    return (
      <div className="failure-con">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-img"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    )
  }

  return (
    <div className="jobs-container">
      <Header />
      <div className="content-container">
        <div className="search-con">
          {isLoading && renderLoader()}
          {!profile && !isLoading && renderProfile()}
          {profile && renderProfileFailure()}
          <hr className="hr-con" />
          <div className="filter-container">
            <h1>Type of Employment</h1>
            <ul>
              {employmentTypesList.map(eachEmploy => (
                <li key={eachEmploy.employmentTypeId}>
                  <div className="eachItem">
                    <input
                      type="checkbox"
                      id={eachEmploy.employmentTypeId}
                      className="data-input"
                      value={eachEmploy.employmentTypeId}
                      onChange={handleEmploymentTypesChange}
                    />
                    <label htmlFor={eachEmploy.employmentTypeId}>
                      {eachEmploy.label}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
            <hr className="hr-con" />
            <h1>Salary Range</h1>
            <ul>
              {salaryRangesList.map(employSalary => (
                <li key={employSalary.salaryRangeId}>
                  <div className="eachItem">
                    <input
                      type="radio"
                      className="data-input"
                      id={employSalary.salaryRangeId}
                      name="salaryRange"
                      value={employSalary.salaryRangeId}
                      onChange={handleSalaryOfEmployment}
                    />
                    <label htmlFor={employSalary.salaryRangeId}>
                      {employSalary.label}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="jobs-cards-con">
          <div className="search-input">
            <input type="search" value={searchInput} onChange={onChangeInput} />
            <button
              type="button"
              onClick={getJobsData}
              data-testid="searchButton"
              className="search-btn"
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <ul>{renderJobsList()}</ul>
        </div>
      </div>
    </div>
  )
}

export default Jobs
