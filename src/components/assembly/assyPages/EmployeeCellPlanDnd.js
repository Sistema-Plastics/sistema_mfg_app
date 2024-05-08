import React, {
  // Component,
  useEffect,
  useState,
} from "react";
// import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Avatar,
  Box,
  FormControlLabel,
  // Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Switch,
  // ListSubheader,
  // Paper,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

import cellCrewSize from "../assyData/CellCrewSize";
import assyEmployees from "../assyData/EmpList";
import assyShifts from "../assyData/Shifts";

import { useTheme } from "@emotion/react";
import { styled } from "@mui/material/styles";
import { muiThemes } from "../../../assets/styling/muiThemes";
// import { tableCellClasses } from "@mui/material/TableCell";
import { grey, green, pink, yellow } from "@mui/material/colors";

import { connections } from "../../../config/ConnectionBroker";

import { mqttFunctions } from "../../../helpers/HelperScripts";
import mqtt from "mqtt";

// https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette.info
// https://mui.com/material-ui/customization/color/#2014-material-design-color-palettes

const Lane = styled(Box)(({ theme }) => ({
  // border: "solid",
  // borderColor: "black",
  backgroundColor: "lightgrey",
  // paddingBottom: 4,
  // paddingTop: 4,
  fontSize: 14,
  margin: 5,
  width: 250,
}));

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

const getCurrShift = (shifts) => {
  const d = new Date();

  //1st get all shifts cobvering current time
  let v = shifts.filter((s) => d > s.startoffset && d < s.endoffset);

  //set daty filter
  const wkday =
    d.getDay() > 0 && d.getDay() < 6
      ? "Weekday"
      : d.getDay() === 0
      ? "Sunday"
      : "Saturday";

  //now filter for assembly dept and day of week
  v = v.filter(
    (s) => s.shiftDesc.includes(wkday) && s.shiftDesc.includes("Assembly")
  );

  return v[0];
};

