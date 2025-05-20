//This is the page where Drag and drop of employees are saved to Cell_c
import React, { useEffect, useRef, useContext,useState } from "react";
//import { Routes, Route, useParams } from "react-router-dom";
//import { SistemaContext } from "../../assets/components/SistemaHeader";
import { SistemaContext } from "../../../assets/components/SistemaHeader";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { json, useSearchParams } from "react-router-dom";
import {  Box,  Button,  Dialog,  DialogTitle,  FormControl,  FormControlLabel,  Grid,  Typography,  TextField,  Table,  TableRow,  TableCell,  TableBody,  Tooltip,  Link, List,  ListItem,  ListItemAvatar,  Avatar,  ListItemText,} from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { connections } from "../../../config/ConnectionBroker";
import {  mqttFunctions,  operationsFunctions,} from "../../../helpers/HelperScripts";
import { helperfunctions } from "../../../assets/scripts/helperfunctions";
import assyEmployees from "../assyData/EmpList";
import assyShifts from "../assyData/Shifts";
import {  RowDataTableCell,  RowHdrTableCell,} from "../../../assets/styling/muiThemes";
import { muiThemes } from "../../../assets/styling/muiThemes";
import mqtt from "mqtt";
import { amber, grey, yellow } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";

import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { HomeRepairServiceSharp } from "@mui/icons-material";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import KeyboardReturnOutlinedIcon from "@mui/icons-material/KeyboardReturnOutlined";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

const sistTheme = muiThemes.getSistemaTheme();

// import moment from "moment";
// import Axios from "axios";
// import { baseURL } from "../../../ConnectionBroker";
// import { Link, useLocation } from "react-router-dom";
// import { axiosConfigs } from "../../../helpers/HelperScripts";
// import { Container, Spinner, Row, Col } from "react-bootstrap";
// import { BiSave, BiArrowBack } from "react-icons/bi";
// import Board from "react-trello";

// import { dragDropFunctions } from "../../../helpers/HelperScripts";

// import Title from "../../../assets/components/Title";
// import PageAlert from "../../../assets/components/Alerts";
// import MyLaneHeader from "../assyComponents/LaneHeader";

// import assyCells from "../assyData/Cells";
// import assyEmployees from "../assyData/EmpList";
// import cellCrewSize from "../assyData/CellCrewSize";

// import { MyScrollableLane, loaderStyle } from "../../../assets/styling/Base";
// import "../../../App.css";
// import "../../../index.css";
// import "../../../assets/styling/Element.css";

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

const ColumnHeaderItem = styled(Paper)(({ theme }) => ({
  backgroundColor: grey[500], //theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.tableCellHeading,
  margin: 0,
  marginTop: 5,
  borderRadius: 0,
  // padding: theme.spacing(1),
  paddingLeft: 10,
  paddingRight: 10,
  textAlign: "left",
  color: theme.palette.sistema.klipit.contrastText,
}));
const ColumnDataItem = styled(Paper)(({ theme }) => ({
  backgroundColor: grey[50], //theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.tableCellData,
  borderRadius: 0,
  // padding: theme.spacing(1),
  margin: 0,
  paddingLeft: 10,
  paddingRight: 10,
  textAlign: "left",
  color: theme.palette.sistema.klipit.light,
  minWidth: 250,
  maxWidth: 330,
}));

const RowHeaderItem = styled(Paper)(({ theme }) => ({
  backgroundColor: grey[500], //theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.subtitle1,
  margin: 0,
  marginTop: 5,
  borderRadius: 0,
  // padding: theme.spacing(1),
  paddingLeft: 10,
  paddingRight: 10,
  textAlign: "left",
  width: 250,
  color: theme.palette.sistema.klipit.contrastText,
}));
const RowDataItem = styled(Paper)(({ theme }) => ({
  backgroundColor: grey[100], //theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.tableCellData,
  borderRadius: 0,
  // padding: theme.spacing(1),
  margin: 0,
  paddingLeft: 10,
  paddingRight: 10,
  textAlign: "left",
  color: theme.palette.sistema.klipit.light,
  minWidth: 150,
  maxWidth: 630,
}));

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `0px solid ${theme.palette.divider}`,
  margin: 0,
  padding: 0,
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon
        sx={{
          display: "flex",
          fontSize: "0.9rem",
          color: "blue",
          marginRight: 1,
        }}
      />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "transparent",
  // backgroundColor:
  //   theme.palette.mode === 'dark'
  //     ? 'rgba(255, 255, 255, .05)'
  //     : 'rgba(0, 0, 0, .03)',
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    // marginLeft: theme.spacing(1),
    margin: 0,
  },
  "& .MuiAccordionSummary-content": {
    // marginLeft: theme.spacing(1),
    margin: 0,
  },
}));

