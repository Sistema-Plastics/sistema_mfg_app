import React, { useState, useEffect, useRef } from "react";
// import { useRef } from "react";
// import styles from "../../assets/styling/ShiftSchedule.module.css";
import { Grid, Typography } from "@mui/material";

import {
  mqttFunctions,
  mfgDashboardFunctions,
} from "../../helpers/HelperScripts";

import mqtt from "mqtt";

import { muiThemes } from "../../assets/styling/muiThemes";
import { TableRowTypography } from "../../assets/styling/muiThemes";
const tableTheme = muiThemes.getSistemaTheme();

const JobDetails = ({ mcID, datasets, feedback }) => {
  //#region MQTT Connect
  const thisHost = mqttFunctions.getHostname();

  const [client, setClient] = useState(null);

  var options = mqttFunctions.getOptions(
    "jobDetails",
    Math.random().toString(16).substring(2, 8)
  );

  const mqttConn = (host, mqttOption) => {
    // setClient(mqtt.connect(host, mqttOption));
  };
  //#endregion

  const [rtData, setRtData] = useState();
  const [jobData, setJobData] = useState();
  // const [jobReference, setJobReference] = useState();
const jobReference = useRef()

  useEffect(() => {
    //only fire on initial load
    //wont be loading if we dont have datasets so safe to assume theyre populated
    mqttConn(thisHost, options);
    //get the relevant job from mattec realttime dataset
    const tmpRT = datasets.realtime.value.filter(
      (dept) => dept.MachID.toLowerCase() == mcID.toLowerCase()
    )[0];

    //seperate teh job from Mattec Job string
    const jn = tmpRT.JobID.trim().substring(0, tmpRT.JobID.trim().length - 6);
    //get the asm ref from mattec job string
    const asm = tmpRT.JobID.trim().replace(jn, "").substring(2, 3);

    //setJobReference({ job: jn, asm: asm });

   jobReference.current ={ job: jn, asm: asm };
    const tmpJob = datasets.jobs.value.filter(
      (jb) =>
        jb.JobNum === jn &&
        jb.AssemblySeq.toString() === asm &&
        jb.JCDept === "MACH"
    )[0];

    const jd = {
      jn: tmpJob.JobNum,
      asm: tmpJob.AssemblySeq,
      mc: mcID,
      cell: mfgDashboardFunctions.getCellfromRealtime(tmpRT.DeptDesc),
      cq: tmpJob.QtyPerCarton_c,
      pq: tmpJob.QtyPerPallet_c,
      pn: tmpJob.PartNum,
      pd: tmpJob.PartDescription,
      ium: tmpJob.IUM,
    };

    feedback(jd);

    setRtData(tmpRT);
    setJobData(tmpJob);
  }, []);

  // useEffect(() => {
  //   // console.log("JobDetails.js useEffct fire every time");
  // });

  // useEffect(() => {
  //   //
  //   console.log("JobDetails.js useEffct rtData");
  //   if (rtData && rtData.JobID) {
  //     const jn = rtData.JobID.trim().substring(
  //       0,
  //       rtData.JobID.trim().length - 6
  //     );
  //     const asm = rtData.JobID.trim().replace(jn, "").substring(2, 3);

  //     setJobReference({ job: jn, asm: asm });

  //     //     setJobNumber(rtData.Calculated_JobID.replace("100010", "").trim());
  //   }
  // }, [rtData]);

  // // useEffect(() => {
  // //   //
  // //   //console.log("JobDetails.js useEffct rtData");
  // //   if (
  // //     jobData &&
  // //     !Array.isArray(jobData) &&
  // //     rtData &&
  // //     !Array.isArray(rtData)
  // //   ) {

  // //     client.end();
  // //   }
  // // });

  // useEffect(() => {
  //   if (client) {
  //     console.log(" ");
  //     client.on("connect", () => {
  //       // setConnectStatus("Connected");
  //       // console.log("connection successful");
  //       mqttSub({
  //         topic: "food/st04/operations/dashboards/mattec/realtime",
  //         qos: 0,
  //       });
  //       mqttSub({
  //         topic: "food/st04/operations/dashboards/epicor/jobs",
  //         qos: 0,
  //       });
  //     });
  //     client.on("message", (topic, message) => {
  //       // setConnectStatus("Connected");
  //       // console.log("connection successful");
  //       switch (topic) {
  //         case "food/st04/operations/dashboards/mattec/realtime":
  //           setRtData(
  //             JSON.parse(message.toString()).value.filter(
  //               (dept) =>
  //                 dept.Calculated_MachID.toLowerCase() == mcID.toLowerCase()
  //             )[0]
  //           );
  //           break;
  //         case "food/st04/operations/dashboards/epicor/jobs":
  //           setJobData(JSON.parse(message.toString()).value);
  //           break;
  //         default:
  //       }
  //       console.log(
  //         `JobDetails.js received message from topic: ${topic} at ${Date.now()}`
  //       );
  //     });
  //     client.on("error", (err) => {
  //       console.error("Connection error: ", err);
  //       client.end();
  //     });
  //     client.on("reconnect", () => {
  //       // setConnectStatus("Reconnecting");
  //     });
  //   }
  // }, [client]);

  // const mqttSub = (subscription) => {
  //   if (client) {
  //     // topic & QoS for MQTT subscribing
  //     const { topic, qos } = subscription;
  //     // subscribe topic
  //     client.subscribe(topic, { qos }, (error) => {
  //       if (error) {
  //         console.log("Subscribe to topics error", error);
  //         return;
  //       }
  //       //console.log(`Subscribe to topics: ${topic}`);
  //     });
  //   }
  // };

  //if jobdata is an array it means it hasnt yet been filtered
  // if (typeof jobReference != "undefined" && Array.isArray(jobData)) {
  //   setJobData(
  //     jobData.filter(
  //       (jb) =>
  //         jb.JobNum === jobReference.job &&
  //         jb.AssemblySeq.toString() === jobReference.asm &&
  //         jb.JCDept === "MACH"
  //     )[0]
  //   );
  // }

  return !rtData || !jobData ? (
    <React.Fragment> {console.log("Render JobDetails")}</React.Fragment>
  ) : (
    <React.Fragment>
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            paddingLeft: 2,
            paddingTop: 1,
            paddingBottom: 1,
            marginBottom: 1,
            backgroundColor: tableTheme.palette.sistema.klipit.light,
          }}
        >
          <TableRowTypography
            variant="h2"
            paddingRight={16}
            alignSelf={"center"}
            color={tableTheme.palette.sistema.klipit.contrastText}
          >
            Job Details
          </TableRowTypography>
        </Grid>
        <Grid item xs={4}>
          <TableRowTypography variant="h4">Machine</TableRowTypography>
        </Grid>
        <Grid item xs={8}>
          <TableRowTypography variant="h3">
            {rtData.MachID}
          </TableRowTypography>
        </Grid>
        <Grid item xs={4}>
          <TableRowTypography variant="h4">Job</TableRowTypography>
        </Grid>
        <Grid item xs={8}>
          {
            <TableRowTypography variant="h3">
              {jobData.jobNum} ASM: {jobReference.current.asm} Rev :{" "}
              {jobData.RevisionNum}{" "}
            </TableRowTypography>
          }
        </Grid>
        <Grid item xs={4}>
          <TableRowTypography variant="h4">Part Number</TableRowTypography>
        </Grid>
        <Grid item xs={8}>
          {
            <TableRowTypography variant="h3">
              {" "}
              {jobData.PartNum}
            </TableRowTypography>
          }
        </Grid>
        <Grid item xs={4}>
          <TableRowTypography variant="h4">Part Desc</TableRowTypography>
        </Grid>
        <Grid item xs={8}>
          {
            <TableRowTypography variant="h3">
              {" "}
              {jobData.PartDescription}
            </TableRowTypography>
          }
        </Grid>
        <Grid item xs={4}>
          <TableRowTypography variant="h4">Inventory UOM</TableRowTypography>
        </Grid>
        <Grid item xs={8}>
          {<TableRowTypography variant="h3"> {jobData.IUM}</TableRowTypography>}
        </Grid>
        <Grid item xs={4}>
          <TableRowTypography variant="h4">Qty Per Carton</TableRowTypography>
        </Grid>
        <Grid item xs={8}>
          {
            <TableRowTypography variant="h3">

              {jobData.QtyPerCarton_c} ea
            </TableRowTypography>
          }
        </Grid>
        <Grid item xs={4}>
          <TableRowTypography variant="h4">Qty Per Pallet</TableRowTypography>
        </Grid>
        <Grid item xs={8}>
          {
            <TableRowTypography variant="h3">
              {jobData.IUM && jobData.IUM.toLowerCase() === "ct"
                ? parseFloat(jobData.QtyPerPallet_c) /
                    parseFloat(jobData.QtyPerCarton_c) +
                  " ctns"
                : jobData.QtyPerPallet_c + " ea"}
            </TableRowTypography>
          }
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default JobDetails;
//#region mcData
/*
 * {
    "Calculated_MachID": "B14",
    "Calculated_MachNo": 29,
    "Calculated_DeptNo": 8,
    "Calculated_OEE": "100",
    "Calculated_CycEff": "101.129388456262",
    "Calculated_YieldEff": "103.181607851505",
    "Calculated_AvgCycTime": "12.8548191563745",
    "Calculated_ScrapPercent": "0",
    "Calculated_DownPercent": "0",
    "Calculated_GoodProduction": "17264",
    "Calculated_TotalProduction": "17264",
    "Calculated_GoodPercent": "100",
    "Calculated_RunEfficency": "100",
    "Calculated_Berry105Efficiency": "106.45083759553",
    "Calculated_BerryMeefEfficiency": "100",
    "Calculated_LastCycTime": "12.8",
    "Calculated_TimeToGo": "86.604656853722",
    "Calculated_NextTool": "T627                ",
    "Calculated_NextJob": "A0316408100010      ",
    "Calculated_NextPartNum": "3402333                  ",
    "Calculated_NextPartDesc": "Lid Yogurt Pot Minty Teal                         ",
    "Calculated_CurrentJob": "A0316535100010      ",
    "Calculated_CurrentPartNum": "3402332                  ",
    "Calculated_CurrentPartDesc": "Lid Yogurt Pot Ocean Blue                         ",
    "Calculated_AssyCycTime": "1.60686962065668",
    "Calculated_ExpCycTime": "13",
    "Calculated_CurrentQTY": "25096",
    "Calculated_RequiredQTY": "215040",
    "RowIdent": "b667bf61-7c81-4f91-8e42-d11f2965ba25"
}/ */
//#endregion
