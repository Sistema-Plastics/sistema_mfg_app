import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { muiThemes } from "../../assets/styling/muiThemes";
import { TableRowTypography } from "../../assets/styling/muiThemes";
const tableTheme = muiThemes.getSistemaTheme();

const JobStatus = ({ machineID, datasets }) => {
  // const [rtData, setRtData] = useState();
  // const [mcData, setMcData] = useState();

  const [displayData, setDisplayData] = useState({
    reqdQty: 0,
    goodQty: 0,
    remQty: 0,
    togo: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // only fire on initial load
    // const rt = datasets.realtime.value.filter(
    //   (mc) => mc.MachID.toLowerCase() === machineID.toLowerCase()
    // )[0];

    const mc = datasets.machinedata.value.filter(
      (mc) => mc.MachID.toLowerCase() === machineID.toLowerCase()
    )[0];

    const jobNo = mc.CurrentJob.substring(0, mc.CurrentJob.length - 6);

    const job = datasets.jobs.value.filter(
      (j) => j.JobNum === jobNo && j.JCDept === "MACH"
    )[0];

    let reqdqty = 0,
      goodqty = 0,
      remqty = 0;

    if (typeof mc !== "undefined") {
      reqdqty = parseInt(mc.RequiredQTY);
      goodqty = parseInt(mc.CurrentQTY);
      remqty = reqdqty - goodqty;

      setDisplayData((prevState) => {
        return { ...prevState, reqdQty: reqdqty };
      });
      setDisplayData((prevState) => {
        return { ...prevState, goodQty: goodqty };
      });
      setDisplayData((prevState) => {
        return {
          ...prevState,
          remQty: remqty,
        };
      });
      setDisplayData((prevState) => {
        return { ...prevState, togo: togoToDHMS(mc.TimeToGo) };
      });
    }

    if (typeof job !== "undefined") {
      const ium = job.IUM;
      const palletQty = job.QtyPerPallet_c;
      const cartonQty = job.QtyPerCarton_c;
      const palletIUMQty = job.QtyPerPallet;

      let vStr =
        reqdqty +
        " ea / " +
        reqdqty / cartonQty +
        " " +
        ium.toLowerCase() +
        " / " +
        reqdqty / palletQty +
        " plts";

      setDisplayData((prevState) => {
        return { ...prevState, dispReqdQty: vStr };
      });

      setDisplayData((prevState) => {
        return { ...prevState, IUM: job.IUM };
      });
      setDisplayData((prevState) => {
        return { ...prevState, palletQty: job.QtyPerPallet_c };
      });
      setDisplayData((prevState) => {
        return { ...prevState, cartonQty: job.QtyPerCarton_c };
      });
      setDisplayData((prevState) => {
        return { ...prevState, palletIUMQty: job.QtyPerPallet };
      });
    }

    console.log("data" + datasets);
  }, [datasets.machinedata]);

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
  return (
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
            Job Status
          </TableRowTypography>
        </Grid>

        <Grid item xs={5}>
          <TableRowTypography variant="h4">Est Time Left </TableRowTypography>
        </Grid>
        <Grid item xs={7}>
          <TableRowTypography variant="h3">
            {displayData.togo}
          </TableRowTypography>
        </Grid>
        <Grid item xs={5}>
          <TableRowTypography variant="h4">Required QTY </TableRowTypography>
        </Grid>
        <Grid item xs={7}>
          <TableRowTypography variant="h3">
            {/* {displayData.reqdQty} */}
            {displayData.dispReqdQty}
          </TableRowTypography>
        </Grid>
        <Grid item xs={5}>
          <TableRowTypography variant="h4">Completed Qty </TableRowTypography>
        </Grid>
        <Grid item xs={7}>
          <TableRowTypography variant="h3">
            {displayData.goodQty}
          </TableRowTypography>
        </Grid>
        <Grid item xs={5}>
          <TableRowTypography variant="h4">Qty To Go </TableRowTypography>
        </Grid>
        <Grid item xs={7}>
          <TableRowTypography variant="h3">
            {displayData.remQty}
          </TableRowTypography>
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
