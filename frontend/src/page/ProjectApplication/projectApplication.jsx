import React, { useEffect, useState } from "react";
import "./projectApplication.scss";
import Table, { SelectColumnFilter } from "./table";
import AcceptConfirm from "./acceptConfirm";
import RejectConfirm from "./rejectConfirm";
import { Col, Row } from "react-bootstrap";
import SideBar from "../../components/sidebar";
import { projectInstance } from "../../axios/axiosConfig";
import CancelItem from "./CancelItem";
import tick from "../../images/common/verifiedTick.png";

const createData = (
  id,
  name,
  email,
  position,
  project,
  imgUrl,
  cvFile,
  isVerified
) => {
  return {
    id,
    name,
    email,
    position,
    project,
    imgUrl,
    cvFile,
    isVerified,
  };
};

function ProjectApplication({ onSidebarClick }) {
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { currentUserId, role } = sessionData;
  const [resetPage, setResetPage] = useState(true);
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="position-relative">
              <img
                src={row.original.imgUrl}
                alt="profile"
                className="avatar-contain"
                style={{ borderRadius: "50%" }}
              />
              {row.original.isVerified && (
                <img
                  src={tick}
                  alt="tick"
                  className="position-absolute bottom-0 end-0"
                  style={{ width: "18px" }}
                />
              )}
            </div>
            <div className="ms-2">{row.original.name}</div>
          </div>
        ),
      },
      {
        Header: "Position",
        accessor: "position",
      },
      {
        Header: "Project",
        accessor: "project",
        Filter: SelectColumnFilter, // new
        filter: "includes", // new
      },
      {
        Header: "Action",
        accessor: "status",
        Cell: ({ row }) => (
          <div>
            {role === "Business" ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <a
                  className="btn btn-info text-white"
                  href={row.original.cvFile} // Directly use the cvFile URL here
                  target="_blank" // Ensure it opens in a new tab
                  rel="noopener noreferrer" // Improve security for opening new tabs
                >
                  {" "}
                  View CV
                </a>
                <AcceptConfirm id={row.original.id} reset={reset} role={role} />
                <RejectConfirm id={row.original.id} reset={reset} role={role} />
              </div>
            ) : (
              <CancelItem id={row.original.id} reset={reset} role={role} />
            )}
          </div>
        ),
      },
    ],
    []
  );
  const reset = (value) => {
    if (value === "Success") {
      setResetPage(!resetPage);
    }
  };
  const itemClick = () => {
    onSidebarClick();
  };
  const [applications, setApplications] = useState([]);
  useEffect(() => {
    if (role === "Business") {
      projectInstance
        .get(`GetAllProjectApplications/${currentUserId}`)
        .then((res) => {
          const data = res?.data?.result;
          console.log(data);
          if (Array.isArray(data) && data.length > 0) {
            setApplications(
              data.map((item) =>
                createData(
                  item.idProjectMember,
                  item.fullName,
                  item.email,
                  item.namePosition,
                  item.nameProject,
                  item.avatar,
                  item.cvUrlFile,
                  item.isVerified
                )
              )
            );
          } else {
            setApplications([]); // Set to an empty array if the API returns no data
          }
        })
        .catch((error) => {
          console.error(error);
          setApplications([]); // Set to an empty array if there's an error
        });
    } else {
      projectInstance
        .get(`GetAllSendApplications/${currentUserId}`)
        .then((res) => {
          const data = res?.data?.result;
          if (Array.isArray(data) && data.length > 0) {
            setApplications(
              data.map((item) =>
                createData(
                  item.idProjectMember,
                  item.fullName,
                  item.email,
                  item.namePosition,
                  item.nameProject,
                  item.avatar,
                  item.cvUrlFile,
                  item.isVerified
                )
              )
            );
          } else {
            setApplications([]); // Set to an empty array if the API returns no data
          }
        })
        .catch((error) => {
          console.error(error);
          setApplications([]); // Set to an empty array if there's an error
        });
    }
  }, [resetPage, currentUserId, role]);
  return (
    <Row className="pt-3 ms-0 me-0">
      <Col md={3}>
        <SideBar itemClick={itemClick} />
      </Col>
      <Col md={9}>
        <div
          id="projectApplication"
          className="bg-custom text-dark border-8 py-2"
        >
          <main className="container ">
            <div className="">
              <Table columns={columns} data={applications} />
            </div>
          </main>
        </div>
      </Col>
    </Row>
  );
}

export default ProjectApplication;
