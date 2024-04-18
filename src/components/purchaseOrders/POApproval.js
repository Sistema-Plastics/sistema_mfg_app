import * as Cookies from "../../assets/components/CookieFunctions.js";
import { SistemaContext } from "../../assets/components/SistemaHeader";
import * as poAPI from "../../helpers/data/POAPI";
import ConfirmationDialog from "./ConfirmationDialog";
import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import {
  Backdrop,
  Box,
  CircularProgress,
  Fab,
  Grid,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
} from "@mui/icons-material";
import { grey, green, red } from "@mui/material/colors";

import { muiThemes } from "../../assets/styling/muiThemes";
const sistTheme = muiThemes.getSistemaTheme();

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//     "& > *": {
//       borderBottom: "unset",
//     },
//   },
//   formField: {
//     "& > label": {
//       backgroundColor: theme.palette.background.paper,
//       border: theme.palette.background.paper,
//     },
//   },
//   extendedIcon: {
//     marginRight: theme.spacing(1),
//   },
//   fabApprove: {
//     margin: theme.spacing(1),
//     color: "#ffffff",
//     backgroundColor: green[600],
//   },
//   fabReject: {
//     margin: theme.spacing(1),
//     color: "#ffffff",
//     backgroundColor: red[600],
//   },
//   table: {
//     minWidth: 650,
//   },
//   toolbarTitle: {
//     flexGrow: 1,
//   },
//   button: {
//     margin: theme.spacing(1),
//     color: grey[50],
//   },
//   backdrop: {
//     zIndex: theme.zIndex.drawer + 1,
//     color: "#fff",
//   },
// }));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const DataField = ({
  fieldLabel,
  fieldValue,
  isAmount,
  extraWidth = false,
}) => {
  // const classes = useStyles();
  const mdFactor = extraWidth ? 2 : 1;
  const lgFactor = extraWidth ? 3 : 1;
  const xlFactor = extraWidth ? 3 : 1;

  if (isAmount === true) {
    return (
      <Grid item xs={6}>
        <TextField
          // className={classes.formField}
          variant="outlined"
          label={fieldLabel}
          value={fieldValue}
          fullWidth
          InputLabelProps={{ shrink: true }}
         sx={{margin:0.5}}
        />
      </Grid>
    );
  } else {
    return (
      <Grid item xs={12} md={6 * mdFactor} lg={4 * lgFactor} xl={3 * xlFactor}>
        <TextField
          // className={classes.formField}
          sx={{
            "& > label": {
              backgroundColor: sistTheme.palette.background.paper,
              border: sistTheme.palette.background.paper,
            },
            margin:0.5
          }}
          variant="outlined"
          label={fieldLabel}
          value={fieldValue}
          fullWidth
          multiline={extraWidth}
          InputLabelProps={{ shrink: true }}
          
        />
      </Grid>
    );
  }
};

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const POApproval = () => {
  const sistemaContext = useContext(SistemaContext);

  // const classes = useStyles();
  const { poNum } = useParams();
  const search = useLocation().search;
  const state = useLocation().state;
  const company = new URLSearchParams(search).get("company");
  const fromDashboard = new URLSearchParams(state).get("fromDashboard");
  const navigateHistory = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [showLoginSnackbar, setShowLoginSnackbar] = useState(false);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    //==========================================================
    // Initialize data for Sistema Toolbar and Filtering options
    //==========================================================
    sistemaContext.setPageTitle("");
    sistemaContext.setPageFilters([]);

    // Check if User is logged in. If not, display the login dialog box.
    sistemaContext.handleLoginStatus();

    console.log("useEffect[] *", "userid:", sistemaContext.userid);
  }, []);

  useEffect(() => {
    if (sistemaContext.userid !== "") {
      const epicorToken = Cookies.getCookie("epicorToken");
      if (epicorToken != null) {
        setShowLoginSnackbar(false);
      }
    }
  }, [sistemaContext.userid]);

  const {
    isIdle: isIdlePO,
    isLoading: isLoadingPO,
    isError: isErrorPO,
    error: errorPO,
    data: po,
  } = useQuery(["po", poNum], () => poAPI.getPO(poNum), {
    enabled: sistemaContext.userid !== "",
    refetchOnWindowFocus: false,
    retry: 1,
    onSuccess: (po) => {
      sistemaContext.setPageTitle(`PO: ${poNum}  (${po.country})`);
    },
  });

  const {
    isLoading: isLoadingApvMsg,
    isSuccess: isSuccessApvMsg,
    isError: isErrorApvMsg,
    data: poApvMsg,
  } = useQuery(["poApvMsg", poNum], () => poAPI.getPOApvMsg(company, poNum), {
    enabled: sistemaContext.userid !== "",
    refetchOnWindowFocus: false,
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleApproveButton = async () => {
    const epicorToken = Cookies.getCookie("epicorToken");
    if (epicorToken == null) {
      setShowLoginSnackbar(true);
    } else {
      setActionType("Approve");
      setConfirmationTitle("Confirm PO Approval");
      let approvalMessage = await poAPI.checkApprovalLimit(
        company,
        poNum,
        poApvMsg.POAmt
      );
      if (approvalMessage === "") {
        approvalMessage =
          "You are about to approve this PO. Do you wish to continue?";
      }
      setConfirmationMessage(approvalMessage);
      setShowConfirmation(true);
    }
  };

  const handleRejectButton = () => {
    const epicorToken = Cookies.getCookie("epicorToken");
    if (epicorToken == null) {
      setShowLoginSnackbar(true);
    } else {
      setActionType("Reject");
      setConfirmationTitle("Confirm PO Rejection");
      setConfirmationMessage(
        "You are about to reject this PO. Do you wish to continue?"
      );
      setShowConfirmation(true);
    }
  };

  const handleConfirmationClose = (confirmed, comment) => {
    setShowConfirmation(false);
    const epicorToken = Cookies.getCookie("epicorToken");
    if (epicorToken == null) {
      setShowLoginSnackbar(true);
    } else if (confirmed) {
      const approverResponse =
        actionType === "Approve" ? "APPROVED" : "REJECTED";
      const dtNow = new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "long",
      }).format(Date.now());
      const newPOApvMsg = [
        {
          ...poApvMsg,
          MsgText: `${dtNow} : ${approverResponse} : ${po.approverName} (${sistemaContext.userid}) : ${comment}\r\n${poApvMsg.MsgText}`,
          ApproverResponse: approverResponse,
          DcdUserID: sistemaContext.userid,
          ApvAmt: poApvMsg.POAmt,
          RowMod: "U",
        },
      ];
      poAPI.updatePOApvMsg(newPOApvMsg).then((isSuccess) => {
        if (isSuccess) {
          sistemaContext.showSnackbarMessage(
            `PO ${poNum} has been ${approverResponse}`
          );
          if (fromDashboard) {
            navigateHistory("/PendingPOs");
          }
        } else {
          sistemaContext.showSnackbarMessage(
            `Error: Unable to ${actionType} PO ${poNum}`
          );
        }
      });
    }
  };

  if (isIdlePO) {
    return (
      <Typography variant="h6" color="error" style={{ marginTop: 50 }}>
        Please login to view this PO
      </Typography>
    );
  }
  if (isLoadingPO) {
    return (
      // <Backdrop className={classes.backdrop} open={true}>
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  if (isErrorPO) {
    const epicorToken = Cookies.getCookie("epicorToken");
    const errorMessage =
      epicorToken == null && sistemaContext.userid !== ""
        ? "Your Epicor Session has expired. Please re-login."
        : `Error loading PO ${poNum}... [${errorPO.message}]`;
    return (
      <Typography variant="h6" color="error" style={{ marginTop: 50 }}>
        {errorMessage}
      </Typography>
    );
  }

  return (
    // <div className={classes.root}>
    <div>
      <Paper
        elevation={2}
        style={{
          padding: 20,
          marginBottom: 20,
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} md={8} lg={9}>
            <Grid container spacing={1}>
              <DataField fieldLabel="PO Number" fieldValue={po.poNum} />
              <DataField fieldLabel="Status" fieldValue={po.poStatus} />
              <DataField fieldLabel="Supplier ID" fieldValue={po.vendorID} />
              <DataField
                fieldLabel="Supplier Name"
                fieldValue={po.vendorName}
              />
              <DataField fieldLabel="PO Date" fieldValue={po.poDate} />
              <DataField fieldLabel="Due Date" fieldValue={po.dueDate} />
              <DataField
                fieldLabel="Entry Person"
                fieldValue={po.entryPerson}
              />
              <DataField fieldLabel="Buyer" fieldValue={po.buyerName} />
              <DataField fieldLabel="Approver" fieldValue={po.approverName} />
              <DataField
                fieldLabel="Approver Message Log"
                fieldValue={po.msgText}
                extraWidth
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Grid container spacing={1}>
              <DataField
                fieldLabel="FX Total Charges"
                fieldValue={po.docTotalCharges}
                isAmount={true}
              />
              <DataField
                fieldLabel="Total Charges"
                fieldValue={po.totalCharges}
                isAmount={true}
              />
              <DataField
                fieldLabel="FX Total Tax"
                fieldValue={po.docTotalTax}
                isAmount={true}
              />
              <DataField
                fieldLabel="Total Tax"
                fieldValue={po.totalTax}
                isAmount={true}
              />
              <DataField
                fieldLabel="FX Order Total"
                fieldValue={po.docTotalOrder}
                isAmount={true}
              />
              <DataField
                fieldLabel="Order Total"
                fieldValue={po.totalOrder}
                isAmount={true}
              />
              <DataField
                fieldLabel="FX Currency"
                fieldValue={po.currencyCode}
                isAmount={true}
              />
              <DataField
                fieldLabel="Currency"
                fieldValue={po.baseCurrencyCode}
                isAmount={true}
              />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Lines" {...a11yProps(0)} />
        <Tab label="Releases" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper} elevation={2}>
          <Table size="small" style={{ border: "hidden",minWidth:650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Line</TableCell>
                <TableCell>Part</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Phase</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">FX Cost</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {po.poLines.map((poDtl) => (
                // <PODtl key={poDtl.lineNum} poDtl={poDtl} />
                // <TableRow key={poDtl.lineNum} className={classes.root}>
                <TableRow key={poDtl.lineNum}>
                  <TableCell>{poDtl.lineNum}</TableCell>
                  <TableCell>{poDtl.partNum}</TableCell>
                  <TableCell>{poDtl.partDesc}</TableCell>
                  <TableCell>{poDtl.dueDate}</TableCell>
                  <TableCell>{poDtl.projectID}</TableCell>
                  <TableCell>{poDtl.phaseDesc}</TableCell>
                  <TableCell align="right">{poDtl.lineQty}</TableCell>
                  <TableCell align="right">{poDtl.unitPrice}</TableCell>
                  <TableCell align="right">{poDtl.extCost}</TableCell>
                  <TableCell align="right">{poDtl.docExtCost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper} elevation={2}>
          <Table size="small" style={{ border: "hidden" }}>
            <TableHead>
              <TableRow>
                <TableCell>Line</TableCell>
                <TableCell>Release</TableCell>
                <TableCell>Part</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Phase</TableCell>
                <TableCell align="right">Qty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {po.poReleases.map((poRel) => (
                // <TableRow key={poRel.id} className={classes.root}>
                <TableRow key={poRel.id}>
                  <TableCell>{poRel.lineNum}</TableCell>
                  <TableCell>{poRel.releaseNum}</TableCell>
                  <TableCell>{poRel.partNum}</TableCell>
                  <TableCell>{poRel.dueDate}</TableCell>
                  <TableCell>{poRel.projectID}</TableCell>
                  <TableCell>{poRel.phaseDesc}</TableCell>
                  <TableCell align="right">{poRel.releaseQty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      {!isLoadingApvMsg &&
        !isErrorApvMsg &&
        isSuccessApvMsg &&
        poApvMsg !== null && (
          <Box display="flex" justifyContent="flex-end" m={1} p={1}>
            <Fab
              // className={classes.fabReject}
              sx={{ backgroundColor: sistTheme.palette.approveButton.main }}
              variant="extended"
              onClick={handleRejectButton}
            >
              {/* <ThumbDownIcon className={classes.extendedIcon} /> */}
              <ThumbDownIcon />
              Reject
            </Fab>
            <Fab
              // className={classes.fabApprove}
              sx={{ backgroundColor: sistTheme.palette.rejectButton.main }}
              variant="extended"
              onClick={handleApproveButton}
            >
              {/* <ThumbUpIcon className={classes.extendedIcon} /> */}
              <ThumbUpIcon />
              Approve
            </Fab>
          </Box>
        )}
      <ConfirmationDialog
        open={showConfirmation}
        onClose={handleConfirmationClose}
        title={confirmationTitle}
        message={confirmationMessage}
        actionType={actionType}
      />
      <Snackbar
        open={showLoginSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        message="Your Epicor Session has expired. Please re-login before Approving/Rejecting this PO"
      />
    </div>
  );
};

export default POApproval;
