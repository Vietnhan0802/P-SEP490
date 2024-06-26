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
import { reportInstance } from "../../../axios/axiosConfig";
import { notifySuccess } from "../../../components/notification";
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
function createPostData(id, avatar, name, email, date, title, content, description, idPosted, idAccount) {
  return {
    id,
    avatar,
    name,
    email,
    date,
    title,
    content,
    description,
    idPosted
    , idAccount
  };
}
function createBlogData(id, avatar, name, email, date, title, content, description, idBloged, idAccount) {
  return {
    id, avatar, name, email, date, title, content, description, idBloged, idAccount
  };
}
const createAccountData = (id, avatar, name, email, createdDate, description, idReported) => {
  return {
    id, avatar, name, email, createdDate, description, idReported
  };
};

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
    for: "all",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
    for: "reportPost",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
    for: "reportBlog",
  },
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Post",
    for: "reportPost",
  },
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Blog",
    for: "reportBlog",
  },

  {
    id: "Date",
    numeric: false,
    disablePadding: false,
    label: "Type",
    for: "reportAccount",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
    for: "reportAccount",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
    for: "reportPost",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
    for: "reportBlog",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "",
    for: "all",
  },
];

function EnhancedTableHead(props) {
  const {
    order,
    orderBy,
    onRequestSort,
    activeReport,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells
          .filter(
            (headCell) =>
              headCell.for === activeReport || headCell.for === "all"
          )
          .map((headCell) => (
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
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
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

export default function ReportTable({ accountValue, postValue, blogValue, resetReport }) {

  function renderPostTable() {
    return (
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
                    {row.name}
                    <br></br>
                    {row.email}
                  </div>
                </div>
              </TableCell>
              <TableCell align="left" className="blur">
                {row.date}
              </TableCell>
              <TableCell align="left" onClick={() => handleView(row.idPosted, 'post')}>
                <p >
                  {row.title}
                </p>
                {/* <p className="blur">{row.content}</p> */}
              </TableCell>
              <TableCell align="left">
                <p>
                  {row.description}
                </p>
              </TableCell>
              <TableCell align="right">
                <div className="d-flex align-items-center justify-content-end">
                  <div className="d-flex justify-content-center">
                    <div className="block-box deny" onClick={() => handleAcceptorDeny(row.id, 2, 'post')}>
                      <GoDotFill className="me-1  deny-dot" />
                      Deny
                    </div>
                    <div className="block-box accept  ms-2" onClick={() => handleAcceptorDeny(row.id, 1, 'post')}>
                      <GoDotFill className="me-1 accept-dot" />
                      Accept
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  }

  function renderAccountTable() {
    return (
      <TableBody>
        {visibleAccountRows.map((row, index) => {
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
                onClick={() => handleView(row.idReported, 'account')}
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
                    {row.name}
                    <br></br>
                    {row.email}
                  </div>
                </div>
              </TableCell>
              <TableCell align="left" className="blur">
                <p>{row.createdDate}</p>
              </TableCell>
              <TableCell align="left">
                <p className="blur">{row.description}</p>
              </TableCell>
              <TableCell align="right">
                <div className="d-flex align-items-center justify-content-end">
                  <div className="d-flex justify-content-center">
                    <div className=" block-box deny" onClick={() => handleAcceptorDeny(row.id, 2, 'account')}>
                      <GoDotFill className="me-1 deny-dot" />
                      Deny
                    </div>
                    <div className=" block-box accept ms-2" onClick={() => handleAcceptorDeny(row.id, 1, 'account')}>
                      <GoDotFill className="me-1 accept-dot" />
                      Accept
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  }

  function renderBlogTable() {
    return (
      <TableBody>
        {visibleBlogRows.map((row, index) => {
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
                    {row.name}
                    <br></br>
                    {row.email}
                  </div>
                </div>
              </TableCell>
              <TableCell align="left" className="blur">
                {row.date}
              </TableCell>
              <TableCell align="left" onClick={() => handleView(row.idBloged, 'blog')}>
                <p>
                  {row.title}
                </p>
                {/* <p className="blur">{row.content}</p> */}
              </TableCell>
              <TableCell align="left">
                <p>
                  {row.description}
                </p>
              </TableCell>
              <TableCell align="right">
                <div className="d-flex align-items-center justify-content-end">
                  <div className="d-flex justify-content-center">
                    <div className=" block-box deny" onClick={() => handleAcceptorDeny(row.id, 2, 'blog')}>
                      <GoDotFill className="me-1 deny-dot" />
                      Deny
                    </div>
                    <div className="block-box accept ms-2 " onClick={() => handleAcceptorDeny(row.id, 1, 'blog')}>
                      <GoDotFill className="me-1 accept-dot" />
                      Accept
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  }
  const navigate = useNavigate();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [accountRow, setAccountRow] = React.useState([]);
  const [postRow, setPostRow] = React.useState([]);
  const [blogRow, setBlogRow] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  React.useEffect(() => {
    if (accountValue) {
      const fetchedAccountRows = accountValue?.map(element => (
        createAccountData(
          element.idAccountReport,
          element.avatarReported,
          element.nameReported,
          element.emailReported,
          formatDate(element.createdDate),
          element.content,
          element.idReported,

        )
      )
      );
      setAccountRow(fetchedAccountRows);
    }
    if (postValue) {
      const fetchedPostRows = postValue?.map(element => (
        createPostData(
          element.idPostReport,
          element.avatarReporter,
          element.nameReporter,
          element.emailReporter,
          formatDate(element.createdDate),
          element.titlePost,
          element.contentPost,
          element.content,
          element.idPosted,
          element.accountPosted
        )
      )
      );
      setPostRow(fetchedPostRows);
    }
    if (blogValue) {
      const fetchedBlogRows = blogValue?.map(element => (
        createBlogData(
          element.idBlogReport,
          element.avatarReporter,
          element.nameReporter,
          element.emailReporter,
          formatDate(element.createdDate),
          element.titleBlog,
          element.contentBlog,
          element.content,
          element.idBloged,
          element.accountBloged
        )
      )
      );
      setBlogRow(fetchedBlogRows);
    }
  }, [accountValue, postValue, blogValue]);
  const handleView = (id, type) => {
    if (type === 'post') {
      navigate('/postdetail', { state: { idPost: id } })
    }
    if (type === 'blog') {
      navigate('/blogdetail', { state: { idBlog: id } })
    }
    if (type === 'account') {
      navigate('/profile', { state: { userId: id } });
    }
  }
  const handleAcceptorDeny = (id, status, type) => {
    if (type === 'post') {
      reportInstance.put(`AcceptPostReport/${id}/${status}`)
        .then((res) => { console.log(res?.data?.result); resetReport(); notifySuccess(res?.data?.message);})
        .catch((error) => { console.error(error); })
    }
    if (type === 'blog') {
      reportInstance.put(`AcceptBlogReport/${id}/${status}`)
        .then((res) => { console.log(res?.data?.result); resetReport(); notifySuccess(res?.data?.message); })
        .catch((error) => { console.error(error); })
    }
    if (type === 'account') {
      reportInstance.put(`AcceptAccountReport/${id}/${status}`)
        .then((res) => { console.log(res?.data?.result); resetReport(); notifySuccess(res?.data?.message); })
        .catch((error) => { console.error(error); })
    }
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const filterRows = (rows, searchTerm) => {
    if (!searchTerm) return rows; // Return the original array if no search term

    return rows.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };
  const visibleRows = React.useMemo(
    () =>
      stableSort(filterRows(postRow, searchTerm), getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, postRow, searchTerm]
  );

  const visibleAccountRows = React.useMemo(
    () =>
      stableSort(filterRows(accountRow, searchTerm), getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, accountRow, searchTerm]
  );

  const visibleBlogRows = React.useMemo(
    () =>
      stableSort(filterRows(blogRow, searchTerm), getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, blogRow, searchTerm]
  );


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const [activeReport, setActiveReport] = React.useState("reportPost");
  const handledActiveReport = (report) => {
    setActiveReport(report);
  };
  return (
    <Box
      id="reportTable"
      sx={{ width: "100%", paddingLeft: "0px", marginTop: "16px" }}
    >
      <Paper sx={{ width: "100%", mb: 2 }} style={{ paddingTop: "10px" }} className="form-table">
        <div className="d-flex ">
          <div className="ms-2 search-box">
            <IoSearchOutline className="search-icon me-1 fs-4" />
            <input type="text" name="" className="search" id="" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div onClick={() => handledActiveReport("reportPost")}>
              <p
                className={`report-post ${activeReport === "reportPost" ? "active-report" : ""
                  }`}
              >
                Report Post
              </p>
            </div>
            <div onClick={() => handledActiveReport("reportAccount")}>
              <p
                className={`report-account ${activeReport === "reportAccount" ? "active-report" : ""
                  }`}
              >
                Report Account
              </p>
            </div>
            <div onClick={() => handledActiveReport("reportBlog")}>
              <p
                className={`report-blog ${activeReport === "reportBlog" ? "active-report" : ""
                  }`}
              >
                Report Blog
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
              onRequestSort={handleRequestSort}
              rowCount={accountRow.length || blogRow.length || postRow.length}
              activeReport={activeReport}
            />
            {activeReport === "reportPost"
              ? renderPostTable()
              : activeReport === "reportAccount"
                ? renderAccountTable()
                : renderBlogTable()}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={accountRow.length || blogRow.length || postRow.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
