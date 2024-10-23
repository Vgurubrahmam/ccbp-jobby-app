import {MdEmail, MdLocationOn} from 'react-icons/md'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {useParams} from 'react-router-dom'
import Cookies from 'js-cookie'
import {useEffect, useState} from 'react'
import Header from '../Header'
import './index.css'

const JobItem = ({specificJobData}) => {
  const jwtToken = Cookies.get('jwt_token')
  const [jobDetails, setJobDetails] = useState([])
  const [skills, setSkills] = useState([])
  const [lifeAtCompany, setLifeAtCompany] = useState({})
  const [similarJobs, setSimilarJobs] = useState([])

  const {id} = useParams()

  const jobsUrl = `https://apis.ccbp.in/jobs/${id}`
  const jobsOptions = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  }

  const getJobsData = async () => {
    const response = await fetch(jobsUrl, jobsOptions)
    const data = await response.json()
    if (response.ok === true) {
      setJobDetails(data.job_details)
      setLifeAtCompany(data.job_details.life_at_company)
      setSkills(data.job_details.skills)
      setSimilarJobs(data.similar_jobs)
    }
  }

  useEffect(() => {
    getJobsData()
  }, [])

  return (
    <div className="jobs-details-con">
      <Header />
      <div className="each-job-data">
        <div className="company-data">
          <img
            src={jobDetails.company_logo_url}
            className="logo"
            alt="company logo"
          />
          <div>
            <h3>{jobDetails.title}</h3>
            <p>
              <FaStar className="rating" />
              {jobDetails.rating}
            </p>
          </div>
        </div>
        <div className="company-location">
          <div className="location">
            <p>
              <MdLocationOn />
              {jobDetails.location}
            </p>
            <p>
              <MdEmail />
              {jobDetails.employment_type}
            </p>
          </div>
          <p>{jobDetails.package_per_annum}</p>
        </div>
        <hr className="hr-con" />
        <div className="bio-con">
          <h1 className="bio-heading-card">Description</h1>
          <a href={jobDetails.company_website_url}>
            Visit
            <FaExternalLinkAlt />
          </a>
        </div>
        <p>{jobDetails.job_description}</p>
        <h1 className="bio-heading-card">Skills</h1>
        <ul className="skill-con">
          {skills.map(skill => (
            <li key={skill.name}>
              <img
                src={skill.image_url}
                alt={skill.name}
                className="skill-img"
              />
              <p>{skill.name}</p>
            </li>
          ))}
        </ul>
        <div>
          <h1>Life at Company</h1>
          <div className="life-at-company">
            <p className="bio-life-at-company">{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.image_url}
              className="company-img"
              alt="life at company"
            />
          </div>
        </div>
      </div>
      <div className="similar-job-con">
        <h1>Similar Jobs</h1>
        <ul className="similar-jobs">
          {similarJobs.map(job => (
            <li className="each-job-con" key={job.id}>
              <div className="similar-jobs-data">
                <img
                  src={job.company_logo_url}
                  className="logo"
                  alt="similar job company logo"
                />
                <div>
                  <p>{job.title}</p>
                  <p>
                    <FaStar className="rating" />
                    {job.rating}
                  </p>
                </div>
              </div>
              <p className="bio-heading">Description</p>
              <p>{job.job_description}</p>
              <div className="location">
                <p>
                  <MdLocationOn />
                  {job.location}
                </p>
                <p>
                  <MdEmail />
                  {job.employment_type}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default JobItem
