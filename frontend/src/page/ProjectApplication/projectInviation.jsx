import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import SideBar from '../../components/sidebar'
import Table, { SelectColumnFilter } from './table'
import { use } from 'i18next';
import AcceptConfirm from './acceptConfirm';
import RejectConfirm from './rejectConfirm';
import { projectInstance } from '../../axios/axiosConfig';
import CancelItem from './CancelItem';
import tick from "../../images/common/verifiedTick.png";

const createData = (
    id,
    name,
    email,
    position,
    project,
    imgUrl,
    cvFile,
    isVerified) => {
    return {
        id,
        name,
        email,
        position,
        project,
        imgUrl,
        cvFile,
        isVerified
    }
};

function ProjectInviation() {
    const sessionData = JSON.parse(sessionStorage.getItem('userSession')) || {};
    const { currentUserId, role } = sessionData;
    const [resetPage, setResetPage] = useState(true);
    const columns = React.useMemo(
        () => [
            {
                Header: "Name",
                accessor: "name",
                Cell: ({ row }) => (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>

                            <div className="position-relative">
                                <img src={row.original.imgUrl} alt="profile" className="avatar-contain" />
                                {row.original.isVerified && <img src={tick} alt="tick" className="position-absolute bottom-0 end-0" style={{ width: '18px' }} />}
                            </div>
                            <div className="ms-2">
                                {row.original.name}
                            </div>
                        </div>
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
                    <div >
                        {role === 'Business' ?

                            <CancelItem id={row.original.id} reset={reset} role={role} />
                            :
                            <div className='d-flex'>
                                <AcceptConfirm id={row.original.id} reset={reset} role={role} />
                                <RejectConfirm id={row.original.id} reset={reset} role={role} />
                            </div>}
                    </div>
                ),
            },
        ],
        []
    );
    const reset = (value) => {
        if (value === 'Success') {
            setResetPage(!resetPage);
        }
    }
    const [invitation, setInvivtation] = useState([]);
    useEffect(() => {
        if (role === 'Business') {
            projectInstance.get(`GetAllSendInvites/${currentUserId}`)
                .then((res) => {
                    const data = res?.data?.result;
                    if (Array.isArray(data) && data.length > 0) {
                        setInvivtation(data.map((item) => createData(item.idProjectMember, item.fullName, item.email, item.namePosition, item.nameProject, item.avatar, item.cvUrlFile, item.isVerified)));
                    } else {
                        setInvivtation([]); // Set to an empty array if the API returns no data
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setInvivtation([]); // Set to an empty array if there's an error
                });
        } else {
            projectInstance.get(`GetAllProjectInvites/${currentUserId}`)
                .then((res) => {
                    const data = res?.data?.result;
                    if (Array.isArray(data) && data.length > 0) {
                        setInvivtation(data.map((item) => createData(item.idProjectMember, item.fullName, item.email, item.namePosition, item.nameProject, item.avatar, item.cvUrlFile, item.isVerified)));
                    } else {
                        setInvivtation([]); // Set to an empty array if the API returns no data
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setInvivtation([]); // Set to an empty array if there's an error
                });
        }
    }, [resetPage, currentUserId, role]);
    return (
        <Row className="pt-3 ms-0 me-0">
            <Col md={3} >
                <SideBar />
            </Col>
            <Col md={9}>
                <div
                    id="projectApplication"
                    className=" bg-light text-dark border-8 py-2"
                >

                    <main className="container ">
                        <div className="">
                            <Table columns={columns} data={invitation} />
                        </div>
                    </main>
                </div>
            </Col>

        </Row>
    )
}

export default ProjectInviation
