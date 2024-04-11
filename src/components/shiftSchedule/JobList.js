import React, { useEffect } from "react";

import {  TableRow, TableCell } from "@mui/material";
import NextJobs from "./NextJobs";

import { styled } from "@mui/material/styles";
import { muiThemes } from "../../assets/styling/muiThemes";
import { tableCellClasses } from "@mui/material/TableCell";

// https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette.info
// https://mui.com/material-ui/customization/color/#2014-material-design-color-palettes

const tableTheme = muiThemes.getShiftScheduleTableTheme();

const RunningJobCell = styled(TableCell)(({ theme }) => ({
  // [`&.${tableCellClasses.head}`]: {
  //   backgroundColor: tableTheme.palette.primary.light,
  //   color: tableTheme.palette.primary.contrastText,
  //   borderBottom: "none",paddingBottom:4,paddingTop:4,fontSize:12
  // },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: tableTheme.palette.secondary.dark,
    borderBottom: "none",
    paddingBottom: 4,
    paddingTop: 4,
    fontSize: 14,
  },
}));

const JobList = ({ datasets, machNo }) => {
  //     const [count, setCount] = useState(0);
  const currJob = datasets.jobList.filter(
    (jl) => jl.MachNo === machNo && jl.lvl === 0 /**/
  )[0];

  //This will fire on every render
  useEffect(() => {});

  //will only fire on 1st render. Fires before 1st render only
  useEffect(() => {
    // console.log(`You clicked ${count} times initial render`);
  }, []); //will only fire on 1st render. Fires befor 1st render only


  return typeof currJob === "undefined" ? (
    <React.Fragment>
      {
        // call next jobs to get list of follow up jobs if mc isnt running.
        //this is needed to see all jobs for non runiing mqchines and when viewing shift data otherwise next jobs won't get called
      }
      <NextJobs datasets={datasets} machNo={machNo} />
    </React.Fragment>
  ) : (
    <React.Fragment>
      <TableRow>
        <RunningJobCell colSpan={2}></RunningJobCell>
        <RunningJobCell colSpan={2}>
          {currJob.JobID} : {currJob.AssemblySeq}
        </RunningJobCell>
        <RunningJobCell>{currJob.PartID}</RunningJobCell>
        <RunningJobCell>{currJob.PartDesc}</RunningJobCell>
        <RunningJobCell>{currJob.ProdCrewSize}</RunningJobCell>
        <RunningJobCell>{currJob.MasterBatch}</RunningJobCell>
        <RunningJobCell>{currJob.ToolID}</RunningJobCell>
        <RunningJobCell>{currJob.QtyRequired}</RunningJobCell>
        <RunningJobCell>
          {currJob.QtyRequired - currJob.QtyCompleted}
        </RunningJobCell>

        <RunningJobCell>
          {currJob.StartDateTime.toLocaleString()}
        </RunningJobCell>
        <RunningJobCell>{currJob.EndDateTime.toLocaleString()}</RunningJobCell>
        {/* <RunningJobCell>
          {new Date(currJob.EndDateTime - new Date())
            .toISOString()
            .slice(11, 19)}
        </RunningJobCell> */}
      </TableRow>
      <NextJobs
        datasets={datasets}
        machNo={machNo}
        incomingMB={currJob.MasterBatch}
        incomingTool={currJob.ToolID}
      />
    </React.Fragment>
  );
};
export default JobList;
