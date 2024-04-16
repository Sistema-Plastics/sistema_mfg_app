import * as Cookies from "../../assets/components/CookieFunctions.js";
import { SistemaContext } from "../../assets/components/SistemaHeader";
import * as poAPI from "../../helpers/data/POAPI";
import React, { useState, useEffect, useContext } from "react";
// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import {
  Backdrop,
  Box,
  CircularProgress,
  Collapse,
  CssBaseline,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Tooltip,
} from "@mui/material";
// import { makeStyles } from "@mui/material/styles";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";

const drawerWidth = 300;

// const useStyles = makeStyles((theme) => ({
//   root: {
//     "& > *": {
//       borderBottom: "unset",
//     },
//     "& .MuiTextField-root": {
//       margin: theme.spacing(1),
//       width: drawerWidth - 20,
//     },
//   },
//   appBar: {
//     transition: theme.transitions.create(["margin", "width"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//   },
//   appBarShift: {
//     width: `calc(100% - ${drawerWidth}px)`,
//     marginLeft: drawerWidth,
//     transition: theme.transitions.create(["margin", "width"], {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   },
//   container: {
//     maxHeight: 740,
//     marginTop: 0,
//   },
//   content: {
//     flexGrow: 3,
//     transition: theme.transitions.create("margin", {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//   },
//   contentShift: {
//     transition: theme.transitions.create("margin", {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     marginLeft: drawerWidth,
//   },
//   drawer: {
//     width: drawerWidth,
//     flexShrink: 0,
//   },
//   drawerPaper: {
//     width: drawerWidth,
//   },
//   drawerHeader: {
//     display: "flex",
//     alignItems: "center",
//     padding: theme.spacing(0, 1),
//     // necessary for content to be below app bar
//     ...theme.mixins.toolbar,
//     justifyContent: "flex-end",
//   },
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 150,
//   },
//   formField: {
//     "& > label": {
//       backgroundColor: theme.palette.background.paper,
//       border: theme.palette.background.paper,
//     },
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
//   hide: {
//     display: "none",
//   },
//   selectEmpty: {
//     marginTop: theme.spacing(2),
//   },
//   backdrop: {
//     zIndex: theme.zIndex.drawer + 1,
//     color: "#fff",
//   },
// }));

