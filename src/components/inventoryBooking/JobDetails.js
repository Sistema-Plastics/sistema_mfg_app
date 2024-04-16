import React, { useState, useEffect } from "react";
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

const JobDetails = ({ mcID, feedback }) => {
  //#region MQTT Connect
  const thisHost = mqttFunctions.getHostname();

  const [client, setClient] = useState(null);

  var options = mqttFunctions.getOptions();

  const mqttConn = (host, mqttOption) => {
    setClient(mqtt.connect(host, mqttOption));
  };
  //#endregion

  const [rtData, setRtData] = useState();
  const [jobData, setJobData] = useState();
  const [jobReference, setJobReference] = useState();

  useEffect(() => {
    //only fire on initial load
    mqttConn(thisHost, options);
  }, []);

  useEffect(() => {
    // console.log("JobDetails.js useEffct fire every time");
  });

  useEffect(() => {
    //
    console.log("JobDetails.js useEffct rtData");
    if (rtData && rtData.Calculated_JobID) {
      const jn = rtData.Calculated_JobID.trim().substring(
        0,
        rtData.Calculated_JobID.trim().length - 6
      );
      const asm = rtData.Calculated_JobID.trim()
        .replace(jn, "")
        .substring(2, 3);

      setJobReference({ job: jn, asm: asm });

      //     setJobNumber(rtData.Calculated_JobID.replace("100010", "").trim());
    }
  }, [rtData]);

  useEffect(() => {
    //
    //console.log("JobDetails.js useEffct rtData");
    if (
      jobData &&
      !Array.isArray(jobData) &&
      rtData &&
      !Array.isArray(rtData)
    ) {
      const jd = {
        jn: jobData.JobHead_JobNum,
        asm: jobData.JobOper_AssemblySeq,
        mc: mcID,
        cell: mfgDashboardFunctions.getCellfromRealtime(
          rtData.Calculated_DeptDesc
        ),
        cq: jobData.Part_QtyPerCarton_c,
        pq: jobData.Part_QtyPerPallet_c,
        pn: jobData.JobHead_PartNum,
        pd: jobData.JobHead_PartDescription,
        ium: jobData.JobHead_IUM,
      };

      feedback(jd);
    }
  });

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        // setConnectStatus("Connected");
        // console.log("connection successful");
        mqttSub({
          topic: "food/st04/operations/dashboards/mattec/realtime",
          qos: 0,
        });
        mqttSub({
          topic: "food/st04/operations/dashboards/epicor/jobs",
          qos: 0,
        });
      });
      client.on("message", (topic, message) => {
        // setConnectStatus("Connected");
        // console.log("connection successful");
        switch (topic) {
          case "food/st04/operations/dashboards/mattec/realtime":
            setRtData(
              JSON.parse(message.toString()).value.filter(
                (dept) =>
                  dept.Calculated_MachID.toLowerCase() == mcID.toLowerCase()
              )[0]
            );
            break;
          case "food/st04/operations/dashboards/epicor/jobs":
            setJobData(JSON.parse(message.toString()).value);
            break;
          default:
        }
        console.log(
          `JobDetails.js received message from topic: ${topic} at ${Date.now()}`
        );
      });
      client.on("error", (err) => {
        console.error("Connection error: ", err);
        client.end();
      });
      client.on("reconnect", () => {
        // setConnectStatus("Reconnecting");
      });
    }
  }, [client]);

  const mqttSub = (subscription) => {
    if (client) {
      // topic & QoS for MQTT subscribing
      const { topic, qos } = subscription;
      // subscribe topic
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
        //console.log(`Subscribe to topics: ${topic}`);
      });
    }
  };

  //if jobdata is an array it means it hasnt yet been filtered
  if (typeof jobReference != "undefined" && Array.isArray(jobData)) {
    setJobData(
      jobData.filter(
        (jb) =>
          jb.JobHead_JobNum === jobReference.job &&
          jb.JobOper_AssemblySeq.toString() === jobReference.asm &&
          jb.ResourceGroup_JCDept === "MACH"
      )[0]
    );
  }

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
            
            {rtData.Calculated_MachID}
          </TableRowTypography>
        </Grid>
        <Grid item xs={4}>
          <TableRowTypography variant="h4">Job</TableRowTypography>
        </Grid>
        <Grid item xs={8}>
          {
            <TableRowTypography variant="h3">
              {jobData.JobHead_JobNum} ASM: {jobReference.asm} Rev :{" "}
              {jobData.JobHead_RevisionNum}{" "}
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
              {jobData.JobHead_PartNum}
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
              {jobData.JobHead_PartDescription}
            </TableRowTypography>
          }
        </Grid>
        <Grid item xs={4}>
          <TableRowTypography variant="h4">Inventory UOM</TableRowTypography>
        </Grid>
        <Grid item xs={8}>
          {
            <TableRowTypography variant="h3">
              {" "}
              {jobData.JobHead_IUM}
            </TableRowTypography>
          }
        </Grid>
        <Grid item xs={4}>
          <TableRowTypography variant="h4">Qty Per Carton</TableRowTypography>
        </Grid>
        <Grid item xs={8}>
          {
            <TableRowTypography variant="h3">
              {" "}
              {jobData.Part_QtyPerCarton_c} ea
            </TableRowTypography>
          }
        </Grid>
        <Grid item xs={4}>
          <TableRowTypography variant="h4">Qty Per Pallet</TableRowTypography>
        </Grid>
        <Grid item xs={8}>
          {}
          {
            <TableRowTypography variant="h3">
              {jobData.JobHead_IUM && jobData.JobHead_IUM.toLowerCase() === "ct"
                ? parseFloat(jobData.Part_QtyPerPallet_c) /
                    parseFloat(jobData.Part_QtyPerCarton_c) +
                  " ctns"
                : jobData.Part_QtyPerPallet_c + " ea"}
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
