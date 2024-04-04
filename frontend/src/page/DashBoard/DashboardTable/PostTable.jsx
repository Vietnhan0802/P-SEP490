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
import { IoSearchOutline } from "react-icons/io5";
import "../DashboardTable/table.scss";
import { GoDotFill } from "react-icons/go";
import { postInstance } from "../../../axios/axiosConfig";
import { useNavigate } from "react-router-dom";

function createData(id, avatar, fullName, title, content, date, report, isBlock, idAccount) {
  const time = formatDate(date);
  return {
    id, avatar, fullName, title, content, time, report, isBlock, idAccount
  };
}

const formatDate = (timestamp) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
const { currentUserId } = sessionData;

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
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Post",
  },
  {
    id: "Status",
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

export default function PostTable({ value, resetTable }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [postRows, setUserRows] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();
  React.useEffect(() => {
    // id, name, email, date, title, description, report, status
    const fetchedPostRows = value.map(element => (
      createData(
        element.idPost,
        element.avatar,
        element.fullName,
        element.title,
        element.content,
        element.createdDate,
        element.report,
        element.isBlock,
        element.idAccount
      )
    )
    );
    setUserRows(fetchedPostRows);
  }, [value]);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = postRows.map((n) => n.id);
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
    return rows.filter(
      (row) =>
        (row.fullName && row.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.title && row.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.content && row.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.time && row.time.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.report && row.report.toString().includes(searchTerm))
    );
  };
  const visibleRows = React.useMemo(
    () =>
      stableSort(
        filterRows(postRows, searchTerm),
        getComparator(order, orderBy)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, postRows, searchTerm]
  );
  const handleNavigateUser = (idAccount) => {
    navigate('/profile', { state: { userId: idAccount } });
  }
  const handleViewPost = (idPost) => {
    navigate('/postdetail', { state: { idPost: idPost } });
  }
  const handleBlockPost = (idPost) => {
    postInstance.put(`BlockPost/${idPost}`)
      .then((res) => {
        resetTable();
      })
      .catch((error) => {
        console.error(error);
      })
  }
  return (
    <Box
      id="postTable"
      sx={{ width: "100%", paddingLeft: "0px", marginTop: "16px" }}
    >
      <Paper className="form-table" sx={{ width: "100%", mb: 2 }} style={{ paddingTop: "10px" }}>
        <div className="ms-2 search-box">
          <IoSearchOutline className="search-icon me-1 fs-4" />
          <input
            type="text"
            name="" className="search"
            value={searchTerm}
            onChange={handleSearch}
            id="" />
        </div>
        <div className="line"></div>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" className="form-table" >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={postRows.length}
            />
            <TableBody>
              {value && value.length > 0 ? (

                visibleRows.map((row, index) => {
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
                        onClick={() => handleNavigateUser(row.idAccount)}
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
                          </div>
                        </div>
                      </TableCell>
                      <TableCell align="left" >
                        {row.time}
                      </TableCell>
                      <TableCell align="left" onClick={() => handleViewPost(row.id)}>
                        <p style={{ fontSize: "16px", fontWeight: "500" }}>
                          {row.title}
                        </p>
                        <div className="ellipsis" style={{ maxWidth: '300px', maxHeight: '30px', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: row.content }} />
                      </TableCell>
                      <TableCell align="right" onClick={() => handleBlockPost(row.id)}>
                        <div className="d-flex align-items-center justify-content-end">
                          <div style={{ width: "80px" }}>
                            <div
                              className={`d-flex align-items-center block-box ${row.isBlock ? "active-block" : "blur"
                                }`} style={{ width: "80px" }}
                            >
                              <GoDotFill className={`me-1 dot ${row.isBlock ? "active-dot" : "blur-dot"
                                }`} />
                              <p>
                                {row.isBlock ? 'Unblock' : 'Block'}
                              </p>
                            </div>
                          </div>
                        </div>

                      </TableCell>
                    </TableRow>
                  );
                })

              ) : (<TableRow>
                <TableCell colSpan={headCells.length} align="center" style={{ padding: "16px" }}>
                  No data found
                </TableCell>
              </TableRow>)}

            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={postRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