function PORow({ po }) {
  const history = useNavigate();
  // const classes = useStyles();
  const [openLines, setOpenLines] = React.useState(false);

  const handleOpenPOAction = () => {
    history.push({
      pathname: `/PendingPOs/${po.poNum}`,
      search: `?company=${po.company}`,
      state: {
        company: po.company,
        fromDashboard: true,
      },
    });
  };

  return (
    <React.Fragment>
      {/* <TableRow className={classes.root} hover key={po.poNum}> */}
      <TableRow  hover key={po.poNum}>
        <TableCell>
          <IconButton
            aria-label="show details"
            size="small"
            onClick={() => setOpenLines(!openLines)}
          >
            {openLines ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="po">
          {po.poNum}
        </TableCell>
        <TableCell>
          <Tooltip title="Open" arrow placement="right-end">
            <IconButton onClick={handleOpenPOAction}>
              <OpenInNewIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell>{po.vendorName}</TableCell>
        <TableCell>{po.buyerName}</TableCell>
        <TableCell align="right">{po.buyerLimit}</TableCell>
        <TableCell align="right">{po.totalCharges}</TableCell>
        <TableCell align="right">{po.appovedAmount}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 63 }}
          colSpan={8}
        >
          <Collapse in={openLines} timeout="auto" unmountOnExit>
            <Box marginTop={2} component={Paper} style={{ paddingLeft: 0 }}>
              <Paper elevation={7} style={{ padding: 15 }}>
                <Typography variant="h6" gutterBottom component="div">
                  PO Line Details
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Line</TableCell>
                      <TableCell>Part</TableCell>
                      <TableCell style={{ width: 400 }}>Description</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell>Phase</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell>UOM</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Ext Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {po.poLines.map((poDtl) => (
                      <TableRow key={poDtl.lineNum}>
                        <TableCell component="th" scope="po">
                          {poDtl.lineNum}
                        </TableCell>
                        <TableCell>{poDtl.partNum}</TableCell>
                        <TableCell>{poDtl.partDesc}</TableCell>
                        <TableCell>{poDtl.dueDate}</TableCell>
                        <TableCell>{poDtl.projectID}</TableCell>
                        <TableCell>{poDtl.phaseDesc}</TableCell>
                        <TableCell align="right">{poDtl.lineQty}</TableCell>
                        <TableCell>{poDtl.lineUOM}</TableCell>
                        <TableCell align="right">{poDtl.unitPrice}</TableCell>
                        <TableCell align="right">{poDtl.extCost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const POApprovalDashboard = () => {
  const sistemaContext = useContext(SistemaContext);

  // const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [company, setCompany] = useState("All");
  const [approver, setApprover] = useState("All");

  useEffect(() => {
    //==========================================================
    // Initialize data for Sistema Toolbar and Filtering options
    //==========================================================
    sistemaContext.setPageTitle("Pending POs");
    sistemaContext.setPageFilters([]);

    // Check if User is logged in. If not, display the login dialog box.
    sistemaContext.handleLoginStatus();
  }, []);

  const {
    isIdle,
    isFetching,
    isLoading,
    isFetched,
    isSuccess,
    isError,
    error,
    data,
    refetch,
  } = useQuery("poList", () => poAPI.getPOs(sistemaContext.userid), {
    enabled: sistemaContext.userid !== "",
  });

  useEffect(() => {
    console.log(
      "useEffect[] *",
      "userid:",
      sistemaContext.userid,
      "isIdle:",
      isIdle,
      "isFetching:",
      isFetching,
      "isLoading:",
      isLoading,
      "isFetched:",
      isFetched,
      "isSuccess:",
      isSuccess,
      "isError:",
      isError,
      "data:",
      data
    );
    if (sistemaContext.userid !== "") {
      refetch();
    }
  }, []);

  useEffect(() => {
    console.log(
      "useEffect[sistemaContext.userid] *",
      "userid:",
      sistemaContext.userid,
      "isIdle:",
      isIdle,
      "isFetching:",
      isFetching,
      "isLoading:",
      isLoading,
      "isFetched:",
      isFetched,
      "isSuccess:",
      isSuccess,
      "isError:",
      isError,
      "data:",
      data
    );
  }, [sistemaContext.userid]);

  useEffect(() => {
    console.log(
      "useEffect[data] *",
      "userid:",
      sistemaContext.userid,
      "isIdle:",
      isIdle,
      "isFetching:",
      isFetching,
      "isLoading:",
      isLoading,
      "isFetched:",
      isFetched,
      "isSuccess:",
      isSuccess,
      "isError:",
      isError,
      "data:",
      data
    );

    if (isSuccess) {
      //======================================================
      // Update data for Sistema Toolbar and Filtering options
      //======================================================
      sistemaContext.setPageFilters([
        {
          id: 0,
          label: "Company",
          filterValues: data.companyList.length > 0 ? data.companyList : [],
          currentValue: data.companyList.length > 0 ? "All" : "",
        },
        {
          id: 1,
          label: "Approver",
          filterValues: data.approverList.length > 0 ? data.approverList : [],
          currentValue: data.approverList.length > 0 ? "All" : "",
        },
      ]);
    }
  }, [data]);

  useEffect(() => {
    //=======================================================================
    // Re-filter our data based on updated Filter values from Sistema Toolbar
    //=======================================================================
    if (sistemaContext.pageFilters.length > 0) {
      if (sistemaContext.pageFilters[0].currentValue !== company) {
        setCompany(sistemaContext.pageFilters[0].currentValue);
      }
      if (sistemaContext.pageFilters[1].currentValue !== approver) {
        setApprover(sistemaContext.pageFilters[1].currentValue);
      }
    }
  }, [sistemaContext.pageFilters]);

  const filteredPOs = () => {
    return data.poList.filter(
      (po) =>
        (po.company === company || company === "All") &&
        (po.approverName === approver || approver === "All")
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (isIdle || sistemaContext.userid === "") {
    return (
      <Typography variant="h6" color="error" style={{ marginTop: 50 }}>
        Please login to view pending Purchase Orders
      </Typography>
    );
  }
  if (isLoading) {
    return (
      <Backdrop open={true}>
      {/* <Backdrop className={classes.backdrop} open={true}> */}
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  if (isError) {
    const epicorToken = Cookies.getCookie("epicorToken");
    const errorMessage =
      epicorToken == null && sistemaContext.userid !== ""
        ? "Your Epicor Session has expired. Please re-login."
        : `Error loading POs... [${error.message}]`;
    return (
      <Typography variant="h6" color="error" style={{ marginTop: 50 }}>
        {errorMessage}
      </Typography>
    );
  }

  return (
    <div>
    {/* <div className={classes.root}> */}
      <CssBaseline />
      <TableContainer
        // className={classes.container}
        component={Paper}
        elevation={2}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 60 }} />
              <TableCell style={{ width: 150 }}>PO Number</TableCell>
              <TableCell></TableCell>
              <TableCell style={{ width: 400 }}>Supplier</TableCell>
              <TableCell style={{ width: 300 }}>Buyer</TableCell>
              <TableCell align="right">Limit</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Approved Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPOs()
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((po) => (
                <PORow key={po.poNum} po={po} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredPOs().length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default POApprovalDashboard;
