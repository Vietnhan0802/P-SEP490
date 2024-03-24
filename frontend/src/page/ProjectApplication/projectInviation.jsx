import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import SideBar from '../../components/sidebar'
import Table, { SelectColumnFilter } from './table'
import { use } from 'i18next';
import AcceptConfirm from './acceptConfirm';
import RejectConfirm from './rejectConfirm';
import { projectInstance } from '../../axios/axiosConfig';
import CancelItem from './CancelItem';

const createData = (
    id,
    name,
    email,
    position,
    project,
    imgUrl,
    cvFile) => {
    return {
        id,
        name,
        email,
        position,
        project,
        imgUrl,
        cvFile
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
                    <div >
                        <CancelItem id={row.original.id} reset={reset} />
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
                    console.log(data)
                    setInvivtation(data.map((item) => createData(item.idProjectMember, item.fullName, item.email, item.namePosition, item.nameProject, item.avatar, item.cvUrlFile)));
                })
                .catch((error) => { console.error(error) });
        } else {
            projectInstance.get(`GetAllProjectInvites/${currentUserId}`)
                .then((res) => {
                    const data = res?.data?.result;
                    console.log(data)
                    setInvivtation(data.map((item) => createData(item.idProjectMember, item.fullName, item.email, item.namePosition, item.nameProject, item.avatar, item.cvUrlFile)));
                })
                .catch((error) => { console.error(error) });
        }

    }, [resetPage]);
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
