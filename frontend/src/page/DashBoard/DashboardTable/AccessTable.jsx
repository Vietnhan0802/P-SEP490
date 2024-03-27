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
import defaultAvatar from "../../../images/common/default.png";
import { IoSearchOutline } from "react-icons/io5";
import "../DashboardTable/table.scss";
import { GoDotFill } from "react-icons/go";
import { userInstance } from "../../../axios/axiosConfig";
import { useNavigate } from "react-router-dom";

function createData(id, avatar, name, email, type, description, isBlock,idAccount) {
  return {
    id,
    avatar,
    name,
    email,
    type,
    description,
    isBlock,
    idAccount
  };
}

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
    id: "user",
    numeric: false,
    disablePadding: true,
    label: "User",
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "Type",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "",
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
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function AccessTable({ value, resetAccount }) {
  const navigate = useNavigate();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [searchTerm, setSearchTerm] = React.useState('');
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const filterRows = (rows, searchTerm) => {
    return rows?.filter(
      (row) =>
        (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.type && row.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.description && row.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBlock = id => {
    userInstance.put(`BlockUser/${id}`)
      .then((res) => {
        resetAccount();
      })
      .catch((err) => { console.error(err.data) })
  }
  // Avoid a layout jump when reaching the last page with empty rows.
  const [userRows, setUserRows] = React.useState([]);
  React.useEffect(() => {
    console.log(value)
    const fetchedUserRows = value?.map(element => (
      createData(
        element.id,
        element.imageSrc,
        element.fullName,
        element.email,
        element.role,
        element.description,
        element.isBlock,
        element.id
      )
    ));
    setUserRows(fetchedUserRows);
console.log(userRows)
  }, [value]);
  const handleNavigateUser = (idAccount) => {
    navigate('/profile', { state: { userId: idAccount } });
  }
  const visibleRows = React.useMemo(
    () =>
      stableSort(
        filterRows(userRows, searchTerm),
        getComparator(order, orderBy)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, userRows, searchTerm]
  );

  return (
    <Box
      id="accessTable"
      sx={{ width: "100%", paddingLeft: "0px", marginTop: "16px" }}
    >
      <Paper sx={{ width: "100%", mb: 2 }} style={{ paddingTop: "10px" }} className="form-table">
        <div className="ms-2 search-box">
          <IoSearchOutline
            className="search-icon me-1 fs-4"
          />
          <input type="text" name="" className="search" value={searchTerm}
            onChange={handleSearch} id="" />
        </div>
        <div className="line"></div>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={userRows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
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
                      onClick={()=>handleNavigateUser(row.idAccount)}
                    >
                      <div className="ms-2 my-2 d-flex align-items-center">
                        <img
                          className="me-2"
                          src={row.avatar === "https://localhost:7006/Images/" ? defaultAvatar : row.avatar}
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
                    <TableCell align="left">
                      <p
                        className={`${row.type === "Business" ? "business" : "user"
                          }`}
                      >
                        {row.type}
                      </p>
                    </TableCell>
                    <TableCell align="left">
                      <p>{row.description === null ? "No Description" : row.description}</p>
                    </TableCell>
                    <TableCell align="right">
                      <div className="d-flex align-items-center justify-content-end">
                        <div onClick={() => handleBlock(row.id)} style={{ width: '80px' }}>
                          <div
                            style={{
                              width: "80px",
                              textAlign: "center",
                              padding: "1",
                            }}
                            className={`block-box d-flex align-items-center ${row.isBlock ? "active-block" : "blur"
                              }`}
                          >
                            <GoDotFill className={` ${row.isBlock ? "active-dot" : "blur-dot"
                              }`} />
                            <p>  {row.isBlock ? "Unblock" : "Block"}</p>

                          </div>
                        </div>
                      </div>

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
          count={userRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
