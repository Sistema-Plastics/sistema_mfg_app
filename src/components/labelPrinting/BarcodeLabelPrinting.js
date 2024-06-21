//This is the dashboard for the top 5 released jobs for each line in a cell
//nothing draggable nor customizable

import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  Container,
  Typography,
  FormControlLabel,
  Switch,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  Table,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  DialogContentText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import { grey, green, pink, yellow } from "@mui/material/colors";
import { generalFunctions } from "../../helpers/HelperScripts";

// import PageAlert from "../../../assets/components/Alerts";

// import LineJobs from "../assyComponents/LineJobs";

//new stuff
import PrintIcon from "@mui/icons-material/Print";
import { connections } from "../../config/ConnectionBroker";
//import client from "../../../config/mqtt";

import mqtt from "mqtt";
import { mqttFunctions } from "../../helpers/HelperScripts";

import { useTheme } from "@emotion/react";
import { styled } from "@mui/material/styles";
import { muiThemes } from "../../assets/styling/muiThemes";

const sistTheme = muiThemes.getSistemaTheme();

const SistSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: theme.palette.sistema.klipit.main,
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: grey[400],
  },
}));

export default function BarcodeLabelPrinting() {
  ///new updates
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);

  const [printJob, setPrintJob] = useState(null);

  const [canPrint, setCanPrint] = useState(false);

  const baseTopic = connections.getBaseMQTTTopicFromPort();

  const [datasets, setDatasets] = useState({
    cells: null,
    jobstockcheck: null,
    activelabour: null,
    labourdtl: null,
    jobs: null,
    binstockcheck: null,
  });

  let topics = [
    "systemdata/dashboards/epicor/bacodelabelprinting",
    "systemdata/dashboards/epicor/resources",
    "systemdata/dashboards/epicor/employeeslist",
    // "systemdata/dashboards/epicor/activelabour",
    // "systemdata/dashboards/epicor/labourdtl",
    // "systemdata/dashboards/epicor/jobs",
    // "systemdata/dashboards/epicor/binstockcheck",
  ];
  //now add bse topic as prefx
  topics = topics.map((m) => baseTopic + m);

  const sistTheme = muiThemes.getSistemaTheme();

  useEffect(() => {
    console.log("useffect every jobscelldb.js");
  });

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

    client.on("connect", function () {
      setIsConnected(true);
      console.log(" jobscelldb.js connected");
    });
    client.on("end", () => {
      console.log("Connection to MQTT broker ended");
    });

    client.on("message", function (topic, message) {
      // if (topic == routingKey) {
      const msg = JSON.parse(message.toString()).value;
      console.log("msg from " + topic);
      switch (true) {
        case topic.includes("bacodelabelprinting"):
          setDatasets((prevState) => {
            return { ...prevState, bacodelabelprinting: msg };
          });
          break;
        case topic.includes("resources"):
          setDatasets((prevState) => {
            return { ...prevState, resources: msg };
          });
          break;
        case topic.includes("employeeslist"):
          setDatasets((prevState) => {
            return { ...prevState, employees: msg };
          });
          break;
        // case topic.includes("jobstockcheck"):
        //   setDatasets((prevState) => {
        //     return { ...prevState, jobstockcheck: msg };
        //   });
        //   break;
        // case topic.includes("activelabour"):
        //   setDatasets((prevState) => {
        //     return { ...prevState, activelabour: msg };
        //   });
        //   break;
        // case topic.includes("labourdtl"):
        //   setDatasets((prevState) => {
        //     return { ...prevState, labourdtl: msg };
        //   });
        //   break;
        // case topic.includes("jobs"):
        //   setDatasets((prevState) => {
        //     return { ...prevState, jobs: msg };
        //   });
        //   break;
        // case topic.includes("binstockcheck"):
        //   setDatasets((prevState) => {
        //     return { ...prevState, binstockcheck: msg };
        //   });

        //   break;
        default:
      }
    });
  }, [client]);

  useEffect(() => {
    if (
      // datasets.cells !== null &&
      // datasets.jobstockcheck !== null &&
      // datasets.activelabour !== null &&
      // datasets.labourdtl !== null &&
      typeof datasets.employees !== "undefined" &&
      typeof datasets.resources !== "undefined" &&
      typeof datasets.bacodelabelprinting !== "undefined"
    ) {
      try {
      } catch (error) {
        setError(true);
        // setErrorMsg(
        //   "There was a problem while getting the data. Refresh the page"
        // );
      } finally {
        setIsProcessing(false);
      }
    }
  }, [datasets]);

  useEffect(() => {
    if (isConnected) {
      for (let i = 0; i < topics.length; i++) {
        client.subscribe(topics[i], function () {
          console.log("subscribed to ", topics[i]);
        });
      }
    }
  }, [isConnected]);

  useEffect(() => {
    console.log("");
    if (
      printJob !== null &&
      typeof printJob.printer !== "undefined" &&
      typeof printJob.employee !== "undefined" &&
      typeof printJob.printrunqty !== "undefined"
    ) {
      setCanPrint(true);
    } else {
      setCanPrint(false);
    }
  }, [printJob]);

  const handlePrint = (event) => {
    setPrintJob(event);
  };

  const handleUpdateEmployee = (val) => {
    if (
      datasets.employees.filter((e) => e.EmpID === val.target.value).length > 0
    ) {
      setPrintJob((prevState) => {
        return { ...prevState, employee: val.target.value };
      });
    } else {
      const tmp = Object.assign({}, printJob);
      delete tmp.employee;
      setPrintJob(tmp);
    }
  };
  const handleUpdatePrintQty = (val) => {
    let v = 0;
    try {
      v = parseFloat(val.target.value);
      if (v < 1 > 0 || v >= printJob.PrintQty) v = 0;
    } catch {}

    //if invalid print qty v will be 0
    if (v > 0) {
      setPrintJob((prevState) => {
        return { ...prevState, printrunqty: v };
      });
    } else {
      const tmp = Object.assign({}, printJob);
      delete tmp.printrunqty;
      setPrintJob(tmp);
    }
  };
  const handleUpdatePrinter = (val) => {
    setPrintJob((prevState) => {
      return { ...prevState, printer: val.target.value };
    });
  };

  const handlePrintSubmit = () => {
    let record = {
      topic: (baseTopic + `bcprt/${printJob.printer}/printlbarcodelabels`).toLowerCase(),
      qos: 0,
      retain: true,
      payload: Date.now().toString(),
      status: "",
    };

    record.payload = {
      timestamp: Date.now().toString(),
      status:0,
      values: printJob,
    };
    record.status = 0;

    let { topic, qos, retain, payload, status, bookqty, employee } = record;
    payload = JSON.stringify(payload);
    client.publish(topic, payload, { qos, retain }, (error) => {
      if (error) {
        console.log("Publish error: ", error);
      }
    });
    setPrintJob(null);
    setCanPrint(false);
  };
  const handlePrintCancel = () => {
    setPrintJob(null);
    setCanPrint(false);
  };
  return (
    <React.Fragment>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          width: "100%",
          // height: "100vh",
          overflow: "auto",
          pl: 1,
        }}
      >
        <Container
          fluid
          maxWidth="100%"
          disableGutters
          sx={{ flexGrow: 1, mt: 2, mb: 4, backgroundColor: "transparent" }}
        >
          <Grid
            container
            sx={{ minWidth: "100%", backgroundColor: "transparent" }}
          >
            {error ? (
              <></>
            ) : // <PageAlert
            //   header="Something went wrong!"
            //   body={errorMsg}
            //   variant="danger"
            // />
            null}
            {isProcessing ? (
              <Grid
                item
                sx={{
                  width: "100%",
                  height: "70vh",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  backgroundColor: "transparent" /**/,
                }}
              >
                <CircularProgress size={80} color="primary" />
              </Grid>
            ) : (
              <>
                {/* TabName */}
                <Grid
                  item
                  xs={12}
                  sx={{
                    backgroundColor: "transparent",
                    mb: 1,
                  }}
                >
                  <Typography variant="h4">Label Printing </Typography>
                </Grid>
                <Grid
                  item
                  xs={2.5}
                  sx={{ backgroundColor: "transparent", mb: 2 }}
                >
                  <FormControlLabel
                    control={
                      <SistSwitch
                        // checked={displayUnRequired}
                        // onChange={handleUnRequiredChange}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Show All Jobs"
                  />
                </Grid>
                <Grid item xs={4} sx={{ backgroundColor: "transparent" }}>
                  <FormControlLabel
                    control={
                      <SistSwitch
                        // checked={displayOnlyClockedIn}
                        // onChange={handleClockedInChange}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Show Completed Label Jobs"
                  />
                </Grid>
                <Grid container>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Job Number</TableCell>
                        <TableCell>Label ASM PN</TableCell>
                        <TableCell>Label Stock Part Number</TableCell>
                        <TableCell>Label Stock Description</TableCell>
                        <TableCell>Requied Label Qty</TableCell>
                        <TableCell>Rem Label Qty</TableCell>
                        <TableCell>EAN</TableCell>
                        <TableCell>FG Part Number</TableCell>
                        <TableCell>FG Part Description</TableCell>
                        <TableCell>Label Destination</TableCell>

                        <TableCell>Print</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {datasets.bacodelabelprinting.map((bcl, key) => (
                        <TableRow>
                          <TableCell>
                            {bcl.JobNum + ":" + bcl.AssemblySeq}
                          </TableCell>
                          <TableCell>{bcl.LabelPart}</TableCell>
                          <TableCell>{bcl.LabelMaterial}</TableCell>
                          <TableCell>{bcl.LabelMaterialDesc}</TableCell>
                          <TableCell>{bcl.PrintQty}</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>{bcl.GTIN13_c}</TableCell>
                          <TableCell>{bcl.FG_Part}</TableCell>
                          <TableCell>{bcl.FG_PartDesc}</TableCell>
                          <TableCell>{bcl.ResourceID}</TableCell>

                          <TableCell>
                            <PrintIcon
                              key={bcl.JobNum}
                              sx={{
                                fontSize: 20,
                                color: sistTheme.palette.sistema.microwave.main,
                              }}
                              onClick={() => handlePrint(bcl)}
                            ></PrintIcon>
                            {/* <IconButton onClick={handlePrint(bcl)}>
                              <PrintIcon />
                            </IconButton> */}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                    <TableFooter></TableFooter>
                  </Table>
                </Grid>

                <Dialog
                  open={printJob !== null}
                  maxWidth={"sm"} //xs, sm, md, lg, xl
                  fullWidth={true}
                >
                  <DialogTitle>
                    {printJob === null
                      ? ""
                      : "Print Job For " + printJob.JobNum}
                  </DialogTitle>
                  <DialogContent>
                    {/* <Grid item xs={3}>
                      Employee Number
                    </Grid>
                    <Grid item xs={9}></Grid>
                    <Grid item xs={3}>
                      Required Qty
                    </Grid>
                    <Grid item xs={9}></Grid>
                    <Grid item xs={3}>
                      Printer
                    </Grid>
                    <Grid item xs={9}></Grid> */}
                  </DialogContent>
                  <DialogContent>
                    <Grid container>
                      <Grid item xs={3}>
                        <DialogContentText>Employee Number</DialogContentText>
                      </Grid>
                      <Grid item xs={9}>
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
                                error={
                                  printJob === null ||
                                  typeof printJob.employee === "undefined"
                                }
                                id="outlined-error"
                                defaultValue=""
                                variant="filled"
                                // helperText={empHelperText.current}
                                onChange={handleUpdateEmployee}
                              ></TextField>
                            }
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={3}>
                        <DialogContentText>
                          No Labels to print
                        </DialogContentText>
                      </Grid>
                      <Grid item xs={9}>
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
                                error={
                                  printJob === null ||
                                  typeof printJob.printrunqty === "undefined"
                                }
                                id="outlined-error"
                                defaultValue=""
                                variant="filled"
                                // helperText={empHelperText.current}
                                onChange={handleUpdatePrintQty}
                              ></TextField>
                            }
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={3}>
                        <DialogContentText>Printer</DialogContentText>
                      </Grid>
                      <Grid item xs={9}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Select Printer
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={dbData.cellFilter.cellID}
                            label="Resource"
                            onChange={handleUpdatePrinter}
                          >
                            {datasets.resources
                              .filter((r) => r.ResourceGrpID === "BCPRT")
                              .map((r) => {
                                return (
                                  <MenuItem value={r.ResourceID}>
                                    {r.Description}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handlePrintCancel}>Cancel</Button>
                    <Button disabled={!canPrint} onClick={handlePrintSubmit}>
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </Grid>
        </Container>
      </Box>
    </React.Fragment>
  );
}
/**
 * 
 * {
    "Company": "SISTNZ",
    "JobNum": "A0323216",
    "PartNum": "5295081",
    "PartDescription": "LBL FIR STD Barcode for Insert 60x40mm 2024",
    "AssemblySeq": 1,
    "GTIN13_c": "9414202011022",
    "LabelDesc1_c": "",
    "LabelDesc2_c": "",
    "LabelDesc3_c": "",
    "Print": false,
    "PrintQty": 5060,
    "Printer": "",
    "RowMod": null,
    "RowIdent": "4c8c3223-1151-4d71-8a43-6f1f0aebcb34",
    "SysRowID": "4c8c3223-1151-4d71-8a43-6f1f0aebcb34"
}
 */
