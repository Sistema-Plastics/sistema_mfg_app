import React, { useEffect } from "react";
import {  TableRow, TableCell } from "@mui/material";

import { styled } from "@mui/material/styles";
import { muiThemes } from "../../assets/styling/muiThemes";
import { tableCellClasses } from "@mui/material/TableCell";

// https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette.info
// https://mui.com/material-ui/customization/color/#2014-material-design-color-palettes

const tableTheme = muiThemes.getSistemaTheme();

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
const MBatchChangeCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: tableTheme.palette.mbatchChange.main,
    borderBottom: "none",
    paddingBottom: 4,
    paddingTop: 4,
    fontSize: 14,
  },
}));

const NextJobs = ({ datasets, machNo, incomingMB, incomingTool }) => {
  //This will fire on every render
  useEffect(() => {});

  //will only fire on 1st render. Fires before 1st render only
  useEffect(() => {
    // console.log(`You clicked ${count} times initial render`);
  }, []); //will only fire on 1st render. Fires befor 1st render only

  

  let mb = incomingMB;
  let tl = incomingTool;

  const getToolCell = (toolID) => {
    if (toolID === tl) {
      return <NextJobCell>{toolID}</NextJobCell>;
    } else {
      tl = toolID;
      return <ToolChangeCell>{toolID}</ToolChangeCell>;
    }
  };

  const getMBCell = (mbatch) => {
    if (mbatch === mb) {
      return <NextJobCell>{mbatch}</NextJobCell>;
    } else {
      mb = mbatch;
      return <MBatchChangeCell>{mbatch}</MBatchChangeCell>;
    }
  };

  return typeof datasets === "undefined" ? (
    <React.Fragment></React.Fragment>
  ) : (
    <React.Fragment>
      {datasets.jobList
        .filter((jl) => jl.MachNo === machNo && jl.lvl !== 0)
        .map((nj,key) => (
          <TableRow key={key}>
            <NextJobCell colSpan={2}></NextJobCell>
            <NextJobCell></NextJobCell>
            <NextJobCell>
              {nj.JobID} : {nj.AssemblySeq}
            </NextJobCell>
            <NextJobCell>{nj.PartID}</NextJobCell>
            <NextJobCell>{nj.PartDesc}</NextJobCell>
            <NextJobCell>{nj.ProdCrewSize}</NextJobCell>
            {getMBCell(nj.MasterBatch)}
            {getToolCell(nj.ToolID)}
            <NextJobCell>{nj.QtyRequired}</NextJobCell>
            <NextJobCell></NextJobCell>

            <NextJobCell>{nj.StartDateTime.toLocaleString()}</NextJobCell>
            <NextJobCell>{nj.EndDateTime.toLocaleString()}</NextJobCell>
            {/* <NextJobCell>
              {new Date(nj.EndDateTime - nj.StartDateTime)
                .toISOString()
                .slice(11, 19)}
            </NextJobCell>
           */}
          </TableRow>
        ))}
    </React.Fragment>
  );
};
export default NextJobs;
