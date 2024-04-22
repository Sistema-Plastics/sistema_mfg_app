import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { muiThemes } from "../../assets/styling/muiThemes";
import { TableRowTypography } from "../../assets/styling/muiThemes";
const tableTheme = muiThemes.getSistemaTheme();

const JobStatus = ({ machineID, datasets }) => {
 

  const [rtData, setRtData] = useState();
  const [mcData, setMcData] = useState();

 
  useEffect(() => {
    //only fire on initial load
    setRtData(
      datasets.realtime.value.filter(
        (mc) =>
          mc.MachID.toLowerCase() ===
          machineID.toLowerCase()
      )[0]
    );
    setMcData(
      datasets.machinedata.value.filter(
        (mc) =>
          mc.MachID.toLowerCase() ===
          machineID.toLowerCase()
      )[0]
    );
    console.log("data" + datasets);
  }, []);
  

  const reqdQty =
    mcData === null ? null : parseInt(mcData.RequiredQTY);
  const goodQty =
    mcData === null ? null : parseInt(mcData.CurrentQTY);
  const remQty = mcData == null ? null : reqdQty - goodQty;

  // const jobStart =
  //   rtData == null
  //     ? ""
  //     : new Date(parseInt(rtData.StartTime) * 1000);
  const togo = mcData == null ? null : togoToDHMS(mcData.TimeToGo);

  function togoToDHMS(tm) {
    //get days
    const days = Math.floor(tm / 24);
    tm = tm - days * 24;
    const hours = Math.floor(tm);
    tm = tm - hours;
    const mins = Math.floor(tm * 60);
    tm = days + " days " + hours + " hours " + mins + " mins";

    return tm;
  }

  return !mcData && !rtData ? (
    <React.Fragment></React.Fragment>
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

        <Grid item xs={5}>
          <TableRowTypography variant="h4">Est Time Left </TableRowTypography>
        </Grid>
        <Grid item xs={7}>
          <TableRowTypography variant="h3"> {togo} </TableRowTypography>
        </Grid>
        <Grid item xs={5}>
          <TableRowTypography variant="h4">Required QTY </TableRowTypography>
        </Grid>
        <Grid item xs={7}>
          <TableRowTypography variant="h3"> {reqdQty} </TableRowTypography>
        </Grid>
        <Grid item xs={5}>
          <TableRowTypography variant="h4">Completed Qty </TableRowTypography>
        </Grid>
        <Grid item xs={7}>
          <TableRowTypography variant="h3"> {goodQty} </TableRowTypography>
        </Grid>
        <Grid item xs={5}>
          <TableRowTypography variant="h4">Qty To Go </TableRowTypography>
        </Grid>
        <Grid item xs={7}>
          <TableRowTypography variant="h3"> {remQty} </TableRowTypography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default JobStatus;

/**
 * {
    "MachID": "B14",
    "MachNo": 29,
    "DeptNo": 8,
    "OEE": "100",
    "CycEff": "101.129388456262",
    "YieldEff": "103.181607851505",
    "AvgCycTime": "12.8548191563745",
    "ScrapPercent": "0",
    "DownPercent": "0",
    "GoodProduction": "17264",
    "TotalProduction": "17264",
    "GoodPercent": "100",
    "RunEfficency": "100",
    "Berry105Efficiency": "106.45083759553",
    "BerryMeefEfficiency": "100",
    "LastCycTime": "12.8",
    "TimeToGo": "86.604656853722",
    "NextTool": "T627                ",
    "NextJob": "A0316408100010      ",
    "NextPartNum": "3402333                  ",
    "NextPartDesc": "Lid Yogurt Pot Minty Teal                         ",
    "CurrentJob": "A0316535100010      ",
    "CurrentPartNum": "3402332                  ",
    "CurrentPartDesc": "Lid Yogurt Pot Ocean Blue                         ",
    "AssyCycTime": "1.60686962065668",
    "ExpCycTime": "13",
    "CurrentQTY": "25096",
    "RequiredQTY": "215040",
    "RowIdent": "b667bf61-7c81-4f91-8e42-d11f2965ba25"
}/ */
