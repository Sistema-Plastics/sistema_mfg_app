import React, { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  //TODO: remove TablePagination,
  TableHead,
  FormControlLabel,
  Grid,
} from "@mui/material";

import { CSVLink } from "react-csv";
import ShiftScheduleHeader from "./ShiftScheduleHeader";
import CellList from "./CellList";
import { mattecHelpers } from "../../helpers/MattecHelper";
import { connections } from "../../config/ConnectionBroker";
import { mqttFunctions } from "./../../helpers/HelperScripts";

import { styled } from "@mui/material/styles";
import { muiThemes } from "../../assets/styling/muiThemes";
import useTheme from "@mui/material/styles/useTheme";
import { tableCellClasses } from "@mui/material/TableCell";


import mqtt from "mqtt";
//https://www.hivemq.com/blog/ultimate-guide-on-how-to-use-mqtt-with-node-js/ 

// https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette.info
// https://mui.com/material-ui/customization/color/#2014-material-design-color-palettes

const tableTheme = muiThemes.getSistemaTheme();

const CellsTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: tableTheme.palette.cells.main,
    color: tableTheme.palette.cells.contrastText,
    // borderBottom: "none",
    borderBottom: "0.5rem solid",
    paddingBottom: 8,
    paddingTop: 8,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// var mqtt = require("mqtt");

