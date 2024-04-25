import React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from "@mui/material"; 
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone';
import { muiThemes } from "../../../assets/styling/muiThemes";

import { styled } from "@mui/material/styles";
import useTheme from "@mui/material/styles/useTheme";
import { tableCellClasses } from "@mui/material/TableCell";

const tableTheme = muiThemes.getSistemaTheme();

const CellsTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: tableTheme.palette.cells.main,
    color: tableTheme.palette.cells.contrastText,
    // borderBottom: "none",
    borderBottom: "0.5rem solid",
    padding:4,
    paddingBottom: 2,
    paddingTop: 2,
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    padding:4,
    fontSize: 12,
    paddingBottom: 2,
    paddingTop: 2,
  },
}));


export default function LineJobs(props) {
  const filteredJobs = props.jobs.slice(0, 5);
  const showConstraintsOnly = props.showConstraintsOnly;
  let jobsToDisplay = [];
  showConstraintsOnly === "true"
    ? (jobsToDisplay = filteredJobs.filter(
        (f) => f.constraint || f.binStockLevel !== "high"
      ))
    : (jobsToDisplay = filteredJobs);
  // console.log("jobsToDisplay", jobsToDisplay);

  // function handleJobSelect(job) {
  //   window.location.href = `/Assembly/ProductionBooking/?job=${job}`;
  // }
const  sistTheme = useTheme()

  return (
    <>
      <Table  size="small" aria-label="a dense table">
        <TableHead>
          <TableRow sx={{padding:0}}>
            <CellsTableCell>Job No</CellsTableCell>
            <CellsTableCell>Part No</CellsTableCell>
            <CellsTableCell style={{ width: 400 }}>Description</CellsTableCell>
            <CellsTableCell>Required Qty</CellsTableCell>
            <CellsTableCell>Inv Constraint</CellsTableCell>
            <CellsTableCell>SB Constraint</CellsTableCell>
            <CellsTableCell>Completed Qty</CellsTableCell>
            <CellsTableCell>Remaining Qty</CellsTableCell>
            <CellsTableCell style={{ width: 170 }}>Start Date</CellsTableCell>
            <CellsTableCell>Setup Crew Size</CellsTableCell>
            <CellsTableCell>Setup Complete</CellsTableCell>
            <CellsTableCell>Prod Crew Size</CellsTableCell>
            <CellsTableCell>Time Left</CellsTableCell>
            <CellsTableCell>Job Efficiency</CellsTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobsToDisplay.map((m, i) => (
            <TableRow
              key={i}
              sx={{
                backgroundColor:
                  m.currentActivity === "S"
                    ? sistTheme.palette.trafficLightRed.main
                    : m.currentActivity === "P"
                    ? sistTheme.palette.trafficLightGreen.light
                    : "transparent",
                // cursor: "pointer",
              }}
              // onClick={() => handleJobSelect(m.jobNum)}
            >
              <CellsTableCell>{m.jobNum}</CellsTableCell>
              <CellsTableCell>{m.partNum}</CellsTableCell>
              <CellsTableCell>{m.partDesc}</CellsTableCell>
              <CellsTableCell>
                {m.qtyReqd} {m.uom}
              </CellsTableCell>
              <CellsTableCell>{m.constraint ? <CircleTwoToneIcon sx={{ color: sistTheme.palette.trafficLightRed.main}} />: null}</CellsTableCell>
              <CellsTableCell>
               
                {m.binStockLevel === "none" ? (
                  <CircleTwoToneIcon sx={{ color: sistTheme.palette.trafficLightRed.main}} />
                ) : m.binStockLevel === "low" ? (
                  <CircleTwoToneIcon sx={{ color:'yellow'}} />
                ) : m.binStockLevel === "high" ? (
                  <CircleTwoToneIcon sx={{ color: sistTheme.palette.trafficLightGreen.dark}} />
                ) : null}
              </CellsTableCell>
              <CellsTableCell>
                {m.qtyDone} {m.uom}
              </CellsTableCell>
              <CellsTableCell>
                {m.qtyLeft} {m.uom}
              </CellsTableCell>
              <CellsTableCell>
                {/* {m.startDate} {m.startTime} */}
                {m.startDate === "01 Jan 9999, 00:00"
                  ? "Wait Sync"
                  : m.startDate}
              </CellsTableCell>
              <CellsTableCell>{m.setupCrewSize}</CellsTableCell>
              <CellsTableCell>{m.setupIsComplete}</CellsTableCell>
              <CellsTableCell>{m.prodCrewSize}</CellsTableCell>
              <CellsTableCell>{m.timeLeft}</CellsTableCell>
              <CellsTableCell>{m.jobEfficiency}%</CellsTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
