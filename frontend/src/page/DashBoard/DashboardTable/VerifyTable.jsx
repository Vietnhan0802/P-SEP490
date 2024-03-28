import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import avatar from "../../../images/common/Avatar.png";
import { IoSearchOutline } from "react-icons/io5";
import "../DashboardTable/table.scss";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { reportInstance } from "../../../axios/axiosConfig";
import { color } from "@mui/system";
const formatDate = (timestamp) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}
function createData(id, idAccount, email, fullName, avatar, project, follow, date) {
    return {
        id, idAccount, email, fullName, avatar, project, follow, date
    };
}

const rows = [
    createData(
        1,
        "Olivia Rhye",
        "example@gmail,com",
        "21 Jan 2024",
        "10",
        "100",
        "Accept"
    ),
    createData(
        2,
        "Adison Schleifer",
        "example@gmail,com",

        "21 Jan 2024",
        "12",
        "200",
        "Waiting"
    ),
    createData(
        3,
        "Martin George",
        "example@gmail,com",
        "21 Jan 2024",
        "3",
        "20",
        "Deny"
    ),
    createData(
        4,
        "Zaire Herwitz",
        "example@gmail,com",
        "21 Jan 2024",
        "6",
        "50",
        "Waiting"
    ),
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "User",
    },
    {
        id: "date",
        numeric: false,
        disablePadding: false,
        label: "Date",
    },
    {
        id: "Project",
        numeric: false,
        disablePadding: false,
        label: "Project",
    },
    {
        id: "Follower",
        numeric: false,
        disablePadding: false,
        label: "Follower",
    },
    {
        id: "action",
        numeric: true,
        disablePadding: false,
        label: "Action",
    },
];

function EnhancedTableHead(props) {
    const {
        order,
        orderBy,
        onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                        style={{ paddingLeft: "16px" }}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default function VerifyTable({ value, verified, resetVerify }) {
    const navigate = useNavigate();
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("calories");
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [verifyRow, setVerifyRow] = React.useState([]);
    const [verifiedRow, setVerifiedRow] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    React.useEffect(() => {
        if (Array.isArray(value) && value.length > 0) {
            const data = value?.map((element) =>
                createData(
                    element.idVerification,
                    element.idAccount,
                    element.email,
                    element.fullName,
                    element.avatar,
                    element.project,
                    element.follower,
                    formatDate(element.createdDate)
                )
            )
            setVerifyRow(data);
        }
    }, [value])
    React.useEffect(() => {
        if (Array.isArray(verified) && verified.length > 0) {
            const data = verified?.map((element) =>
                createData(
                    element.idVerification,
                    element.idAccount,
                    element.email,
                    element.fullName,
                    element.avatar,
                    element.project,
                    element.follower,
                    formatDate(element.createdDate)
                )
            )
            setVerifiedRow(data);
        }
    }, [verified])
    const navigateUser = (id) => {
        navigate('/profile', { state: { userId: id } })
    }
    const handleVerify = (id, status) => {
        reportInstance.put(`AcceptVerification/${id}/${status}`)
            .then((res) => {
                console.log(res?.data?.result);
                resetVerify();
            })
            .catch((error) => {
                console.error(error);
            })
    }
    const handleCancel = (id) => {
        reportInstance.delete(`RemoveVerification/${id}`)
            .then((res) => { console.log(res?.data?.result) })
            .catch((error) => { console.error(error) });
    }
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const filterRows = (rows, searchTerm) => {
        if (!searchTerm) {
            return rows;
        }

        const lowercaseSearchTerm = searchTerm.toLowerCase();

        return rows.filter(
            (row) =>
                row.fullName.toLowerCase().includes(lowercaseSearchTerm) ||
                row.email.toLowerCase().includes(lowercaseSearchTerm)
        );
    };
    const filteredVerifyRows = filterRows(verifyRow, searchTerm);
    const filteredVerifiedRows = filterRows(verifiedRow, searchTerm);
    const visibleRows = React.useMemo(
        () =>
            stableSort(filteredVerifyRows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [order, orderBy, page, rowsPerPage, filteredVerifyRows]
    );

    const verifiedRows = React.useMemo(
        () =>
            stableSort(filteredVerifiedRows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [order, orderBy, page, rowsPerPage, filteredVerifiedRows]
    );

    const [activeTab, setActiveTab] = React.useState("unverify");
    const handledActive = (report) => {
        setActiveTab(report);
    };
    return (
        <Box
            id="verifyTable"
            sx={{ width: "100%", paddingLeft: "0px", marginTop: "16px" }}
        >
            <Paper sx={{ width: "100%", mb: 2 }} style={{ paddingTop: "10px" }} className="form-table">
                <div className="d-flex w-50">
                    <div className="ms-2 search-box d-flex align-items-center w-100">
                        <IoSearchOutline className="search-icon me-1 fs-4" />
                        <input
                            type="text"
                            name=""
                            className="search"
                            id=""
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div onClick={() => handledActive("unverify")}>
                            <p
                                className={`report-post ${activeTab === "unverify" ? "active-report" : ""
                                    }`}
                            >
                                Verify List
                            </p>
                        </div>
                        <div onClick={() => handledActive("verified")}>
                            <p
                                className={`report-account ${activeTab === "verified" ? "active-report" : ""
                                    }`}
                            >
                                Verifed List
                            </p>
                        </div>
                    </div>
                </div>

                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {(activeTab === 'unverify' ? visibleRows : verifiedRows).map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        sx={{ cursor: "pointer" }}
                                        className="my-2"
                                    >
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                            onClick={() => navigateUser(row.idAccount)}
                                        >
                                            <div className="ms-2 my-2 d-flex align-items-center">
                                                <img
                                                    className="me-2"
                                                    src={row.avatar}
                                                    alt=""
                                                    style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                                <div>
                                                    {row.fullName}
                                                    <br></br>
                                                    {row.email}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell align="left" className="blur">{row.date}</TableCell>
                                        <TableCell align="left">
                                            <p>{row.project}</p>
                                        </TableCell>
                                        <TableCell align="left" className="blur">{row.follow}</TableCell>
                                        <TableCell align="right">
                                            {activeTab === 'unverfy' ? <div
                                                className="d-flex align-items-center justify-content-end"
                                            >
                                                <div className={`block-box accept `} onClick={() => handleVerify(row.id, 1)}>
                                                    <GoDotFill className="me-1 accept-dot" />
                                                    Accept
                                                </div>
                                                <div className={`block-box ms-2 deny`} onClick={() => handleVerify(row.id, 2)}>
                                                    <GoDotFill className="me-1 deny-dot" />
                                                    Deny
                                                </div>
                                            </div> : <div
                                                className="d-flex align-items-center justify-content-end"
                                            >
                                                <div className={`block-box ms-2 delete`} onClick={() => handleCancel(row.id)}>
                                                    <GoDotFill className="me-1 delete-dot" />
                                                    Cancel
                                                </div>
                                            </div>}

                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
