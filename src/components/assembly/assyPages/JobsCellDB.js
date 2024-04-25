//This is the dashboard for the top 5 released jobs for each line in a cell
//nothing draggable nor customizable

import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import CircularProgress from "@mui/material/CircularProgress";
import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import { generalFunctions } from "../../../helpers/HelperScripts";

import PageAlert from "../../../assets/components/Alerts";

import LineJobs from "../assyComponents/LineJobs";

//new stuff
import { AssyData } from "../assyData/AssyDataFunctions";
import { connections } from "../../../config/ConnectionBroker";
//import client from "../../../config/mqtt";

import mqtt from "mqtt";
import { mqttFunctions } from "../../../helpers/HelperScripts";

import { muiThemes } from "../../../assets/styling/muiThemes";
import MonitorOutlinedIcon from "@mui/icons-material/MonitorOutlined";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function JobsCellDB() {
  const getParams = new URLSearchParams(useLocation().search);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const lines = useRef([]);
  const cellParam = useRef(getParams.get("cell"));
  const lineParam = useRef(getParams.get("line"));
  const showConstraintsOnly = useRef(getParams.get("showConstraintsOnly"));
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  ///new updates
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [dbData, setDBData] = useState({ cellFilter: null, openJobs: null });

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
    "systemdata/dashboards/epicor/cells",
    "systemdata/dashboards/epicor/jobstockcheck",
    "systemdata/dashboards/epicor/activelabour",
    "systemdata/dashboards/epicor/labourdtl",
    "systemdata/dashboards/epicor/jobs",
    "systemdata/dashboards/epicor/binstockcheck",
  ];
  //now add bse topic as prefx
  topics = topics.map((m) => baseTopic + m);

  const sistTheme = muiThemes.getSistemaTheme();

  const handleCellChange = (event, child) => {
    console.log(event.target.value);
    setDBData((prevState) => {
      return {
        ...prevState,
        cellFilter: {
          cellID: event.target.value,
          cellDesc: child.props.children,
        },
      };
    });
    generalFunctions.updateURLQueryParam("cell", event.target.value);
  };

  useInterval(() => {
    // Your custom logic here
    let cellid = "";
    let celldesc = "";

    try {
      let i = datasets.cells
        .map((c) => c.cellID)
        .indexOf(dbData.cellFilter.cellID);

      if (i === datasets.cells.length - 1) {
        i = 0;
      } else {
        i++;
      }

      cellid = datasets.cells[i].cellID;
      celldesc = datasets.cells[i].cellDesc;

      generalFunctions.updateURLQueryParam("cell", datasets.cells[i].cellID);
      // window.location.reload();
    } catch {}

    console.log(`current cell ${dbData.cellFilter.cellID} new cell ${cellid}`);

    setDBData((prevState) => {
      return {
        ...prevState,
        cellFilter: {
          cellID: cellid,
          cellDesc: celldesc,
        },
      };
    });
  }, 15000);

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
        case topic.includes("cells"):
          // tmpDatasets.current.employees = msg;

          setDatasets((prevState) => {
            return { ...prevState, cells: AssyData.assyCells(msg) };
          });
          break;
        case topic.includes("jobstockcheck"):
          // tmpDatasets.current.employees = msg;
          setDatasets((prevState) => {
            return { ...prevState, jobstockcheck: msg };
          });
          break;
        case topic.includes("activelabour"):
          // tmpDatasets.current.employees = msg;
          setDatasets((prevState) => {
            return { ...prevState, activelabour: msg };
          });
          break;
        case topic.includes("labourdtl"):
          // tmpDatasets.current.employees = msg;
          setDatasets((prevState) => {
            return { ...prevState, labourdtl: msg };
          });
          break;
        case topic.includes("jobs"):
          // tmpDatasets.current.employees = msg;
          setDatasets((prevState) => {
            return { ...prevState, jobs: msg };
          });
          break;
        case topic.includes("binstockcheck"):
          // tmpDatasets.current.employees = msg;
          setDatasets((prevState) => {
            return { ...prevState, binstockcheck: msg };
          });

          break;
        default:
      }
    });
  }, [client]);

  useEffect(() => {
    if (
      datasets.cells !== null &&
      datasets.jobstockcheck !== null &&
      datasets.activelabour !== null &&
      datasets.labourdtl !== null &&
      datasets.jobs !== null &&
      datasets.binstockcheck !== null
    ) {
      try {
        let tempDefaultCell = datasets.cells.filter(
          (c) => c.cellID === cellParam.current
        )[0];
        const tempOpenJobs = AssyData.assyJobs(datasets);

        setDBData((prevState) => {
          return {
            ...prevState,
            cellFilter: tempDefaultCell,
            openJobs: tempOpenJobs,
          };
        });
      } catch (error) {
        setError(true);
        setErrorMsg(
          "There was a problem while getting the data. Refresh the page"
        );
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
    if (dbData.cellFilter && dbData.openJobs) {
      var tempFilteredJobs = [];
      if (showConstraintsOnly.current === "true") {
        tempFilteredJobs = dbData.openJobs.filter(
          (j) =>
            (j.constraint || j.binStockLevel !== "high") &&
            j.cellID === dbData.cellFilter.cellID
        );
        let filteredLines = lines.current.filter((l) =>
          tempFilteredJobs.some((j) => j.lineID === l.lineID)
        );
        lines.current = filteredLines;
      } else {
        tempFilteredJobs = dbData.openJobs.filter(
          (j) => j.cellID === dbData.cellFilter.cellID
        );
      }
      if (lineParam.current === null) {
        // Get distinct lines for grouping
        lines.current = [
          ...new Set(tempFilteredJobs.map((line) => line.lineID.trim())),
        ];
      } else {
        lines.current = [lineParam];
      }
      setFilteredJobs(tempFilteredJobs);
    }
  }, [dbData.cellFilter]);

  return (
    <>
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
        }}
      >
        <Container fluid maxWidth="100%" disableGutters sx={{ flexGrow: 1, mt: 4, mb: 4 , backgroundColor:'transparent'}}>
          <Grid container sx={{ minWidth: "100%", backgroundColor:'transparent' }}>
            {error ? (
              <PageAlert
                header="Something went wrong!"
                body={errorMsg}
                variant="danger"
              />
            ) : null}
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
                  xs={2}
                  sx={{
                    backgroundColor: "transparent",
                  }}
                >
                  <Link
                    to={`/`}
                    sx={{
                      backgroundColor: "transparent",
                    }}
                  >
                    <HomeOutlinedIcon
                      sx={{
                        fontSize: 50,
                        color: sistTheme.palette.sistema.klipit.light,
                        backgroundColor: "transparent",
                      }}
                    />
                  </Link>
                </Grid>
                <Grid
                  item
                  xs={8}
                  sx={{
                    backgroundColor: "transparent",
                  }}
                >
                  {/* <h2>{title} Production Schedule</h2> */}
                  <Typography variant="h4">
                    {dbData.cellFilter.cellDesc} Production Schedule
                  </Typography>
                </Grid>
                <Grid
                  xs={2}
                  sx={{
                    backgroundColor: "transparent",
                  }}
                >
                  {/* <Typography variant="h6">Cell:</Typography> */}
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Select Cell
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={dbData.cellFilter.cellID}
                      label="Cell"
                      onChange={handleCellChange}
                    >
                      {datasets.cells.map((cell) => {
                        return (
                          <MenuItem value={cell.cellID}>
                            {cell.cellDesc}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Data */}
                {lines.current.map((m, index) => (
                  <Container
                    fluid
                    key={index}
                    sx={{ minWidth: "100%", padding:0 /* backgroundColor:'orange'*/ }}
                  >
                    <Grid container>
                      <Grid item xs={11}>
                        <Typography
                          variant="body1"
                          sx={{ color: sistTheme.palette.sistema.klipit.light }}
                        >
                          Line {m}
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography
                          variant="body1"
                          sx={{ color: sistTheme.palette.sistema.klipit.light }}
                        >
                          <Link
                            to={`/Assembly/JobsLineDB?line=${m}&showConstraintsOnly=${showConstraintsOnly.current}`}
                            target="_blank"
                          >
                            <MonitorOutlinedIcon
                              sx={{
                                fontSize: 25,
                                color: sistTheme.palette.sistema.klipit.light,
                                backgroundColor: "transparent",
                              }}
                            ></MonitorOutlinedIcon>
                          </Link>
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid>
                      <Grid>
                        <LineJobs
                          jobs={filteredJobs.filter((f) => f.lineID === m)}
                          showConstraintsOnly={showConstraintsOnly.current}
                        />
                      </Grid>
                    </Grid>{" "}
                    {/**/}
                  </Container>
                ))}
              </>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