const iconSX = {
  fontSize: 40,
  color: sistTheme.palette.sistema.klipit.light,
};

export default function ProductionBooking() {
  const sistemaContext = useContext(SistemaContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false); //setting to true avoids teh flkashing of the dialog wehn initially rendering. Set to False after datasets populated
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [dataComplete, setDataComplete] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobCrew, setJobCrew] = useState(null);
  const [lineErr, setLineErr] = useState(true);


  const [jobs, setJobs] = useState(null);
 
  const [employeeColumns, setEmployeeColumns] = useState({
    available: { title: "Available Employees", items: [] },
    clockedin: { title: "Clocked In Employees", items: [] },
    onbreak: { title: "Employees On Break", items: [] },
  });
  const empHelperText = useRef("Employee Number");
  
  const params = new URLSearchParams(document.location.search);
  const mc = params.get("line");
  const machineID = mc ? mc.trim().toUpperCase() : "";

  //only define onbreak as empty array, rendering will happen before this can be filled and this will rpevent errors

  const [datasets, setDatasets] = useState({
    // employees: null,
    // cells: null,
    // jobs: null,

    onbreak: [],
  });

  let topics = [
    "systemdata/dashboards/epicor/employeeslist",
    // "systemdata/dashboards/epicor/empclockin",
    "systemdata/dashboards/epicor/activelabour",
    "systemdata/dashboards/epicor/cells",
    // "systemdata/dashboards/epicor/shifts",
    "systemdata/dashboards/epicor/assycrewsize",
    "systemdata/dashboards/epicor/jobsallops",
    // "+/+/employees/onbreak", //cannot log these at startup as no line is yet known
  ];

  const theme = useTheme();

  // //now add bse topic as prefx
  const baseTopic = connections.getBaseMQTTTopicFromPort();
  topics = topics.map((m) => baseTopic + m);
  
  useEffect(() => {
      let title = "Assembly Production Booking";
      if (machineID) title += ` ${machineID}`;
      sistemaContext.setPageTitle(title);
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
    if (client === null) return;

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

      //handle systems data messages
      if (topic.includes("systemdata")) {
        const msg = JSON.parse(message.toString()).value;
        switch (true) {
          case topic.includes("employeeslist"):
            //set teh comparioson list. this will be used when passing back to erp to filter out changes
            // setDatasets((prevState) => {
            //   return { ...prevState, origemployees: assyEmployees(null, msg) };
            // });
            // //set the list that will change
            // setDatasets((prevState) => {
            //   return { ...prevState, employees: assyEmployees(null, msg) };
            // });
            setDatasets((prevState) => {
              return { ...prevState, employees: msg };
            });
            break;

          case topic.includes("activelabour"):
            setDatasets((prevState) => {
              return { ...prevState, activelabour: msg };
            });
            break;
          // case topic.includes("empclockin"):
          //   setDatasets((prevState) => {
          //     return { ...prevState, clockins: msg };
          //   });
          //   break;
          // case topic.includes("shifts"):
          //   // tmpDatasets.current.machinedata = msg;
          //   setDatasets((prevState) => {
          //     return { ...prevState, shifts: assyShifts(msg) };
          //   });
          //   break;
          case topic.includes("assycrewsize"):
            setDatasets((prevState) => {
              return { ...prevState, assycrewsizes: msg };
            });
            break;
          case topic.includes("jobsallops"):
            setDatasets((prevState) => {
              return { ...prevState, jobs: msg };
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
        //now unsubscibe from topic to prevent unwanted updates
        client.unsubscribe(topic, function (resp) {
          resp === null
            ? console.log("unsubscribed: " + topic)
            : console.log("unsubscribed error: " + resp);
        });
      } else {
        //populate datasets for this resources when known
        //These should be after the line is set as
        //theyre subscribed ot in teh reource useEffect

        if (topic.includes("onbreak")) {
          setDatasets((prevState) => {
            return { ...prevState, onbreak: JSON.parse(message.toString()) };
          });
        }

        console.log(
          `topic ${topic} message ${JSON.stringify(
            JSON.parse(message.toString())
          )} `
        );
      }
    });
  }, [client]);

  useEffect(() => {
    //when connected subscribe to the topics
    if (isConnected) {
      topics.forEach((topic) => {
        client.subscribe(topic, function () {
          console.log("subscribed to ", topic);
        });
      });

      // for (var i = 0; i < topics.length; i++) {
      //   client.subscribe(topics[i], function () {
      //     console.log("subscribed to ", topics[i]);
      //   });
      // }
    }
  }, [isConnected]);

  useEffect(() => {
    //when datsets are filled we can now get real
    if (
      typeof datasets.employees !== "undefined" &&
      typeof datasets.cells !== "undefined" &&
      typeof datasets.activelabour !== "undefined" &&
      // typeof datasets.onbreak !== "undefined" &&
      typeof datasets.assycrewsizes !== "undefined" &&
      typeof datasets.jobs !== "undefined"
    ) {
      // setMaxLineCrewSize();
      setDataComplete(true);
      if (searchParams.get("line") !== null) {
        const l = searchParams.get("line");

        let jc = datasets.assycrewsizes.filter((a) => a.ResourceID.toUpperCase()=== l.toUpperCase())[0];

        let el = datasets.employees.filter(
          (e) => e.ResourceGrpID === jc.ResourceGrpID
        );

        let act = datasets.activelabour.filter(
          (e) => e.ResourceID === jc.ResourceID
        );

        //Filter out of available the already assigned. Has to be on full
        //active labour dataset to make sure we dont see other machine assignments
        el = el.filter(
          (e) =>
            datasets.assycrewsizes.filter((ac) => ac.EmployeeNum === e.EmpID)
              .length == 0
        );

        setEmployeeColumns({
          ...employeeColumns,
          ["available"]: {
            ...employeeColumns.available,
            items: el,
          },
          ["clockedin"]: {
            ...employeeColumns.clockedin,
            items: act,
          },
        });

        const jb = datasets.jobs.filter(
          (jb) =>
            jb.JobNum == jc.JobNum &&
            jb.OprSeq == jc.OprSeq &&
            jb.AssemblySeq == jc.AssemblySeq
        )[0];
        jc.OpCode = jb.OpCode;
        jc.OpDesc = jb.OpDesc;
        jc.JCDeptDescription = jb.JCDeptDesc;
        jc.OpCodeOpDesc = jb.OpCodeOpDesc;
        jc.Company = jb.Company;

        setJobCrew(jc);

        handleLogIn(l);
      } else {
        //  setIsLoggedIn(false);
      }
    }
  }, [datasets]);

  //subscribe to the OnBreak topic when we know teh resource
  useEffect(() => {
    //when datsets are filled we can now get real
    if (jobCrew) {
      //subscribe to topic

      const tpc =
        baseTopic + `+/${jobCrew.ResourceID.toLowerCase()}/employees/onbreak`;
      client.subscribe(tpc, function () {
        console.log("subscribed to ", tpc);
      });
    }
  }, [jobCrew]);

  useEffect(() => {
    //get each lines max crewsize for jobs where startdate
    //is less than or equalk to today
    // if (dataComplete) setMaxLineCrewSize(null);
    console.log("useEffect dataComplete");
  }, [dataComplete]);

  const handleLogIn = (loginLine) => {
    setIsLoggedIn(true);
    //get current job
    //filter jobs for current resource

    //if no login line is passed we get it from the state
    if (loginLine === null) loginLine = jobCrew.ResourceID;
    let v = datasets.jobs.filter((j) => j.ResourceID === loginLine);
    //if we have jobs returned, get earliest
    if (v.length > 0) {
      v.sort((a, b) => {
        let adate = new Date(a.MattecStartDate);
        let bdate = new Date(b.MattecStartDate);
        adate.setHours(
          a.MattecStartHour.substring(0, a.MattecStartHour.indexOf("."))
        );
        bdate.setHours(
          b.MattecStartHour.substring(0, b.MattecStartHour.indexOf("."))
        );
        return adate.getTime() - bdate.getTime();
      });
      //now the jobs are oin dfate getSectionOrder, if
      //If we are sent a job in teh querystring, split the list at that point
      if (searchParams.get("job") !== null) {
        //check that the job exists
        try {
          const tgtJob = v.filter(
            (j) => j.JobNum === searchParams.get("job")
          )[0];

          //if so now filter from that date/tim onwards, taget job will then be [0] and next job [1]
          v = v.filter(
            (j) =>
              new Date(j.MattecStartDate) >= new Date(tgtJob.MattecStartDate) &&
              parseFloat(j.MattecStartHour) >=
                parseFloat(tgtJob.MattecStartHour)
          );
          console.log("xxx");
        } catch (ex) {}
      }

      //remap all the objects
      let tmpJ = v[0];
      tmpJ.QtyPerPallet = parseFloat(tmpJ.QtyPerPallet);
      tmpJ.QtyPerPallet_c = parseFloat(tmpJ.QtyPerPallet_c);
      tmpJ.QtyPerCarton_c = parseFloat(tmpJ.QtyPerCarton_c);
      tmpJ.SetupLabRate = parseFloat(tmpJ.SetupLabRate);
      tmpJ.SetUpCrewSize = parseFloat(tmpJ.SetUpCrewSize);
      tmpJ.ProdCrewSize = parseFloat(tmpJ.ProdCrewSize);
      tmpJ.ReceivedQty = parseFloat(tmpJ.ReceivedQty);
      tmpJ.EstSetHours = parseFloat(tmpJ.EstSetHours);
      tmpJ.ProdStd = parseFloat(tmpJ.ProdStd);
      tmpJ.TimeLeft = parseFloat(tmpJ.TimeLeft);
      let d = new Date(tmpJ.MattecStartDate);
      d.setHours(
        tmpJ.MattecStartHour.substring(0, tmpJ.MattecStartHour.indexOf(".")),
        tmpJ.MattecStartHour.substring(tmpJ.MattecStartHour.indexOf(".") + 1)
      );

      tmpJ.MattecStartDateTime = d;
      d = new Date(tmpJ.MattecEndDate);
      d.setHours(
        tmpJ.MattecEndHour.substring(0, tmpJ.MattecEndHour.indexOf(".")),
        tmpJ.MattecEndHour.substring(tmpJ.MattecEndHour.indexOf(".") + 1)
      );
      tmpJ.MattecEndDateTime = d;
      // tmpJ.ProdCrewSize = parseFloat(tmpJ.ProdCrewSize);
      // tmpJ.ProdCrewSize = parseFloat(tmpJ.ProdCrewSize);

      //Calc the hours/pallet
      //  1.5 Pce/Min
      //  60/1.5 => 40 Sec/Pce
      //  16 Pce / Pallet x 40 Sec => 640 Secs per Pallet
      //  640 sec / 3600 = 0.1777 Hours per Pallet

      //decimal hour
      tmpJ.HoursPerPalletDc = ((60 / tmpJ.ProdStd) * tmpJ.QtyPerPallet) / 3600; //hours per pallet digital
      //digital hour
      tmpJ.HoursPerPalletDg = helperfunctions.getRealTimefromSeconds(
        (60 / tmpJ.ProdStd) * tmpJ.QtyPerPallet,
        false,
        "hhmmss"
      ); //hours per pallet digital

      let tmpJobs = { firstJob: tmpJ };
      //show next job details if avail
      if (v.length > 1) {
        let tmpJ2 = v[1];
        tmpJobs.nextJob = tmpJ2;
      } else {
        //create empty data for render
        let tmpJ2 = { JobNum: "", ProdCrewSize: "" };
        tmpJobs.nextJob = tmpJ2;
      }

      setJobs(tmpJobs);
    }

    console.log("");
  };

  const handleLineChange = (event) => {
    const val = event.target.value.toUpperCase();

    const lines = new Set(datasets.jobs.map((j) => j.ResourceID.toUpperCase()));
    if (lines.has(val)) {
      setJobCrew(datasets.assycrewsizes.filter((a) => a.ResourceID === val)[0]);
      setLineErr(false);
    } else {
      setLineErr(true);
    }
  };

  const handleReturnFromBreakEnMasse = () => {
    let record = {
      topic: (
        baseTopic + `${jobCrew.Cell_c}/${jobCrew.ResourceID}/employees/onbreak`
      ).toLowerCase(),
      qos: 0,
      retain: true,
      payload: "[]",
      status: "",
    };

    record.status = 0;

    let { topic, qos, retain, payload } = record;
    // payload = JSON.stringify(payload);
    client.publish(topic, payload, { qos, retain }, (error) => {
      if (error) {
        console.log("Publish error: ", error);
      }
    });
  };

  const handleReturnFromBreak = () => {};

  const handleMoveToBreakEnMasse = () => {
    const emps = datasets.activelabour
      .filter(
        (l) =>
          l.ResourceID === jobCrew.ResourceID &&
          datasets.onbreak.filter((ob) => l.EmployeeNum === ob.id).length < 1
      )
      .map((e) => ({
        id: e.EmployeeNum,
        name: e.Name,
        timestamp: new Date().getTime(),
      }))
      .concat(datasets.onbreak);

    const topic = (
      baseTopic + `${jobCrew.Cell_c}/${jobCrew.ResourceID}/employees/onbreak`
    ).toLowerCase();

    setDatasets((prevState) => {
      return { ...prevState, onbreak: emps };
    });

    const payload = JSON.stringify(emps);

    publishMQTT(topic, payload);
  };

  const handleOnDragEnd = (result) => {
    console.log("moving ");
    //    Use this to exit if drag n drop is outside of droppable areas
    try {
      const t1 = result.source.droppableId;
      const t2 = result.destination.droppableId;
    } catch (error) {
      return;
    }

    const { source, destination } = result;

    const from = source.droppableId;
    const to = destination.droppableId;

    let currONB = [];
    if (source.droppableId == destination.droppableId) {
      const column = employeeColumns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setEmployeeColumns({
        ...employeeColumns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    } else {
      let pyld = {}; //`{"JobNum":"${jobCrew.JobNum}", "AssemblySeq":"${jobCrew.AssemblySeq}", "OprSeq":"${jobCrew.OprSeq}"}`

      pyld.EmpID = result.draggableId;
      pyld.JobNum = jobCrew.JobNum;
      pyld.Company = jobCrew.Company;
      pyld.AssemblySeq = jobCrew.AssemblySeq;
      pyld.OprSeq = jobCrew.OprSeq;
      pyld.JCDept = jobCrew.JCDept;
      pyld.ResourceID = jobCrew.ResourceID;
      pyld.ResourceGrpID = jobCrew.ResourceGrpID;
      pyld.OpCode = jobCrew.OpCode;
      pyld.JCDeptDescription = jobCrew.JCDeptDescription;
      pyld.OpCodeOpDesc = jobCrew.OpCodeOpDesc;

      let topic =
        baseTopic + `${jobCrew.ResourceGrpID}/${jobCrew.ResourceID}/employees`;

      const sourceColumn = employeeColumns[source.droppableId];
      const destColumn = employeeColumns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setEmployeeColumns({
        ...employeeColumns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });

      if (from === "available") {
        if (to === "clockedin") {
          //map to avoid byref copy
          // const emp = datasets.employees.filter(
          //   (a) => a.EmpID === result.draggableId
          // )
          console.log("clocking in");
          topic += "/clockin";
        } else {
          console.log("cant move avail to break or back to itsel");
        }
      } else if (from === "onbreak") {
      } else {
        //only option left is from clocked in
      }

      // if (from === "clockedin" && to === "onbreak") {
      //   //map to avoid byref copy
      //   const emp = datasets.activelabour.filter(
      //     (a) => a.EmployeeNum === result.draggableId
      //   )[0];

      //   currONB = [
      //     ...datasets.onbreak,
      //     {
      //       id: result.draggableId,
      //       name: emp.Name,
      //       timestamp: new Date().getTime(),
      //     },
      //   ];
      // } else if (from === "onbreak" && to === "clockedin") {
      //   currONB = datasets.onbreak.filter((ob) => ob.id !== result.draggableId);
      // }
      //  else if (from === "cell" && to === "clockedin") {}
      // const topic = (
      //   baseTopic +
      //   `${jobCrew.ResourceGrpID}/${jobCrew.ResourceID}/employees/onbreak`
      // ).toLowerCase();
      // const payload = JSON.stringify(currONB);

      const payload = JSON.stringify(pyld);
      publishMQTT(topic.toLowerCase(), payload);
    }
    console.log("moved");
  };
  
  const onDragEnd = (result, employeeColumns, setEmployeeColumns) => {
  
  }




  const publishMQTT = (topic, payload) => {
    const qos = 0;
    const retain = true;

    client.publish(topic, payload, { qos, retain }, (error) => {
      if (error) {
        console.log("Publish error: ", error);
      }
    });
  };

  return <React.Fragment>   YES</React.Fragment>;
  }
