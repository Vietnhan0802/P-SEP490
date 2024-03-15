import React from "react";
import "./projectApplication.scss";
import avatar from "../../images/common/Avatar.png";
import Table, { SelectColumnFilter } from "./table";
import AcceptConfirm from "./acceptConfirm";
import RejectConfirm from "./rejectConfirm";
import { Col, Row } from "react-bootstrap";
import SideBar from "../../components/sidebar";
import Follow from "../../components/follow";

const getData = () => {
  const data = [
    {
      name: "Jane Cooper",
      email: "jane.cooper@example.com",
      position: "Regional Paradigm Technician",
      department: "Optimization",
      status: "Active",
      project: "AdminAdminAdminAdminAdminAdminAdmin",
      imgUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    },
    {
      name: "Cody Fisher",
      email: "cody.fisher@example.com",
      position: "Product Directives Officer",
      department: "Intranet",
      status: "Active",
      project: "OwnerOwnerOwnerOwnerOwnerOwnerOwner",
      imgUrl:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    },
    {
      name: "Esther Howard",
      email: "esther.howard@example.com",
      position: "Forward Response Developer",
      department: "Directives",
      status: "Active",
      project: "MemberMemberMemberMemberMemberMemberMember",
      imgUrl:
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    },
    {
      name: "Jenny Wilson",
      email: "jenny.wilson@example.com",
      position: "Central Security Manager",
      department: "Program",
      status: "Active",
      project: "MemberMemberMemberMemberMemberMemberMember",
      imgUrl:
        "https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    },
    {
      name: "Kristin Watson",
      email: "kristin.watson@example.com",
      position: "Lean Implementation Liaison",
      department: "Mobility",
      status: "Active",
      project: "AdminAdminAdminAdminAdminAdminAdmin",
      imgUrl:
        "https://images.unsplash.com/photo-1532417344469-368f9ae6d187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    },
    {
      name: "Cameron Williamson",
      email: "cameron.williamson@example.com",
      position: "Internal Applications Engineer",
      department: "Security",
      status: "Active",
      project: "MemberMemberMemberMemberMemberMemberMember",
      imgUrl:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    },
  ];
  return [...data];
};

function ProjectApplication() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={row.original.imgUrl}
              alt="Avatar"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
            {row.original.name}
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <button className="btn btn-info text-white">View CV</button>
            <AcceptConfirm />
            <RejectConfirm />
          </div>
        ),
      },
    ],
    []
  );

  const data = React.useMemo(() => getData(), []);
  return (
    <Row className="pt-3 ms-0 me-0">
      <Col md={3} >
        <SideBar />
      </Col>
      <Col md={9}>
        <div
          id="projectApplication"
          className="min-vh-100 bg-light text-dark border-8 py-2"
        >
          <main className="container ">
            <div className="">
              <Table columns={columns} data={data} />
            </div>
          </main>
        </div>
      </Col>

    </Row>
  );
}

export default ProjectApplication;
