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
import { useNavigate } from "react-router-dom";
function createData(id, avatar, name, fullName, description, date, process, visibility, idAccount) {
  const time = formatDate(date);
  return {
    id, avatar, name, fullName, description, time, process, visibility, idAccount
  }
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
    id: "project",
    numeric: false,
    disablePadding: false,
    label: "Project",
  },
  {
    id: "process",
    numeric: false,
    disablePadding: false,
    label: "Process",
  },
  {
    id: "visibility",
    numeric: false,
    disablePadding: false,
    label: "Visibility",
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
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function ProjectTable({ value }) {
  const navigate = useNavigate();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [projectRows, setProjectRows] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  React.useEffect(() => {
    const fetchedProjectRows = value.map(element => (
      createData(
        element.idProject,
        element.avatarUser,
        element.name,
        element.fullName,
        element.description,
        element.createdDate,
        element.process,
        element.visibility,
        element.idAccount
      )
    )
    );
    setProjectRows(fetchedProjectRows)
    console.log(fetchedProjectRows);
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
      const newSelected = projectRows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
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
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleView = (id, type) => {
    if (type === 'project') {
      navigate('/projectdetail', { state: { idProject: id } });
    }
    if (type === 'account') {
      navigate('/profile', { state: { userId: id } });
    }
  }
  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const filterRows = (rows, searchTerm) => {
    return rows.filter(
      (row) =>
        (row.fullName && row.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.title && row.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.description && row.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.time && row.time.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  const visibleRows = React.useMemo(
    () =>
      stableSort(
        filterRows(projectRows, searchTerm),
        getComparator(order, orderBy)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, projectRows, searchTerm]
  );

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
              rowCount={projectRows.length}
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
                      onClick={() => handleView(row.idAccount, 'account')}
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
                    <TableCell align="left">
                      {row.time}
                    </TableCell>
                    <TableCell align="left" onClick={() => handleView(row.id, 'project')}>
                      <p style={{ fontSize: "16px", fontWeight: "500" }}>
                        {row.name}
                      </p>
                      <div className="ellipsis" style={{ maxWidth: '300px' }} dangerouslySetInnerHTML={{ __html: row.description }} />
                    </TableCell>
                    <TableCell align="left">{projectStatus(row.process)}</TableCell>
                    <TableCell align="left">{projectVisibility(row.visibility)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={projectRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
