import React, { useEffect, useRef } from "react";
import {TableRow, TableCell } from "@mui/material";

import { styled } from "@mui/material/styles";
import { muiThemes } from "../../assets/styling/muiThemes";
import { tableCellClasses } from "@mui/material/TableCell";

// https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette.info
// https://mui.com/material-ui/customization/color/#2014-material-design-color-palettes

const  tableTheme = muiThemes.getShiftScheduleTableTheme();

const NextJobCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: tableTheme.palette.secondary.main,
    borderBottom: "none",
    paddingBottom: 4,
    paddingTop: 4,
    fontSize: 14,
  },
}));

const ToolChangeCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: tableTheme.palette.toolChange.main,
    borderBottom: "none",
    paddingBottom: 4,
    paddingTop: 4,
    fontSize: 14,
  },
}));

const NextJob = ({ job, incomingMB, incomingTool ,handleToolChange ,handleMBatchChange}) => {
  //This will fire on every render
  const tlID = useRef();
  useEffect(() => {});

  //will only fire on 1st render. Fires before 1st render only
  useEffect(() => {
    // console.log(`You clicked ${count} times initial render`);
  }, []); //will only fire on 1st render. Fires befor 1st render only

  

  //set flags for Tool and Mbatch Changes
  let tchg = false,
    mbchg = false;

tlID.current = incomingTool
    let tid = incomingTool//,  //TODO: remove mid = incomingMB;

  if (job.ToolID != tid) {tchg = true;tid=job.ToolID};
  if (job.MasterBatch != incomingMB) {mbchg = true; handleMBatchChange(job.MasterBatch)};

  return typeof job === "undefined" ? (
    <React.Fragment></React.Fragment>
  ) : (
    <React.Fragment>
      <TableRow sx={{ backgroundColor: "#fff074" }}>
        <NextJobCell sx={{}}></NextJobCell>{" "}
        <NextJobCell sx={{ width: 15 }}></NextJobCell>
        <NextJobCell sx={{}}>
          {job.JobID} : {job.AssemblySeq}
        </NextJobCell>
        <NextJobCell>{job.PartID}</NextJobCell>
        <NextJobCell>{job.PartDesc}</NextJobCell>
        <NextJobCell>{job.ProdCrewSize}</NextJobCell>
        <NextJobCell>{job.MasterBatch}</NextJobCell>
        {tchg ===true ? (
          <ToolChangeCell>{job.ToolID}</ToolChangeCell>
        ) : (
          <NextJobCell>{job.ToolID}</NextJobCell>
        )}
        {/* <NextJobCell>{job.ToolID}</NextJobCell> */}

        <NextJobCell>{job.QtyRequired}</NextJobCell>
        <NextJobCell></NextJobCell>
        <NextJobCell>
          {new Date(job.EndDateTime - job.StartDateTime)
            .toISOString()
            .slice(11, 19)}
        </NextJobCell>
        <NextJobCell>{job.StartDateTime.toLocaleString()}</NextJobCell>
      </TableRow>
    </React.Fragment>
  );
};
export default NextJob;
