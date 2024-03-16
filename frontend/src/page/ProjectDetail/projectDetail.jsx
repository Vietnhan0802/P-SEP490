import React, { useEffect, useState } from "react";
import "./projectDetail.scss";
import { IoPersonRemove } from "react-icons/io5";
import { Row, Col } from "react-bootstrap";
import avatar from "../../images/common/Avatar.png";
import MultiStepProgressBar from "../../components/MultiStepProgressBar";
import FormMember from "./formMember";
import SideBar from "../../components/sidebar";
import FormApply from "./FormApply";
import { projectInstance } from "../../axios/axiosConfig";
import UpdateProjectForm from "./updateProjectForm";
import { useLocation, useNavigate } from "react-router-dom";

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
const projectStatus = (process) => {
  switch (process) {
    case 0:
      return <div className="status preparing">Preparing</div>;
    case 1:
      return <div className="status process">Process</div>;
    case 2:
      return <div className="status done">Done</div>;
    case 3:
      return <div className="status pending">Pending</div>;
    default:
    // code block
  }
};
const projectVisibility = (visibility) => {
  switch (visibility) {
    case 0:
      return <div className="visibility private">Private</div>;
    case 1:
      return <div className="visibility public">Public</div>;
    case 2:
      return <div className="visibility hidden">Hidden</div>;

    default:
    // code block
  }
};
function ProjectDetail() {
  const location = useLocation();


  const [data, setData] = useState();
  const { idProject } = location.state || {};
  useEffect(() => {
    projectInstance
      .get(`/GetProjectById/${idProject}`)
      .then((res) => {
        setData(res?.data?.result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <Row className="pt-3 ms-0 me-0 mb-2">
      <Col md={3}>
        <SideBar />
      </Col>
      <Col md={9}>
        <div id="projectDetail" className="bg-white bor-rad-8 p-2">
          <h1 className="header fw-bold text-center pt-2  mb-4">{data?.name}</h1>
          <Row className="pb-4 justify-content-between">
            <Col md={6}>
              <div className="image-container d-flex justify-content-center">
                <img
                  className="rounded-t-lg bor-8"
                  src={data?.avatar}
                  alt="project"
                />
              </div>
            </Col>
            <Col md={6} className="px-4">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex project">
                  <div className="width-auto">
                    <img
                      src={data?.avatarUser}
                      alt="avatar"
                      className="avatar"
                      style={{ borderRadius: "50%" }}
                    />
                  </div>
                  <div className="width-auto ps-3">
                    <p className="owner-name fw-bold">{data?.fullName}</p>
                    <p className="project-start-date">
                      {formatDate(data?.createdDate)}
                    </p>
                  </div>
                </div>
                <UpdateProjectForm />
              </div>

              <div className="status-block size-18">
                <label htmlFor="" className="">
                  Project Status:
                  {projectStatus(data?.process)}
                </label>
              </div>
              <div className="status-block size-18">
                <label htmlFor="" className="">
                  Access Visibility:
                  {projectVisibility(data?.visibility)}
                </label>
              </div>

              <div className="process-bar">
                <MultiStepProgressBar page={data?.process} />
              </div>
            </Col>
          </Row>
          <div className="description-cover">
            <p className="description fw-bold ps-3">Description</p>
            <p className="description-text ps-3">{data?.description}</p>
            <div className="description-text">
              <p className="description fw-bold ps-3 ">Position: </p>
              {data?.positionViews.map((position) => (<p className="ps-3">{position.namePosition}</p>))}
            </div>
          </div>
          <div className="member px-3">
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-end">
                <p className="title fw-bold">Member</p>
              </div>
              <div className="d-flex align-items-center">
                {" "}
                <FormMember projectId={idProject} positionOption={data?.positionViews} />
                <FormApply />
              </div>
            </div>
            <table className="w-100">
              <thead>
                <tr>
                  <th className="w-20 py-3">User Name</th>
                  <th className="w-10 py-3 text-center">Date</th>
                  <th className="w-60 py-3">Description</th>
                  <th className="w-10 py-3 text-center">Remove</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="w-20 py-3">
                    <div className="d-flex align-items-center">
                      <img src={avatar} className="member-img" alt="avatar" />
                      <p className="ps-3">Olivia Rhye</p>
                    </div>
                  </td>
                  <td className="w-20 py-3 text-center">21 Jan 2024</td>
                  <td className="w-60 py-3">
                    Lack of relevant and substantial information
                  </td>
                  <td className="w-10 py-3 text-center  yellow-icon">
                    <IoPersonRemove />
                  </td>
                </tr>
                <tr>
                  <td className="w-20 py-3">
                    <div className="d-flex align-items-center">
                      <img src={avatar} className="member-img" alt="avatar" />
                      <p className="ps-3">Olivia Rhye</p>
                    </div>
                  </td>
                  <td className="w-20 py-3 text-center">21 Jan 2024</td>
                  <td className="w-60 py-3">
                    Lack of relevant and substantial information
                  </td>
                  <td className="w-10 py-3 text-center  yellow-icon">
                    <IoPersonRemove />
                  </td>
                </tr>

                <tr>
                  <td className="w-20 py-3">
                    <div className="d-flex align-items-center">
                      <img src={avatar} className="member-img" alt="avatar" />
                      <p className="ps-3">Olivia Rhye</p>
                    </div>
                  </td>
                  <td className="w-20 py-3 text-center">21 Jan 2024</td>
                  <td className="w-60 py-3">
                    Lack of relevant and substantial information
                  </td>
                  <td className="w-10 py-3 text-center  yellow-icon">
                    <IoPersonRemove />
                  </td>
                </tr>
                <tr>
                  <td className="w-20 py-3">
                    <div className="d-flex align-items-center">
                      <img src={avatar} className="member-img" alt="avatar" />
                      <p className="ps-3">Olivia Rhye</p>
                    </div>
                  </td>
                  <td className="w-20 py-3 text-center">21 Jan 2024</td>
                  <td className="w-60 py-3">
                    Lack of relevant and substantial information
                  </td>
                  <td className="w-10 py-3 text-center  yellow-icon">
                    <IoPersonRemove />
                  </td>
                </tr>
              </tbody>

            </table>
          </div>
        </div>
      </Col>
    </Row>

  );
}

export default ProjectDetail;
