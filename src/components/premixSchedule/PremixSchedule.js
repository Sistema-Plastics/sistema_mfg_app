import React, { useState, useEffect, useContext } from "react";
import { useRef } from "react";
import { SistemaContext } from "../../../src/assets/components/SistemaHeader";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableSortLabel,
  TablePagination,
  Button,
  Select,
  MenuItem,
  InputLabel,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Grid, TextField } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Link } from "react-router-dom";
import { connections } from "../../config/ConnectionBroker";
import mqtt from "mqtt";
import { mqttFunctions } from "../../helpers/HelperScripts";
import { styled } from "@mui/system";
import { muiThemes } from "../../assets/styling/muiThemes";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const sistTheme = muiThemes.getSistemaTheme();

const PremixSchedule = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [dataComplete, setDataComplete] = useState(false);
  const [client, setClient] = useState(null);
  const [datasets, setDatasets] = useState({
    PremixSched: null,
    EmployeeData: null,
    RenderList: null,
  });

  const baseTopic = connections.getBaseMQTTTopicFromPort();

  //#region  Dialog setups

  // const [openPartDetails, setOpenPartDetails] = React.useState(false);
  // const [openPartQtySet, setOpenPartQtySet] = React.useState(false);
  // const [openDialog, setOpenDialog] = useState(false);
  const [selectedPartNum, setSelectedPartNum] = useState(null);
  const [selectedPartDesc, setSelectedPartDesc] = useState(null);

  const [quantityErr, setQuantityErr] = useState(true);
  const qtyHelperText = useRef("");
  const addQty = useRef(0);
  //const [addQtyErr, setAddQtyErr] = useState(true);

  const [employeeErr, setEmployeeErr] = useState(true);
  const empHelperText = useRef("");
  const employeeID = useRef(null);
  const employee = useRef({ employeeID: "", employeeName: "" });
  const sistemaContext = useContext(SistemaContext);

  const [filterValue, setFilterValue] = useState("ALL");

  // const handleOpenDialog = (event) => {
  //   // setJobData(datasets.currentJob);
  //   // setEmployeeErr(true);
  //   // setOpenEmployeeSet(true);
  //   // setOpenDialog(!openDialog);
  //   if (!event){
  //     setSelectedPartNum(null)
  //     return;
  //   } ;

  //   console.log(event.target.value)
  //   setSelectedPartNum(event.target.value)
  //   // setSelectedPartNum(val)
  // };

  useEffect(() => {
    setClient(
      mqtt.connect(
        mqttFunctions.getHostname(),
        mqttFunctions.getOptions(
          "mqtt",
          Math.random().toString(16).substring(2, 8)
        )
      )
    );
  }, []);

  useEffect(() => {
    if (!client) return;

    client.on("connect", () => {
      setIsConnected(true);
      console.log("connected");
    });

    client.on("end", () => {
      console.log("Connection to MQTT broker ended");
    });

    client.on("message", (topic, message) => {
      const msg = JSON.parse(message.toString());
      if (topic.includes("premixsched")) {
        setDatasets((prevState) => ({ ...prevState, PremixSched: msg.value }));
        setDatasets((prevState) => ({ ...prevState, RenderList: msg.value }));
      }
      if (topic.includes("employeeslist")) {
        setDatasets((prevState) => ({ ...prevState, EmployeeData: msg.value }));
      }
      console.log("Received  '" + topic + "'");
    });
  }, [client]);

  useEffect(() => {
    if (isConnected) {
      client.subscribe(
        baseTopic + "systemdata/dashboards/epicor/premixsched",
        () => {
          console.log("subscribed to PremixSched");
        }
      );
      client.subscribe(
        baseTopic + "systemdata/dashboards/epicor/employeeslist",
        () => {
          console.log("subscribed to employeeslist");
        }
      );
    }
  }, [isConnected]);

  useEffect(() => {
    if (
      datasets.PremixSched !== null &&
      datasets.EmployeeData !== null &&
      datasets.RenderList !== null
    ) {
      setDataComplete(true);
    }
  }, [datasets]);

  useEffect(() => {
    //==========================================================
    // Initialize data for Sistema Toolbar and Filtering options
    //==========================================================
    sistemaContext.setPageTitle("Premix Schedule");
    sistemaContext.setPageFilters([
      {
        id: 0,
        label: "Jobs",
        filterValues: ["ALL", "Released Only"],
        currentValue: "ALL",
      },
    ]);
  }, []);

  useEffect(() => {
    //=======================================================================
    // Re-filter our data based on updated Filter values from Sistema Toolbar
    //=======================================================================
    if (sistemaContext.pageFilters.length > 0) {
      if (sistemaContext.pageFilters[0].currentValue == "ALL") {
        sistemaContext.setPageTitle(`Premix Schedule: ALL`);
        setDatasets((prevState) => ({
          ...prevState,
          RenderList: datasets.PremixSched,
        }));
      } else {
        setDatasets((prevState) => ({
          ...prevState,
          RenderList: datasets.PremixSched.filter(
            (j) => !j.JobNum.startsWith("APU")
          ),
        }));
        sistemaContext.setPageTitle(`Premix Schedule: Released`);
      }
    }
  }, [sistemaContext.pageFilters]);

  // const EnhancedTable = () => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("StartDate");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const sortedRows = React.useMemo(() => {
    if (!datasets.RenderList) return [];
    return [...datasets.RenderList].sort((a, b) => {
      if (orderBy === "StartDate") {
        return order === "asc"
          ? new Date(a.StartDate) - new Date(b.StartDate)
          : new Date(b.StartDate) - new Date(a.StartDate);
      }
      return 0;
    });
  }, [datasets.RenderList, order, orderBy]);

  const paginatedRows = React.useMemo(() => {
    return sortedRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedRows, page, rowsPerPage]);

  const handleQtyChange = (event) => {
    const val = event.target.value;
    let qtyErr = true;

    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    if (isNumeric(val) && parseInt(val) > 0) {
      qtyHelperText.current = "";
      addQty.current = parseInt(event.target.value);
      qtyErr = false;
    } else {
      qtyHelperText.current = "Please enter a valid number";
    }
    setQuantityErr(qtyErr);

    //console.log("value is:", event.target.value);
  };

  const handleEmployeeChange = (event) => {
    const val = event.target.value;
    let emperr = true;
    employeeID.current = null;
    const emp = datasets.EmployeeData.filter((e) => e.EmpID === val)[0];
    if (emp) {
      emperr = false;
      empHelperText.current = "";

      employeeID.current = val;
      employee.current.employeeID = emp.EmpID;
      employee.current.employeeName = emp.Name;
    } else {
      empHelperText.current = "PLease enter valid Employee Number";
    }
    setEmployeeErr(emperr);
  };

  const handleEnableContinue = () => {
    setEmployeeErr(false);
    setQuantityErr(false);
  };

  return dataComplete ? (
    <React.Fragment>

      <TableContainer component={Paper} sx={{ width: 1300 }}>
        <Table sx={{ minWidth: 1000, width: "100%" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Part Number</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="left">Job Num</TableCell>
              <TableCell align="left">Production Qty</TableCell>
              <TableCell align="left">Outstanding Qty</TableCell>
              <TableCell align="left">
                <TableSortLabel
                  active={orderBy === "StartDate"}
                  direction={orderBy === "StartDate" ? order : "asc"}
                  onClick={() => handleRequestSort("StartDate")}
                >
                  Start Date
                </TableSortLabel>
              </TableCell>
              <TableCell align="left">Req Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, key) => (
              <TableRow
                key={row.PartNum + "" + key}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Button
                    value={row.PartNum}
                    onClick={(e) => (
                      setSelectedPartNum(row.PartNum),
                      setSelectedPartDesc(row.PartDescription),
                      setEmployeeErr(true)
                    )}
                    sx={{
                      backgroundColor: "white",
                      color: "blue",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {row.PartNum}
                  </Button>
                </TableCell>
                <TableCell align="left">{row.PartDescription}</TableCell>
                <TableCell align="left">{row.JobNum}</TableCell>
                <TableCell align="left">
                  {parseFloat(row.ProdQty).toFixed(2)}
                </TableCell>
                <TableCell align="left">
                  {parseFloat(row.RequiredQty).toFixed(2)}
                </TableCell>
                <TableCell align="left">{row.StartDate.slice(0, 10)}</TableCell>
                <TableCell align="left">
                  {row.ReqDueDate.slice(0, 10)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div id="dialog">
        <Dialog open={selectedPartNum != null}>
          <DialogTitle>Kanban Receipt</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div>
                <Typography
                  display="inline"
                  sx={{
                    color: "Black",
                  }}
                >
                  Part Number :
                </Typography>
                <Typography
                  display="inline"
                  sx={{
                    color: "Black",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {selectedPartNum}
                </Typography>
              </div>
            </DialogContentText>
            <DialogContentText>
              <div>
                <Typography
                  display="inline"
                  sx={{
                    color: "Black",
                  }}
                >
                  Part Description :
                </Typography>
                <Typography
                  display="inline"
                  sx={{
                    color: "Black",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {selectedPartDesc}
                </Typography>
              </div>
            </DialogContentText>
            <FormControl>
              <FormControlLabel
                sx={{
                  backgroundColor: "transparent",
                  "& .MuiFilledInput-input": {
                    color: sistTheme.palette.sistema.klipit.main,
                  },
                }}
                control={
                  <TextField
                    error={quantityErr}
                    id="outlined-error"
                    defaultValue=""
                    label="Enter Quantity"
                    variant="filled"
                    helperText={qtyHelperText.current}
                    onChange={handleQtyChange}
                  ></TextField>
                }
              />
            </FormControl>
            <FormControl>
              <FormControlLabel
                sx={{
                  backgroundColor: "transparent",
                  "& .MuiFilledInput-input": {
                    color: sistTheme.palette.sistema.klipit.main,
                  },
                }}
                control={
                  <TextField
                    error={employeeErr}
                    id="outlined-error"
                    defaultValue=""
                    label="Enter Employee Id"
                    variant="filled"
                    helperText={empHelperText.current}
                    onChange={handleEmployeeChange}
                  ></TextField>
                }
              />
            </FormControl>
          </DialogContent>

          <DialogActions>
            <Button value={null} onClick={(e) => setSelectedPartNum(null)}>
              Cancel
            </Button>
            <Button
              disabled={employeeErr || quantityErr}
              onClick={handleEnableContinue}
            >
              Continue
            </Button>
          </DialogActions>
        </Dialog>
        <TablePagination sx={{ width: 1300}}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </React.Fragment>
  ) : (
    <Container>
      <div>Hello World!</div>
    </Container>
  );
};

// return <EnhancedTable />;
// };

export default PremixSchedule;