const ShiftSchedule = (props) => {
  //#region  variables

  const nextJobsRawDS = useRef();
  const masterBatchRawDS = useRef();
  const shiftExceptionsRawDS = useRef();
  const resinRawDS = useRef();
  const jobScheduleRawDS = useRef();
  const mattecRTRawDS = useRef();
  const shiftCalculatorRTRawDS = useRef();
  const machineJobsRTRawDS = useRef();
  const epicorJobsRawDS = useRef();
  const activeLabRawDS = useRef();

  const [pageInit, setPageInit] = useState(false);
  //TODO: remove  const [refreshCnt, setRefreshCnt] = useState(0);

  const filters = useRef({
    cells: [],
    mc: "",
    shift: {},
    jobID: "",
    showNonRunners: false,
    showMcStatus: false,
  });

  const [datasets, setDatasets] = useState();
  //TODO: remove  const params = new URLSearchParams(document.location.search);
  //TODO: remove  const machineID = params.get("cellID"); //.toLowerCase();

  //#endregion

  //#region MQTT Connect
  const tpcRoot = connections.getBaseMQTTTopicFromPort();
  const thisHost = mqttFunctions.getHostname();
  const [client, setClient] = useState(null);
  var options = mqttFunctions.getOptions();
  const topics = {
    shiftExceptions: tpcRoot + "systemdata/dashboards/mattec/shiftexceptions",
    nextJobs: tpcRoot + "systemdata/dashboards/mattec/nextjobs",
    masterbatch: tpcRoot + "systemdata/dashboards/epicor/masterbatchlist",
    jobSchedule: tpcRoot + "systemdata/dashboards/epicor/jobschedule",
    resin: tpcRoot + "systemdata/dashboards/epicor/materiallist",
    mattecRt: tpcRoot + "systemdata/dashboards/mattec/realtime",
    shiftCalculator: tpcRoot + "systemdata/dashboards/mattec/shiftcalculator",
    machineJobs: tpcRoot + "systemdata/dashboards/mattec/machinejobinfo",
    epicorJobs: tpcRoot + "systemdata/dashboards/epicor/jobs",
    activeLabour: tpcRoot + "systemdata/dashboards/epicor/activelabour",
  };
  const sistTheme = useTheme();
  
  const mqttConn = (host, mqttOption) => {
    setClient(mqtt.connect(host, mqttOption));
  };

  useEffect(() => {
    //only fire on initial load
    mqttConn(thisHost, options);
    return () => {
      // cancel the subscription
       console.log("need to disconnect client")
       if(client) client.end()
  };
  }, []);

  useEffect(() => {
    //fire on client change
    //console.log("ShiftSchedule UseEffect Client");
    if (client) {
      client.on("connect", () => {
        mqttSub({ topic: topics.shiftExceptions, qos: 0 });
        mqttSub({ topic: topics.masterbatch, qos: 0 });
        mqttSub({ topic: topics.nextJobs, qos: 0 });
        mqttSub({ topic: topics.jobSchedule, qos: 0 });
        mqttSub({ topic: topics.resin, qos: 0 });
        mqttSub({ topic: topics.mattecRt, qos: 0 });
        mqttSub({ topic: topics.shiftCalculator, qos: 0 });
        mqttSub({ topic: topics.machineJobs, qos: 0 });
        mqttSub({ topic: topics.epicorJobs, qos: 0 });
        mqttSub({ topic: topics.activeLabour, qos: 0 });
      });
      client.on("message", (topic, message) => {
        // setConnectStatus("Connected");
        console.log("updated topic : " + topic);
        var tmp = JSON.parse(message.toString()).value;
        switch (topic) {
          case topics.masterbatch:
            masterBatchRawDS.current = tmp;
            break;
          case topics.nextJobs:
            nextJobsRawDS.current = tmp;
            break;
          case topics.shiftExceptions:
            shiftExceptionsRawDS.current = tmp;
            break;
          case topics.jobSchedule:
            jobScheduleRawDS.current = tmp;
            break;
          case topics.resin:
            resinRawDS.current = tmp;
            break;
          case topics.mattecRt:
            mattecRTRawDS.current = tmp;
            break;
          case topics.shiftCalculator:
            shiftCalculatorRTRawDS.current = tmp;
            break;
          case topics.machineJobs:
            machineJobsRTRawDS.current = tmp;
            break;
          case topics.epicorJobs:
            epicorJobsRawDS.current = tmp;
            break;
          case topics.activeLabour:
            activeLabRawDS.current = tmp;
            break;
          default:
        }

        //only set state once all data is in, hsould then fire re-render
        if (
          shiftExceptionsRawDS.current &&
          nextJobsRawDS.current &&
          masterBatchRawDS.current &&
          jobScheduleRawDS.current &&
          resinRawDS.current &&
          mattecRTRawDS.current &&
          shiftCalculatorRTRawDS.current &&
          machineJobsRTRawDS.current &&
          epicorJobsRawDS.current &&
          activeLabRawDS.current
        ) {
          //console.log("Datasets filled");
          setPageInit(true);
        }
        if (pageInit) buildDataSets();
      });
      client.on("error", (err) => {
        //console.error("Connection error: ", err);
        client.end();
      });
      client.on("reconnect", () => {
        // setConnectStatus("Reconnecting");
      });
      client.on("disconnect", () => {
        console.log("disconnected")
        // setConnectStatus("Reconnecting");
      });
      
    }
  }, [client]);

  const mqttSub = (subscription) => {
    if (client) {
      // topic & QoS for MQTT subscribing
      const { topic, qos } = subscription;
      console.log(`Subscribing to : ${topic}`)
      // subscribe topic
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
      });
    }
  };

  //#endregion

  //#region  use effects
  useEffect(() => {
    //only fire on initial load
    if (pageInit) {
      //console.log("ShiftSchedule useEffect pageInit");
      buildDataSets();
    } else {
    }
  }, [pageInit]);

  useEffect(() => {
    //console.log("ShiftSchedule useEffect datasets");
  }, [datasets]);

  //#endregion

  const buildDataSets = () => {
    let tmpval = {
      //dataset holders
      masterbatch: {},
      resin: {},
      mattecRt: {},
      nextJobs: {},
      machineJobs: {},
      jobSchedule: {},
      shiftExceptions: {},
      shiftCalculator: {},
      //reformated lists from dataset holders
      cellList: {},
      jobList: {},
      machineList: [],
    };

    //add retrieved datasets
    tmpval.masterbatch = masterBatchRawDS.current;
    tmpval.resin = resinRawDS.current;
    tmpval.mattecRt = mattecRTRawDS.current;
    tmpval.nextJobs = nextJobsRawDS.current;
    tmpval.machineJobs = machineJobsRTRawDS.current;
    tmpval.jobSchedule = jobScheduleRawDS.current;
    tmpval.shiftExceptions = shiftExceptionsRawDS.current;
    tmpval.shiftCalculator = shiftCalculatorRTRawDS.current;

    //#region  Build Master Data sets

    //Build one unique dataset from all inputs
    //initially take the epicor dataset
    let masterJobArray = epicorJobsRawDS.current
      .filter((j) => j.ResourceID.substring(0, 1).toUpperCase() !== "T")
      .map((j) => {
        const obj = {
          MachNo: j.ResourceID,
          MachID: j.ResourceID,
          DeptNo: j.Cell_c,
          DeptDesc: j.Cell_c,
          DownNo: null,
          DownDesc: "",
          JobID: j.JobNum,
          SeqNo: "10" + j.AssemblySeq + "010", //mimics the data mattec appends so that we can compare
          AssemblySeq: j.AssemblySeq,
          PartID: j.PartNum,
          PartDesc: j.PartDescription,
          StartDateTime: getDateTime(j.MattecStartDate, j.MattecStartHour),
          EndDateTime: getDateTime(j.MattecEndDate, j.MattecEndHour),
          QtyRequired: j.ProdQty,
          QtyCompleted: j.QtyCompleted,
          QtyPerPallet: j.QtyPerPallet_c,
          QtyPerCarton: j.QtyPerCarton_c,
          IUM: j.IUM,
          Rev: j.RevisionNum,
          McRunning: true,
          ProdCrewSize: j.ProdCrewSize,
          TimeToGo: 0,
          lvl: -1,
          /*
           *returned field list at bottom of page
           */
        };
        return obj;
      });

    //Sort the master array by McID
    masterJobArray = masterJobArray.sort(mcSort);

    //merge in data for clocked in employees to set Assy jobs as running
    //1. get a unique list of jobs clocked into
    const runningAssyJobs = [
      ...new Map(
        activeLabRawDS.current.map((item) => [item["JobNum"], item])
      ).values(),
    ];

    //2. set EPCIOR jobs to running if they're clocked into
    masterJobArray = masterJobArray.map((rt) => {
      const obj = Object.assign({}, rt);
      const matchRunning = runningAssyJobs.filter(
        (j) => j.JobNum === obj["JobID"] && j.AssemblySeq === obj["AssemblySeq"]
      );
      //if no returns that means job is not clocked into so set running to false and DownInfo
      if (matchRunning.length === 0) {
        obj.McRunning = false;
        obj.DownNo = 1;
        obj.DownDesc = "Line Not Running";
      } else {
        //if logged into set as running job
        obj.lvl = 0;
      }

      return obj;
    });

    //3. same action using Mattec RT data to set running if scheduled to run
    masterJobArray = masterJobArray.map((rt) => {
      const obj = Object.assign({}, rt);

      //need to match both job no and the asm seq
      const mtObj = mattecRTRawDS.current.filter(
        (j) =>
          j.JobID &&
          j.JobID.trim().substring(0, j.JobID.trim().length - 6) ===
            obj.JobID &&
          j.JobID.trim().substring(
            j.JobID.trim().length - 6,
            j.JobID.trim().length
          ) === obj.SeqNo
      );
      //if returned match matted data
      if (mtObj.length > 0) {
        obj["McRunning"] = mtObj[0].DownNo === 56 ? false : true;
        obj["DownNo"] = mtObj[0].DownNo;
        obj["DownDesc"] = mtObj[0].DownDesc;
        obj["MachID"] = mtObj[0].MachID.trim();
        obj["MachNo"] = mtObj[0].MachNo;
        obj["DeptNo"] = mtObj[0].DeptNo;
        obj["DeptDesc"] = mtObj[0].DeptDesc;
        obj["PartID"] = mtObj[0].PartID.trim();
        obj["PartDesc"] = mtObj[0].PartDesc.trim();

        obj["lvl"] = 0;

        //get data from Mattec MachineJobs to merge to Epciro Data
        const mcJob = tmpval.machineJobs.filter(
          (m) => m.MachNo === mtObj[0].MachNo && m.JobID === mtObj[0].JobID
        );

        if (mcJob.length > 0) {
          //updatre Compl Qty from Mattec Data
          obj["QtyCompleted"] =
            parseFloat(mcJob[0].SchedQty) - parseFloat(mcJob[0].qtyToGo);
          obj["TimeToGo"] = new Date(mcJob[0].timToGo * 1000)
            .toISOString()
            .slice(11, 19);
        }
      }
      return obj;
    });

    //4. now process the next jobs array and merge data to master jobs array
    masterJobArray = masterJobArray.map((rt) => {
      const obj = Object.assign({}, rt);
      //need to match both job no and the asm seq
      const njObj = nextJobsRawDS.current.filter(
        (j) =>
          j.JobID &&
          j.JobID.trim().substring(0, j.JobID.trim().length - 6) ===
            obj.JobID &&
          j.JobID.trim().substring(
            j.JobID.trim().length - 6,
            j.JobID.trim().length
          ) === obj.SeqNo
      );
      if (njObj.length > 0) {
        obj["MachID"] = njObj[0].MachID.trim();
        obj["MachNo"] = njObj[0].MachNo;
        obj["DeptNo"] = njObj[0].DeptNo;
        obj["DeptDesc"] = njObj[0].DeptName;
        obj["PartID"] = njObj[0].PartID.trim();
        obj["PartDesc"] = njObj[0].PartDesc.trim();
        obj["lvl"] = njObj[0].LvlOfNext;
      } else {
        console.log("Next Job Not Found" + obj.JobID);
      }
      return obj;
    });

    //Now refrsh all jobs and highlight running machnes.
    //5. geta unique list of running machines

    const runningMCs = masterJobArray
      .filter((mc) => mc.McRunning)
      .map((mc) => mc.MachID);

    //6. now change the value of each job to assign if teh mc is running

    masterJobArray = masterJobArray.map((mc) => {
      const obj = Object.assign({}, mc);
      runningMCs.includes(obj["MachID"])
        ? (obj["McRunning"] = true)
        : (obj["McRunning"] = false);

      runningMCs.includes(obj["MachID"])
        ? (obj["DownDesc"] = null)
        : (obj["Do=wnDesc"] = obj["DownDesc"]);

      //we can map on Mast batch here
      const jobMBatch = tmpval.masterbatch.filter(
        (mb) => mb.JobNum === obj["JobID"]
      );
      //and the tool
      //first get runnninh
      let jobToolID = tmpval.machineJobs.filter(
        (mj) => mj.JobID.includes(obj["JobID"]) && mj.MachNo === obj["MachNo"]
      );
      //now get next jobs if empty
      jobToolID.length > 0
        ? (jobToolID = jobToolID)
        : (jobToolID = tmpval.nextJobs.filter(
            (mj) =>
              mj.JobID.includes(obj["JobID"]) && mj.MachNo === obj["MachNo"]
          ));

      jobMBatch.length > 0
        ? (obj["MasterBatch"] = jobMBatch[0].PartNum.trim())
        : (obj["MasterBatch"] = "");
      jobToolID.length > 0
        ? (obj["ToolID"] = jobToolID[0].MoldID.trim())
        : (obj["ToolID"] = "");
      return obj;
    });

    //99.finish master job array
    tmpval.jobList = masterJobArray;

    //#endregion Build Master Data sets

    //Now that we have a concise Job list we can create Machine and Cell Lists

    //#region
    //get machine list

    //1st go thorugh the epicor jobs
    tmpval.machineList = [
      ...new Map(
        tmpval.jobList.map((item) => [
          item["MachID"],
          {
            MachNo: item.MachNo,
            MachID: item.MachID,
            DeptNo: item.DeptNo,
            DeptDesc: item.DeptDesc,
            DownNo: item.DownNo,
            DownDesc: item.DownDesc,
            McRunning: item.McRunning,
          },
        ])
      ).values(),
    ];

    //now go through the mattec list and update/add where necessary

    tmpval.machineList = tmpval.machineList.map((m) => {
      const obj = Object.assign({}, m);
      const tmp = mattecRTRawDS.current.filter((mt) => mt.MachID === m.MachID);
      if (tmp.length > 0) {
        obj["DeptNo"] = tmp[0].DeptNo;
        obj["DownNo"] = tmp[0].DownNo;
        obj["DownDesc"] = tmp[0].DownDesc == null ? null : tmp[0].DownDesc;
        obj["MachNo"] = tmp[0].MachNo;
      }
      return obj;
    });

    //get cell list
    tmpval.cellList = mattecHelpers.getCellsFromRT(tmpval.machineList);
    // tmpval.cellList = mattecHelpers.getCellsFromRT(tmpval.jobList);

    // We now have mast lists for JobList, Cel List and Machine List
    // We can now filter the master lists based on settings

    //If the Job Id filter is active we want to strip teh job list down to only those jobs
    //init an array to hold the filtered list of jobs
    let filteredJobList = tmpval.jobList;

    if (filters.current.jobID !== "")
      filteredJobList = tmpval.jobList.filter(
        (rt) => rt.JobID === filters.current.jobID
      );

    //As non runners and job/shift filters are exclusive filter based on teh original array.
    // This is for teh openeing rednder of the schedule
    if (!filters.current.showNonRunners)
      filteredJobList = tmpval.jobList.filter((rt) => rt.McRunning);

    //if showong non runners filer on temp array from cell filtered list, else filter full list
    if (filters.current.cells.length > 0)
      filters.current.showNonRunners
        ? (filteredJobList = tmpval.jobList.filter((rt) =>
            filters.current.cells.includes(rt.DeptNo.toString())
          ))
        : (filteredJobList = filteredJobList.filter((rt) =>
            filters.current.cells.includes(rt.DeptNo.toString())
          ));

    //set shift info

    //if shift is selected buld data set from master job list
    //When the date comes in , set a start time and end time

    //Set shift offset to no seconds
    if (filters.current.shift.shift != null) {
      let shiftStartOffset, shiftEndOffset;

      switch (filters.current.shift.shift) {
        case "M":
          shiftStartOffset = 6 * 60 * 60;
          shiftEndOffset = 14 * 60 * 60;
          break;
        case "A":
          shiftStartOffset = 14 * 60 * 60;
          shiftEndOffset = 22 * 60 * 60;
          break;
        case "N":
          shiftStartOffset = 22 * 60 * 60;
          shiftEndOffset = 30 * 60 * 60;
          break;
        default:
      }
      //to avoid updating the Filetr time due to byref change, convert to unix then back again
      const shiftStart = new Date(
        (Math.floor(filters.current.shift.shiftDate.getTime() / 1000) +
          shiftStartOffset) *
          1000
      );

      const shiftEnd = new Date(
        (Math.floor(filters.current.shift.shiftDate.getTime() / 1000) +
          shiftEndOffset) *
          1000
      );
      /*
      Shifts 1. Start before Fin Before, 2. Start After Fin After, 3. Start before Fin within, 
      4. Start within Fin after, 5 Start within Fin Within, 6. Start Before Fin after 
1.     ------- |			|
2.             |      |  ---------
3.	  ---------|--		|
4.		      	 |		--|-----
5.		      	 | ---- |
6.	   ------|----------|------
     */

      //filter out jobs that end before the shift starts , 1.
      const filterList1 = tmpval.jobList.filter(
        (j) => j.EndDateTime.getTime() > shiftStart.getTime()
      );
      //now filter out jobs that start after the shift ends
      const filterList2 = filterList1.filter(
        (j) => j.StartDateTime.getTime() < shiftEnd.getTime()
      );

      filteredJobList = filterList2;
      console.log("");
    }
    //once filtering fiished push back to master list
    tmpval.jobList = filteredJobList;

    // Finally filter the master Cell and Machine list base on JobList
    //use some to filter 1 object array based on another
    tmpval.machineList = tmpval.machineList.filter((item1) =>
      tmpval.jobList.some((item2) => item2.MachNo === item1.MachNo)
    );

    tmpval.cellList = tmpval.cellList.filter((item1) =>
      tmpval.machineList.some((item2) => item2.DeptNo === item1.DeptNo)
    );

    //#endregion

    //now all filteruing is done we can build summaries
    //#region
    //Start with Crew Size

    tmpval.machineList = tmpval.machineList.map((m) => {
      const obj = Object.assign({}, m);
      try {
        const jList = tmpval.jobList.filter((j) => j.MachNo === obj["MachNo"]);
        let mx = 0;

        let tid = jList[0].ToolID;
        let mbid = jList[0].MasterBatch;
        let tchgs = 0;
        let mbchgs = 0;

        for (var i = 0; i < jList.length; i++) {
          if (parseFloat(jList[i].ProdCrewSize) > mx)
            mx = parseFloat(jList[i].ProdCrewSize);
          if (tid !== jList[i].ToolID) {
            tid = jList[i].ToolID;
            tchgs++;
          }
          if (mbid !== jList[i].MasterBatch) {
            mbid = jList[i].MasterBatch;
            mbchgs++;
          }
        }
        obj["MaxCrewSize"] = mx;
        obj["ToolChanges"] = tchgs;
        obj["MBatchChanges"] = mbchgs;
      } catch {
        obj["MaxCrewSize"] = 0;
      } finally {
      }
      return obj;
    });

    //Now sum the cells
    tmpval.cellList = tmpval.cellList.map((c) => {
      const obj = Object.assign({}, c);
      const mcf = tmpval.machineList.filter((m) => m.DeptNo === obj["DeptNo"]);
      let mx = 0;
      let tc = 0;
      let mbc = 0;
      console.log("Summarising cell " + obj["DeptDesc"]);
      for (var i = 0; i < mcf.length; i++) {
        mx += mcf[i].MaxCrewSize;
        tc += mcf[i].ToolChanges;
        mbc += mcf[i].MBatchChanges;
      }
      obj["CellCrewSize"] = mx;
      obj["CellToolChanges"] = tc;
      obj["CellMBatchChanges"] = mbc;
      return obj;
    });
    //#endregion

    setDatasets(tmpval);
    //console.log("Datasets built");
  };

  // #region handlers

  const handleDispNonRunnersCallBack = (val) => {
    filters.current.showNonRunners = val;
    buildDataSets();
  };

  const handleCellFiltersCallback = (val) => {
    filters.current.cells = val;
    buildDataSets();
  };

  const handleJobFiltersCallback = (val) => {
    //reset other filters to base values
    filters.current.showNonRunners = true;
    filters.current.cells = [];
    filters.current.shift = {};
    //set job no
    filters.current.jobID = val;
    buildDataSets();
  };

  const handleShiftFiltersCallback = (val) => {
    //reset other filters to base values
    filters.current.showNonRunners = true;
    filters.current.cells = [];
    filters.current.jobID = "";

    //set shift data
    filters.current.shift = val;

    buildDataSets();
  };
  //#endregion

  //#region Functions
  const getDateTime = (dateStr, timeStr) => {
    let dt = new Date(dateStr);
    const hr = timeStr.substring(0, timeStr.indexOf("."));
    const min = timeStr.substring(timeStr.indexOf(".") + 1);
    dt.setHours(hr);
    dt.setMinutes(min);
    return dt;
  };

  const mcSort = (a, b) => {
    if (a.MachNo < b.MachNo) {
      return -1;
    }
    if (a.MachNo > b.MachNo) {
      return 1;
    }
    return 0;
  };
  //#endregion

  let crewReq = 0,
    toolchgs = 0,
    mbatchchgs = 0;

  if (typeof datasets != "undefined") {
    crewReq = datasets.cellList.reduce((a, b) => a + b.CellCrewSize, 0);
    toolchgs = datasets.cellList.reduce((a, b) => a + b.CellToolChanges, 0);
    mbatchchgs = datasets.cellList.reduce((a, b) => a + b.CellMBatchChanges, 0);
  }

  return pageInit && typeof datasets != "undefined" ? (
    <React.Fragment>
      {console.log("Init Render")}
      {console.log(datasets)}
      <ShiftScheduleHeader
        datasets={datasets}
        filters={filters.current}
        dispNonRunnersCallback={handleDispNonRunnersCallBack}
        cellFiltersCallBack={handleCellFiltersCallback}
        jobFilterCallBack={handleJobFiltersCallback}
        shiftFilterCallBack={handleShiftFiltersCallback}
      />
      <Grid container>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          <Grid
            item
            sx={{ marginBottom: 2, justifyItems: "start", alignItems: "start" }}
            xl={2}
            lg={3}
            md={3}
            sm={3}
            xs={3}
          >
            <FormControlLabel
              control={
                <CSVLink
                  data={datasets.jobList}
                  filename={"SHiftSchedule.csv"}
                  target="_blank"
                >
                  Download Machine Data
                </CSVLink>
              }
              sx={{
                "& > a": {
                  //backgroundColor: sistTheme.palette.sistema.microwave.main,
                  color: sistTheme.palette.sistema.klipit.contrastText,
                  textDecorationLine: "none",
                },
              }}
            ></FormControlLabel>
          </Grid>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 640 }}>
              <Table size="small" stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow sx={{ width: "100%" }}>
                    <CellsTableCell>
                      Max Crew Size :<b>{crewReq}</b> - Total Tool Changes :
                      <b>{toolchgs}</b> - Total MasterBatch Changes :
                      <b>{mbatchchgs}</b>
                    </CellsTableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ width: "100%" }}>
                  <TableRow sx={{ width: "100%" }}>
                    {<CellList datasets={datasets} />}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Typography>
      </Grid>
    </React.Fragment>
  ) : (
    <React.Fragment>{/* {console.log("Empty Render")} */}</React.Fragment>
  );
};

