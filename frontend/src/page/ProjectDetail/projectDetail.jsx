import React, { useEffect, useState } from "react";
import "./projectDetail.scss";
import { Row, Col } from "react-bootstrap";
import MultiStepProgressBar from "../../components/MultiStepProgressBar";
import FormMember from "./formMember";
import SideBar from "../../components/sidebar";
import FormApply from "./FormApply";
import { projectInstance } from "../../axios/axiosConfig";
import UpdateProjectForm from "./updateProjectForm";
import { useLocation, useNavigate } from "react-router-dom";
import DeletePopup from "./Popup/DeletePopup";
import RemoveMember from "./Popup/RemoveMember";
import tick from "../../images/common/verifiedTick.png";
import { Rating } from 'react-simple-star-rating'
import RatingPopup from "./Popup/RatingPopup";
import RatingFeedback from "./Popup/RatingFeedback";
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
  const [isInProject, setIsInProject] = useState(false);
  const { idProject } = location.state || {};
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [showRatingMemberPopup, setShowRatingMemberPopup] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [showMemberFeedbackPopup, setShowMemberFeedbackPopup] = useState(false);
  const [popupMemberRate, setPopupMemberRate] = useState({});
  const [popupMemberRateFeedback, setPopupMemberRateFeedback] = useState({});
  useEffect(() => {
    projectInstance.get(`/GetProjectById/${currentUserId}/${idProject}`)
      .then((res) => {
        setData(res?.data?.result);
        console.log(res?.data?.result)
        if (res?.data?.result?.idAccount !== currentUserId) {
          setIsInProject(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [resetProject, idProject, currentUserId]);
  useEffect(() => {
    projectInstance.get(`/GetAllMemberInProject/${currentUserId}/${idProject}`)
      .then((res) => {
        const data = res?.data?.result;
        data.filter((item) => {
          if (item.idAccount === currentUserId) {
            return setIsInProject(false);
          }
        })
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
  }, [resetProject, idProject, currentUserId]);
  const resetPage = (value) => {
    setResetProject(prevReset => !prevReset);
  }
  const handleMemberRating = (idAccount, idProjectMember) => {
    if (role !== 'Admin') {
      setShowRatingMemberPopup(true)
      setPopupMemberRate({ idAccount: idAccount, idProjectMember: idProjectMember });
    }
  }
  const handleMemberRatingFeedback = (idAccount) => {
    setShowMemberFeedbackPopup(true)
    setPopupMemberRateFeedback({ idAccount: idAccount });
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
                    <div className="position-relative">
                      <div className="profile">
                        <img src={data?.avatarUser} alt="profile" />
                      </div>
                      {data?.isVerified && <img src={tick} alt="tick" className="position-absolute bottom-0 end-0" style={{ width: '18px' }} />}
                    </div>
                  </div>
                  <div className="width-auto ps-3">
                    <p className="owner-name fw-bold">{data?.fullName}</p>
                    <p className="project-start-date">
                      {formatDate(data?.createdDate)}
                    </p>
                  </div>
                </div>
                {data?.process === 3 &&
                  <div className="d-flex align-items-center"
                    onClick={() => (data?.isRating || data?.idAccount === currentUserId || role === 'Admin' || isInProject) ? setShowFeedbackPopup(true) : setShowRatingPopup(true)}
                  >
                    <Rating
                      initialValue={data?.ratingAvg}
                      readonly={true}
                      allowFraction={true}
                    />
                    {data?.isRating || data?.idAccount === currentUserId || role === 'Admin' || isInProject ? '' :
                      <p className="ms-2">Not rated</p>
                    }
                  </div>
                }



                {data?.idAccount === currentUserId &&
                  <div className="d-flex ms-2">
                    {data?.process !== 3 &&
                      <UpdateProjectForm input={data} id={data?.idProject} resetPage={resetPage} />
                    }
                    <DeletePopup className='ms-3' id={data?.idProject} />
                  </div>}
              </div>
              {showRatingPopup && <RatingPopup show={showRatingPopup} idRater={currentUserId} projectid={idProject} onClose={() => setShowRatingPopup(!showRatingPopup)} type={'project'} resetPage={resetPage} />}
              {showFeedbackPopup && <RatingFeedback show={showFeedbackPopup} idProject={idProject} formatDateString={formatDate} onClose={() => setShowFeedbackPopup(!showFeedbackPopup)} resetPage={resetPage} currentUserId={currentUserId} />}
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
            {/* <p className="description-text ps-3">{data?.description}</p> */}
            <div className="ps-3" dangerouslySetInnerHTML={{ __html: data?.description }} />
          </div>
          <div className="member px-3">
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-end">
                <p className="title fw-bold">Member</p>
              </div>
              <div className="d-flex align-items-center">
                {role === 'Business' && !isInProject &&
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
                      {data?.process === 3 ?
                        <th className="w-10 py-3 text-center">Rate</th> : (
                          role === 'Business' && <th className="w-10 py-3 text-center">Remove</th>
                        )
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {projectMembers?.length > 0 ?
                      projectMembers?.map((member) => (
                        <tr key={member.idProjectMember}>
                          <td className="w-20 py-3">
                            <div className="d-flex align-items-center">
                              <div className="profile" style={{ width: '30px', height: '30px' }}>
                                <img src={member.avatar} alt="avatar" />
                              </div>
                              <p className="ps-3">{member.fullName}</p>
                            </div>
                          </td>
                          <td className="w-20 py-3 text-center">{formatDate(member.createdDate)}</td>
                          <td className="w-50 py-3">
                            {member.namePosition}
                          </td>
                          {
                            data?.process === 3
                              ?
                              <td className="w-20 py-3 text-center  yellow-icon" >
                                <div
                                  className={`d-flex align-items-center ${member?.isRating || role === 'Admin' || isInProject ? 'justify-content-center' : ''}`}
                                  onClick={() => (member?.isRating || role === 'Admin' || isInProject) ?
                                    handleMemberRatingFeedback(member?.idAccount) :
                                    // setShowRatingMemberPopup(member?.idAccount === currentUserId ? false : true)
                                    handleMemberRating(member?.idAccount, member.idProjectMember)
                                  }
                                >
                                  <div>
                                    <Rating
                                      size={12}
                                      initialValue={member?.ratingAvg}
                                      readonly={true}
                                      allowFraction={true}
                                    />
                                  </div>
                                  {member?.isRating === false && member?.idAccount !== currentUserId && role !== 'Admin' && !isInProject &&
                                    <p className="ms-2" style={{ fontSize: '10px', color: "black" }}>Note rated</p>
                                  }
                                </div>
                              </td>
                              :
                              <td className="w-10 py-3 text-center  yellow-icon">
                                {role === 'Business' && <RemoveMember id={member.idProjectMember} project={idProject} resetPage={resetPage} />}
                              </td>
                          }
                        </tr>
                      )) : <tr> {/* Add a single row for the message */}
                        <td colSpan="4" className="text-center py-3"> {/* Use colspan="4" because there are 4 columns */}
                          There is no member in this project
                        </td>
                      </tr>}
                    {showRatingMemberPopup &&
                      <RatingPopup show={showRatingMemberPopup} idRater={currentUserId} idRated={popupMemberRate.idAccount} projectid={idProject} onClose={() => setShowRatingMemberPopup(!showRatingMemberPopup)} idProjectMember={popupMemberRate.idProjectMember} type={'member'} resetPage={resetPage} />
                    }
                    {
                      showMemberFeedbackPopup &&
                      <RatingFeedback show={showMemberFeedbackPopup} idUser={popupMemberRateFeedback.idAccount} idProject={idProject} formatDateString={formatDate} onClose={() => setShowMemberFeedbackPopup(!showMemberFeedbackPopup)} type={'member'} resetPage={resetPage} currentUserId={currentUserId} />
                    }
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
