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

function createData(id, name, email, date, project, follower, status) {
    return {
        id,
        name,
        email,
        date,
        project,
        follower,
        status,
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
        numeric: true,
        disablePadding: false,
        label: "Project",
    },
    {
        id: "Follower",
        numeric: true,
        disablePadding: false,
        label: "Follower",
    },
    {
        id: "Status",
        numeric: true,
        disablePadding: false,
        label: "Status",
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
                        style={{ paddingLeft: "10px" }}
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

export default function VerifyTable() {
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("calories");
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [order, orderBy, page, rowsPerPage]
    );

    return (
        <Box
            id="verifyTable"
            sx={{ width: "100%", paddingLeft: "0px", marginTop: "16px" }}
        >
            <Paper sx={{ width: "100%", mb: 2 }} style={{ paddingTop: "10px" }} className="form-table">
                <div className="ms-2 search-box">
                    <IoSearchOutline className="search-icon me-1 fs-4" />
                    <input type="text" name="" className="search" id="" />
                </div>
                <div className="line"></div>
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
                            {visibleRows.map((row, index) => {
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
                                        >
                                            <div className="ms-2 my-2 d-flex align-items-center">
                                                <img
                                                    className="me-2"
                                                    src={avatar}
                                                    alt=""
                                                    style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                                <div>
                                                    {row.name}
                                                    <br></br>
                                                    {row.email}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell align="left" className="blur">{row.date}</TableCell>
                                        <TableCell align="right">
                                            <p>{row.project}</p>
                                        </TableCell>
                                        <TableCell align="right" className="blur">{row.follower}</TableCell>
                                        <TableCell align="right">
                                            <div
                                                className="d-flex align-items-center justify-content-end"
                                            >
                                                <div className={`block-box ${row.status === 'accept' ? "active-block" : ""
                                                    }`}>
                                                    <GoDotFill className="me-1" />
                                                    {row.status}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell align="right">View</TableCell>
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
