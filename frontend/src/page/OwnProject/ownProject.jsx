import React, { useEffect } from "react";
import "./ownProject.scss";
import { CiSearch } from "react-icons/ci";
import tick from "../../images/common/verifiedTick.png";
import { useState } from "react";
import { projectInstance } from "../../axios/axiosConfig";
import CreateProject from "./createProject";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import SideBar from "../../components/sidebar";
import Follow from "../../components/follow";
import { Rating } from 'react-simple-star-rating'

const formatDate = (timestamp) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};
function OwnProject({ value }) {
  const sessionData = JSON.parse(sessionStorage.getItem('userSession')) || {};
  const { role, currentUserId } = sessionData;
  const navigate = useNavigate();
  const [resetProject, setResetProject] = useState(false);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [filterProjects, setFilterProject] = useState();
  const hanldeViewDetail = (projectId) => {
    navigate('/projectdetail', { state: { idProject: projectId } })
  };

  useEffect(() => {
    if (role === 'Member') {
      projectInstance.get(`GetProjectByMember/${currentUserId}`)
        .then((res) => {
          setProjects(res?.data?.result);
        })
        .catch((error) => { console.error(error) })
    } else {
      projectInstance.get(`GetProjectByUser/${currentUserId}`)
        .then((res) => {
          setProjects(res?.data?.result);
        })
        .catch((error) => { console.error(error) })
    }
  }, [resetProject])
  const reset = (value) => {
    if (value === "Success") {
      setResetProject(!resetProject);
    }
  }
  const handleSearch = (event) => {
    setSearch(event.target.value);
    const searchLower = event.target.value.toLowerCase();
    const filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchLower) || project.fullName.toLowerCase().includes(searchLower)
    );
    setFilterProject(filtered);
  }
  return (
    <Row className="pt-3 ms-0 me-0">
      <Col md={3} >
        <SideBar />
      </Col>
      <Col md={6}>
        <div id="own_project">
          <div className="bg-white p-2 d-flex flex-grid align-items-center justify-content-between row m-0 form mb-3">
            <div className="d-flex project-search align-items-center position-relative col">
              <CiSearch className="" />
              <input
                type="text"
                placeholder={"Search"}
                value={search}
                onChange={handleSearch}
                className="search-box size-20 w-100"
              />
            </div>
            <div className="d-flex flex-row align-items-center col-auto m-md-0-cus mt-2 p-0">
              {role === "Business" ? (
                <CreateProject reset={reset} />
              ) : (
                ""
              )}
            </div>
          </div>

          {(search ? filterProjects : projects)?.map((item) => (
            <div className="p-2 card bg-white p-6 rounded-lg w-96 mb-4" key={item.idProject}>
              <div className="image-container d-flex justify-content-center">
                <img
                  className="rounded-t-lg bor-8"
                  src={item.avatarSrc}
                  alt="Laptop with developer items spread around"
                />
              </div>
              <div className="mt-2 ">
                <h2 className="text-xl SFU-bold">{item.name}</h2>
                {/* <p className="text-gray-600 SFU-reg">
                  {item.description}
                </p> */}
                <hr />
                <div className="d-flex items-center justify-content-between mt-2">
                  <div className="d-flex items-center">
                    <div className="position-relative">
                      <div className="profile">
                        <img src={item.avatarUser} alt="profile" />
                      </div>
                      {item.isVerified && <img src={tick} alt="tick" className="position-absolute bottom-0 end-0" style={{ width: '18px' }} />}
                    </div>
                    <div className="left-30 d-flex flex-column justify-content-center">
                      <div className="size-20 SFU-heavy d-flex">{item.fullName}</div>
                      <div className="size-14 SFU-reg text-gray-600 d-flex">
                        Date Create: {formatDate(item.createdDate)}
                      </div>
                    </div>
                    <div className="ms-2 d-flex align-items-center">
                      <div className="ms-2" style={{ fontSize: '20px', marginTop: '5px' }}>{item?.ratingAvg}</div>

                      <Rating
                        className="ms-2"
                        size={20}
                        initialValue={item?.ratingAvg}
                        allowFraction={true}
                        readonly={true}
                      />
                      <div className="ms-2" style={{ fontSize: '20px', marginTop: '5px' }}><span>&#10098;</span>{item?.ratingNum}<span>&#10099;</span></div>

                    </div>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <button className="d-flex flex-row align-items-center btn bg-white text-dark px-4 py-2 rounded btn-light border border-dark"
                      onClick={() => hanldeViewDetail(item.idProject)}
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </Col>
      <Col md={3}>
        <Follow followValue={value} />
      </Col>
    </Row>
  );
}

export default OwnProject;
