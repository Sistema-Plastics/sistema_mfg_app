import React, {  useEffect  } from "react";

import {
  TableBody,
  TableRow,
  TableCell,
  TableHead,
 
} from "@mui/material";
import JobList from "./JobList";
import { mattecHelpers } from "../../helpers/MattecHelper";

import { styled } from "@mui/material/styles";
import { muiThemes } from "../../assets/styling/muiThemes";
import { tableCellClasses } from "@mui/material/TableCell";

// https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette.info
// https://mui.com/material-ui/customization/color/#2014-material-design-color-palettes

const tableTheme = muiThemes.getShiftScheduleTableTheme();

const JobHeaderCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: tableTheme.palette.primary.main,
    color: tableTheme.palette.primary.contrastText,
    borderBottom: "none",
    paddingBottom: 4,
    paddingTop: 4,
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const RunningMCHeaderCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: tableTheme.palette.primary.light,
    borderBottom: "none",
    paddingBottom: 6,
    paddingTop: 6,
    fontSize: 14,
  },
}));

const NonRunningMCHeaderCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: tableTheme.palette.error.main,
    borderBottom: "none",
    paddingBottom: 6,
    paddingTop: 6,
    fontSize: 14,
  },
}));
// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
// }));

const MachineList = ({ datasets, cell }) => {
   //TODO: remove  const machineList = useRef();

  // machineList.current = datasets.jobList.filter(
  //   (rt) => rt.DeptNo.toString() == cell.DeptNo
  // );

  const renderMcList = datasets.machineList.filter(
    (mc) => mc.DeptNo === cell.DeptNo
  );

  //let mcList = mattecHelpers.getSortedMachineList(machineList.current);
  let mcList = mattecHelpers.getSortedMachineList(renderMcList);
  //#region  Use Effects
  //This will fire on every render
  useEffect(() => {
    console.log("MachineList useEffect every");
  });

  //will only fire on 1st render. Fires before 1st render only
  useEffect(() => {
    console.log("MachineList useEffect init Cell:" + cell.DeptDesc);
  }, []); //will only fire on 1st render. Fires befor 1st render only
  //#endregion

  return typeof mcList === "undefined" ? (
    <React.Fragment></React.Fragment>
  ) : (
    <React.Fragment>
      {/* <Table stickyHeader aria-label="sticky table"> */}
      <TableHead>
        <TableRow sx={{ width: "100%" }}>
          <JobHeaderCell colSpan={4}>Job No</JobHeaderCell>
          <JobHeaderCell>Part No</JobHeaderCell>
          <JobHeaderCell>Part Desc</JobHeaderCell>
          <JobHeaderCell>Crew Size</JobHeaderCell>
          <JobHeaderCell>MasterBatch</JobHeaderCell>
          <JobHeaderCell>Tool ID</JobHeaderCell>
          <JobHeaderCell>Qty Reqd</JobHeaderCell>
          <JobHeaderCell>Qty To Go</JobHeaderCell>

          <JobHeaderCell>Start Time</JobHeaderCell>
          <JobHeaderCell>End Time</JobHeaderCell>
          {/* <JobHeaderCell>Run time Left</JobHeaderCell> */}
        </TableRow>
      </TableHead>
      <TableBody sx={{width:"100%"}} >
        {mcList.map((mcl, key) => (
          <>
            <TableRow key={key}>
              {mcl.DownDesc == null ? (
                <RunningMCHeaderCell colSpan={4} >
                  Machine:- {mcl.MachID}
                </RunningMCHeaderCell>
              ) : (
                <NonRunningMCHeaderCell colSpan={4}>
                  Machine:- {mcl.MachID}
                </NonRunningMCHeaderCell>
              )}
              {mcl.DownDesc == null ? (
                <RunningMCHeaderCell>
                  Status:- {mcl.DownDesc}
                </RunningMCHeaderCell>
              ) : (
                <NonRunningMCHeaderCell>
                  Status:- {mcl.DownDesc}
                </NonRunningMCHeaderCell>
              )}
              {mcl.DownDesc == null ? (
                <RunningMCHeaderCell>
                  Max Crew:- {mcl.MaxCrewSize}
                </RunningMCHeaderCell>
              ) : (
                <NonRunningMCHeaderCell>
                  Max Crew:- {mcl.MaxCrewSize}
                </NonRunningMCHeaderCell>
              )}

              {mcl.DownDesc == null ? (
                <RunningMCHeaderCell colSpan={2}>
                  Tool Changes:- {mcl.ToolChanges}
                </RunningMCHeaderCell>
              ) : (
                <NonRunningMCHeaderCell colSpan={2}>
                  Tool Changes:- {mcl.ToolChanges}
                </NonRunningMCHeaderCell>
              )}

              {mcl.DownDesc == null ? (
                <RunningMCHeaderCell colSpan={6}>
                  Master Batch Changes:- {mcl.MBatchChanges}
                </RunningMCHeaderCell>
              ) : (
                <NonRunningMCHeaderCell colSpan={6}>
                  Master Batch Changes:- {mcl.MBatchChanges}
                </NonRunningMCHeaderCell>
              )}
            </TableRow>

            <JobList datasets={datasets} machNo={mcl.MachNo} />
          </>
        ))}
      </TableBody>
      {/* </Table> */}
    </React.Fragment>
  );
};
export default MachineList;

/**
 * 
 * {
    "DeptNo": 8,
    "DeptDesc": "(B) Airport Cell 1",
    "MaxCrewSize": "0.25"
}
 */
