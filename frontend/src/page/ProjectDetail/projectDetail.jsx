import React, { useEffect, useState } from "react";
import "./projectDetail.scss";
import { IoPersonRemove } from "react-icons/io5";
import { Row, Col } from "react-bootstrap";
import defaultAvatar from "../../images/common/default.png";
import MultiStepProgressBar from "../../components/MultiStepProgressBar";
import FormMember from "./formMember";
import SideBar from "../../components/sidebar";
import FormApply from "./FormApply";
import { projectInstance } from "../../axios/axiosConfig";
import UpdateProjectForm from "./updateProjectForm";
import { useLocation, useNavigate } from "react-router-dom";
import DeletePopup from "./Popup/DeletePopup";
import RemoveMember from "./Popup/RemoveMember";

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
      return <div>Preparing</div>;
    case 1:
      return <div>Process</div>;
    case 2:
      return <div>Pending</div>;
    case 3:
      return <div>Done</div>;

    default:
    // code block
  }
};
const projectVisibility = (visibility) => {
  switch (visibility) {
    case 0:
      return <div>Private</div>;
    case 1:
      return <div>Public</div>;
    case 2:
      return <div>Hidden</div>;

    default:
    // code block
  }
};
function ProjectDetail() {
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { role, currentUserId } = sessionData;
  const location = useLocation();
  const [data, setData] = useState();
  const [resetProject, setResetProject] = useState(false);
  const [projectMembers, setProjectMembers] = useState([]);
  const [reset, setReset] = useState(false);
  const { idProject } = location.state || {};

  useEffect(() => {
    projectInstance.get(`/GetProjectById/${idProject}`)
      .then((res) => {
        setData(res?.data?.result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [resetProject, idProject]);
  useEffect(() => {
    projectInstance.get(`/GetAllMemberInProject/${idProject}`)
      .then((res) => {
        const data = res?.data?.result;
        if (Array.isArray(data) && data?.length > 0) {
          setProjectMembers(data);
        } else {
          setProjectMembers([]);
        }
      })
      .catch((error) => {
        console.error(error);
        setProjectMembers([]);
      });
  }, [resetProject, idProject]);
  const resetPage = (value) => {
    setResetProject(prevReset => !prevReset);
  }
  return (
    <Row className="pt-3 ms-0 me-0 pb-3">
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
                  src={data?.avatarSrc}
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
                {data?.idAccount === currentUserId &&
                  <div className="d-flex ">
                    <UpdateProjectForm input={data} id={data?.idProject} resetPage={resetPage} />
                    <DeletePopup className='ms-3' id={data?.idProject} />
                  </div>}
              </div>
              <div className="status-block size-18 d-flex mt-3">
                <div>
                  <p className="fw-bold">
                    Project Status:
                  </p>
                  <p className="mt-2 fw-bold" >
                    Access Visibility:
                  </p>
                </div>
                <div className="ms-2">
                  <p>
                    {projectStatus(data?.process)}
                  </p>
                  <p className="mt-2">
                    {projectVisibility(data?.visibility)}
                  </p>
                </div>
              </div>
              <div className="status-block size-18">

              </div>
              <div className="w-100 mt-2">
                <div className="fw-bold">Position:</div>
                <div className="position-list">
                  {data?.positionViews.length > 0 && (
                    <ol className="position-items">
                      {data?.positionViews.map((position) => (
                        <li key={position.id} className="position-item">
                          <p className="d-flex justify-content-center">{position.namePosition}</p>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
              <div className="process-bar">
                <MultiStepProgressBar page={data?.process} />
              </div>
            </Col>
          </Row>
          <div className="description-cover">
            <p className="description fw-bold ps-3">Description</p>
            <p className="description-text ps-3">{data?.description}</p>

          </div>
          <div className="member px-3">
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-end">
                <p className="title fw-bold">Member</p>
              </div>
              <div className="d-flex align-items-center">
                {role === 'Business' &&
                  <FormMember projectId={idProject} positionOption={data?.positionViews} />
                }
                {role === 'Member' && data?.process !== 3 &&
                  <FormApply projectId={idProject} positionOption={data?.positionViews} />
                }

              </div>
            </div>
            <div className="member">
              <div className="members-table-container">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th className="w-20 py-3">Full-Name</th>
                      <th className="w-10 py-3 text-center">Date</th>
                      <th className="w-60 py-3">Position</th>
                      <th className="w-10 py-3 text-center">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectMembers?.length > 0 ?

                      projectMembers?.map((member) => (
                        <tr key={member.idProjectMember}>
                          <td className="w-20 py-3">
                            <div className="d-flex align-items-center">
                              <img src={member.avatar === 'https://localhost:7006/Images/' ? defaultAvatar : member.avatar} className="member-img" alt="avatar" />
                              <p className="ps-3">{member.fullName}</p>
                            </div>
                          </td>
                          <td className="w-20 py-3 text-center">{formatDate(member.createdDate)}</td>
                          <td className="w-60 py-3">
                            {member.namePosition}
                          </td>
                          <td className="w-10 py-3 text-center  yellow-icon">
                            <RemoveMember id={member.idProjectMember} project={idProject} resetPage={resetPage} />
                          </td>
                        </tr>
                      )) : <tr> {/* Add a single row for the message */}
                        <td colSpan="4" className="text-center py-3"> {/* Use colspan="4" because there are 4 columns */}
                          There is no member in this project
                        </td>
                      </tr>}
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>

  );
}

export default ProjectDetail;
