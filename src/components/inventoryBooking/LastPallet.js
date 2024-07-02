import React, { useState, useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { muiThemes } from "../../assets/styling/muiThemes";
import { TableRowTypography } from "../../assets/styling/muiThemes";

const tableTheme = muiThemes.getSistemaTheme();

const LastPallet = ({ machineID, datasets }) => {
  const [pltData, setPltData] = useState(null); //data.data;

  const [tableData, setTableData] = useState({
    timestamp: "",
    qty: 0,
    emp: "",
    status: 0,
    statusText: "",
  });

  useEffect(() => {
    //fire 1st render only
    // setPltData(datasets.palletdata);
  }, []);

  useEffect(() => {
   datasets.palletdata &&  datasets.palletdata.jobnum === datasets.currentJob.jn? setPltData(datasets.palletdata):setPltData(null)
  }, [datasets.palletdata]);

  useEffect(() => {
    if (pltData) {
      try {
        // let currJob = datasets.realtime.value.filter(
        //   (f) => f.MachID.toLowerCase() == machineID.toLowerCase()
        // )[0].JobID;
        // currJob = currJob.substring(0, currJob.length - 6);
        // if (currJob === pltData.jobnum) {
          let tmp = {};
          tmp.timestamp = new Date(parseFloat(pltData.tstamp)).toLocaleString();
          tmp.emp = pltData.empid;
          tmp.qty = pltData.acttranqty;

          switch (pltData.status) {
            case 0:
              tmp.statusText = "Waiitng ERP Confirmation";
              tmp.status = 0;
              break;
            case 1:
              tmp.statusText = "Booked-Waiting Collection";
              tmp.status = 1;
              break;
            case 2:
              tmp.statusText = "Receipted to Dexion";
              tmp.status = 2;

              break;
            default:
              tmp.statusText = "";
          }

          if (pltData.status !== 2) {
            const currentTime = Math.floor(new Date() / 1000);
            const requestedTime = Math.floor(parseFloat(pltData.tstamp) / 1000);
            const diff = currentTime - requestedTime;
            if (diff > 300) {
              tmp.status = 10;
            }
          }

          setTableData(tmp);
        // }
      } catch (ex) {
        console.log(ex);
      }
    }
  }, [pltData]);
  //decide if the amount of time is excessive and show as error

  useEffect(() => {
    console.log("LastPallet.js useEffct fire every time");
  });

  return (
    <React.Fragment>
      {console.log("LastPallet Render")}
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
            Last Pallet Booked
          </TableRowTypography>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Time Booked</TableCell>
                  <TableCell>Qty Booked</TableCell>
                  <TableCell>By</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pltData ? (
                  <TableRow
                  // className={
                  //   tableData.status == 0
                  //     ? classes.bookingRow
                  //     : tableData.status == 1
                  //     ? classes.waitingRow
                  //     : tableData.status == 2
                  //     ? classes.collectedRow
                  //     : tableData.status == 10
                  //     ? classes.overdueRow
                  //     : classes.normalRow
                  // }
                  >
                    <TableCell>{tableData.timestamp}</TableCell>
                    <TableCell>{tableData.qty}</TableCell>
                    <TableCell>{tableData.emp}</TableCell>
                    <TableCell>{tableData.statusText}</TableCell>
                  </TableRow>
                ) : (
                  <div></div>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default LastPallet;

/* 
    "tstamp": "1697405089331",
    "jobnum": "0317021",
    "resourceid": "B03",
    "partnum": "3501421",
    "status": 0,
    "acttranqty": 79680,
    "empid": "100033",
     "empname": "Gregory Heeley"
*/