export default ShiftSchedule;

/* 
         "Cell_c": "001",
        "JobNum": "A0318964",
        "PartNum": "3001999",
        "PartDescription": "Cover SML Twist V2 BLU Tint Lunch",
        "IUM": "EA",
        "RevisionNum": "A-LCY",
        "ProdQty": 72000,
        "QtyCompleted": 67136,
        "WIPQty": 4864,
        "ResourceID": "A05",
        "OprSeq": 10,
        "MattecStartDate_c": "2024-01-09T00:00:00",
        "MattecStartDate": "2024-01-09T00:00:00",
        "MattecStartHour_c": "18.82",
        "MattecStartHour": "18.82",
        "MattecEndDate_c": "2024-01-09T00:00:00",
        "MattecEndDate": "2024-01-09T00:00:00",
        "MattecEndHour_c": "21.53",
        "MattecEndHour": "21.53",
        "ProdStd": "4.00000000",
        "TimeLeft": "20.266666666666666",
        "Description": "A05 130T Group B 4634",
        "ResourceGrpID": "CL1-130T",
        "JCDept": "MACH",
        "OutputBinNum": "RB20",
        "OutputWhse": "7",
        "SetUpCrewSize": "1.00",
        "ProdCrewSize": "0.25",
        "OpCode": "OA0232",
        "OpDesc": "Cover SML Twist",
        "SetupLabRate": "0.000000",
        "JCDept_Description": "Machines Department",
        "LaborEntryMethod": "Q",
        "AssemblySeq": 0,
        "QtyPerPallet_c": 36000,
        "QtyPerCarton_c": 750,
        "EstSetHours": "1.75",
        "ReceivedQty": "36000.00000000",
        "QtyPerPallet": "36000",
        "InputBinNum": "SB70",
        "LastChangedBy": "",
        "LastChangedOn": null, 
        */