function EmployeeCellPlanDnd() {
  //const [cellData, setCellData] = useState(cellCrewSize());
  //const [employeeData, setEmployeeData] = useState(assyEmployees());

  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [dataComplete, setDataComplete] = useState(false);
  const [displayUnRequired, setDisplayUnRequired] = useState(true);
  const [displayOnlyClockedIn, setDisplayOnlyClockedIn] = useState(false);

  const [datasets, setDatasets] = useState({
    employees: null,
    activelabour: null,
    clockins: null,
    plannedleave: null,
    cellcrewsizeOld: null,
    cells: null,
    shifts: null,
    assycrewsizes: null,
  });

  const sistTheme = useTheme();

  let topics = [
    "systemdata/dashboards/epicor/employeeslist",
    "systemdata/dashboards/epicor/empclockin",
    "systemdata/dashboards/epicor/plannedleave",
    "systemdata/dashboards/epicor/activelabour",
    "systemdata/dashboards/epicor/cellcrewsize",
    "systemdata/dashboards/epicor/cells",
    "systemdata/dashboards/epicor/shifts",
    "systemdata/dashboards/epicor/assycrewsize",
  ];

  // //now add bse topic as prefx
  const baseTopic = connections.getBaseMQTTTopicFromPort();
  topics = topics.map((m) => baseTopic + m);

  const currShift =
    datasets.shifts === null ? null : getCurrShift(datasets.shifts);

  const handleOnDragEnd = (result) => {
    const employeeID = result.draggableId;
    const src = result.source.droppableId;
    const dest = result.destination.droppableId;

    const newemps = datasets.employees.map((e) => {
      if (e.id === employeeID) {
        return { ...e, cell: dest };
      } else {
        return e;
      }
    });
    setMaxLineCrewSize(newemps);
    setDatasets((prevState) => {
      return { ...prevState, employees: newemps };
    });
    console.log(`Moved ${employeeID}  from ${src}  to ${dest} `);
  };

  const handleSave = (e) => {
    console.log("save plan");
  };

  const handleUnRequiredChange = (event) => {
    setDisplayUnRequired(event.target.checked);
  };

  const handleClockedInChange = (event) => {
    setDisplayOnlyClockedIn(event.target.checked);
  };

  const setMaxLineCrewSize = (empDataset) => {
    //get unique list of lines
    //Sets cannot have repeated values so casting the array returns pny uniques val
    const lineSet = new Set(datasets.assycrewsizes.map((c) => c.ResourceID));

    const lines = [];
    if (empDataset === null) empDataset = datasets.employees.map((e) => e);

    //get max crew per line
    lineSet.forEach(function (line) {
      // console.log(line);
      const t = datasets.assycrewsizes
        .filter((asc) => asc.ResourceID === line)
        .reduce(function (p, c) {
          return parseFloat(p.ProdCrewSize) > parseFloat(c.ProdCrewSize)
            ? p
            : c;
        });

      lines.push({
        ResourceID: t.ResourceID,
        ProdCrewSize: parseFloat(t.ProdCrewSize),
        Cell: t.Cell_c,
      });
    });

    //now we have max crew per line, sum for each cell
    //clone array via map
    let tmpCells = datasets.cells.map((c) => c);

    //add values to each cell t show required crew and qty assigned
    tmpCells.forEach(function (cell) {
      cell.ProdCrewSize = lines
        .filter((l) => l.Cell === cell.CodeID)
        .reduce(function (acc, obj) {
          return acc + obj.ProdCrewSize;
        }, 0);
      cell.AssignedCrewSize = empDataset.filter(
        (e) =>
          (e.cell === cell.CodeID ||
            (cell.CodeID === "0" && e.cell === "avail")) &&
          e.availShift === currShift.shiftID
      ).length;
    });

    //handle the special case for cell 0 Unassigned employees
    tmpCells[0].ProdCrewSize = tmpCells[0].AssignedCrewSize;

    //save to dataset
    setDatasets((prevState) => {
      return { ...prevState, cells: tmpCells };
    });
  };

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
      //when connected pass to is connected  effect to subscribe
      setIsConnected(true);

      console.log("connected");
    });
    client.on("end", () => {
      console.log("Connection to MQTT broker ended");
    });

    client.on("message", function (topic, message) {
      // if (topic == routingKey) {
      const msg = JSON.parse(message.toString()).value;
      switch (true) {
        case topic.includes("employeeslist"):
          // tmpDatasets.current.employees = msg;
          setDatasets((prevState) => {
            return { ...prevState, employees: assyEmployees(null, msg) };
          });

          break;
        case topic.includes("plannedleave"):
          // tmpDatasets.current.realtime = msg;
          setDatasets((prevState) => {
            return { ...prevState, plannedleave: msg };
          });
          break;
        case topic.includes("activelabour"):
          // tmpDatasets.current.jobs = msg;
          setDatasets((prevState) => {
            return { ...prevState, activelabour: msg };
          });
          break;
        case topic.includes("empclockin"):
          // tmpDatasets.current.machinedata = msg;
          setDatasets((prevState) => {
            return { ...prevState, clockins: msg };
          });
          break;
        case topic.includes("cellcrewsize"):
          // tmpDatasets.current.machinedata = msg;
          setDatasets((prevState) => {
            return { ...prevState, cellcrewsizeOld: cellCrewSize(null, msg) };
          });
          break;
        case topic.includes("shifts"):
          // tmpDatasets.current.machinedata = msg;
          setDatasets((prevState) => {
            return { ...prevState, shifts: assyShifts(msg) };
          });
          break;
        case topic.includes("assycrewsize"):
          // tmpDatasets.current.machinedata = msg;
          setDatasets((prevState) => {
            return { ...prevState, assycrewsizes: msg };
          });
          break;
        case topic.includes("cells"):
          //add unassigned reference
          msg.unshift({
            CodeID: "0",
            CodeDesc: "Unassigned Employees",
            LongDesc: "ASPK",
          });

          setDatasets((prevState) => {
            return { ...prevState, cells: msg };
          });
          break;
        default:
      }
    });
  }, [client]);

  useEffect(() => {
    //when connected subscribe to the topics
    if (isConnected) {
      for (var i = 0; i < topics.length; i++) {
        client.subscribe(topics[i], function () {
          console.log("subscribed to ", topics[i]);
        });
      }
    }
  }, [isConnected]);

  useEffect(() => {
    //when datsets are filled we can now get real
    if (
      datasets.employees !== null &&
      datasets.activelabour !== null &&
      datasets.cellcrewsizeOld !== null &&
      datasets.cells !== null &&
      datasets.shifts !== null &&
      datasets.assycrewsizes !== null &&
      datasets.clockins !== null
    ) {
      // setMaxLineCrewSize();
      setDataComplete(true);
    }
  }, [datasets]);

  useEffect(() => {
    //when the data retreivl is complete close teh MQTT connection
    if (client) {
      client.end({
        reasonCode: 0x04, // Disconnect with Will Message
        properties: {
          reasonString: "Closing connection once all Crew information gathered",
        },
      });
    }
    //get each lines max crewsize for jobs where startdate
    //is less than or equalk to today
    if (dataComplete) setMaxLineCrewSize(null);
  }, [dataComplete]);

  const isclockedin = (e) => {
    //if filter retuens array then length will be > 0 hence true
    return datasets.clockins.filter((c) => c.EmpID === e.id).length > 0;
  };

  return !dataComplete ? (
    <React.Fragment>
      <Typography variant="h2">Fetching Data</Typography>
    </React.Fragment>
  ) : (
    <React.Fragment>
      {/* // <div> */}
      <Box sx={{ alignItems: "center", padding: 3 }}>
        <Grid container sx={{ backgroundColor: "transparent" }}>
          <Grid item xs={2} sx={{ backgroundColor: "transparent" }}>
            <FormControlLabel
              control={
                <SistSwitch
                  checked={displayUnRequired}
                  onChange={handleUnRequiredChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Show Unrequired Cells"
            />
            <FormControlLabel
              control={
                <SistSwitch
                  checked={displayOnlyClockedIn}
                  onChange={handleClockedInChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Show Only Clocked In"
            />
          </Grid>
          <Grid
            item
            xs={8}
            alignItems={"center"}
            sx={{ backgroundColor: "transparent" }}
          >
            <Typography variant="h4" sx={{ alignSelf: "center" }}>
              {currShift.shiftDesc} Shift Assignment Plan for{" "}
              {new Date().toLocaleDateString()}{" "}
            </Typography>
          </Grid>
          <Grid item xs={2} sx={{ backgroundColor: "transparent" }}>
            <SaveIcon
              sx={{
                fontSize: 40,
                color: sistTheme.palette.sistema.klipit.light,
              }}
              onClick={() => handleSave()}
            ></SaveIcon>
          </Grid>
        </Grid>
      </Box>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Box display={"flex"} flexDirection={"row"} maxHeight={"80vh"}>
          {[
            ...new Set(
              datasets.cells
                .filter((c) =>
                  c.LongDesc === "ASPK" && displayUnRequired
                    ? c.ProdCrewSize >= 0
                    : c.ProdCrewSize > 0
                )
                .map((item) => item)
            ),
          ].map((item, index) => (
            <Lane>
              <Typography
                variant="body1"
                sx={{
                  color: grey[900],
                  minHeight: 60,
                  paddingLeft: 2,
                  paddingRight: 2,
                  backgroundColor: "darkgrey",
                }}
              >
                {item.CodeDesc} {item.AssignedCrewSize} / {item.ProdCrewSize}
              </Typography>

              <Droppable droppableId={item.CodeID}>
                {(provided, snapshot) => (
                  <List
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      ...provided.droppableProps.style,
                      backgroundColor: snapshot.isDraggingOver
                        ? "lightblue"
                        : "lightgrey",
                      //height: "100%",
                      minHeight: "70vh",
                      maxHeight: "70vh",
                      overflow: "auto",
                    }}
                  >
                    {/* match employe to cell or if they have non or avail assign to available list */}

                    {datasets.employees
                      .filter(
                        (e) =>
                          e.availShift === currShift.shiftID &&
                          (item.CodeID === e.cell ||
                            (item.CodeID === "0" && e.cell === "") ||
                            (item.CodeID === "0" && e.cell === "avail")) &&
                          (displayOnlyClockedIn === true && !isclockedin(e)
                            ? false
                            : true)
                      )
                      .map((e, index) => (
                        <Draggable key={e.id} draggableId={e.id} index={index}>
                          {(provided, snapshot) => (
                            <ListItem
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                              style={{
                                ...provided.draggableProps.style,
                                backgroundColor: snapshot.isDragging
                                  ? "darkgrey"
                                  : isclockedin(e)
                                  ? sistTheme.palette.sistema.freshworks.main
                                  : sistTheme.palette.sistema.microwave.main,
                                padding: 0,
                                // paddingLeft: 5,
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar sx={{ margin: 0, marginTop: 1 }}>
                                  <PersonAddAlt1Icon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={e.firstname}
                                secondary={
                                  <React.Fragment>
                                    <Typography
                                      sx={{ display: "inline" }}
                                      component="span"
                                      variant="body2"
                                      color="lightblue"
                                    >
                                      {e.id}
                                    </Typography>
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </Lane>
          ))}
        </Box>
      </DragDropContext>
      {/* </div> */}
    </React.Fragment>
  );
}

export default EmployeeCellPlanDnd;
// Put the things into the DOM!
//ReactDOM.render(<App />, document.getElementById('root'));

/*import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Tooltip,
  ListItemAvatar,
  Avatar,
  Grid,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
// Define the initial data
const initialData = {
  tasks: [
    { id: "task-1", content: "Task 1" },
    { id: "task-2", content: "Task 2" },
    // More tasks...
  ],
};
const initialData2 = {
  tasks: [
    { id: "task-3", content: "Task 3" },
    { id: "task-4", content: "Task 4" },
    // More tasks...
  ],
};

// Define the App component
function EmployeeCellPlanDnd() {
  const [data, setData] = React.useState(initialData);
  const [data2, setData2] = React.useState(initialData2);

  // Handle the drag end event
  const handleDragEnd = (result) => {
    // TODO: Update the state based on the result
  };

  return (
    <Grid container>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid item xs={2} xl={2} lg={2}>
          <Droppable droppableId="droppable" style={{ transform: "none" }}>
            {(provided) => (
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Nested List Items
                  </ListSubheader>
                }
              >
                {data.tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <Tooltip title="Drag Me">
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={
                            snapshot.isDragging
                              ? { background: "rgb(235,235,235)" }
                              : { background: "purple" }
                          }
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <PersonAddAlt1Icon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText> {task.content}</ListItemText>
                        </ListItem>
                      </Tooltip>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </Grid>


        <Grid item xs={2} xl={2} lg={2}>
          <Droppable droppableId="droppable2" style={{ transform: "none" }}>
            {(provided) => (
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Cell1
                  </ListSubheader>
                }
              >
                {" "}
                {data2.tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <Tooltip title="Drag Me">
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={
                            snapshot.isDragging
                              ? { background: "rgb(235,235,235)" }
                              : { background: "purple" }
                          }
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <PersonAddAlt1Icon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText> {task.content}</ListItemText>
                        </ListItem>
                      </Tooltip>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </Grid>
      </DragDropContext>
    </Grid>
  );
}

export default EmployeeCellPlanDnd;
*/
