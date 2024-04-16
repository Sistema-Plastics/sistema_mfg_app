import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";

import {
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  
  TableHead,
} from "@mui/material";
import MachineList from "./MachineList";
//TODO: check table cell format 
//import { styled } from "@mui/material/styles";
import { muiThemes } from "../../assets/styling/muiThemes";
import { CellTableCell } from "../../assets/styling/muiThemes";

//import { tableCellClasses } from "@mui/material/TableCell";

//TODO:   need to extricate from muiThemes

// https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette.info
// https://mui.com/material-ui/customization/color/#2014-material-design-color-palettes

const tableTheme = muiThemes.getSistemaTheme();


const CellList = ({ datasets }) => {
  const [init, setInit] = useState(false);
   //TODO: remove  const renderCellList = useRef();

  useEffect(() => {
    console.log("celllist.js 1st");
  }, []);

  useEffect(() => {
    if (!init) setInit(true);
  });

  return typeof datasets.cellList === "undefined" ? (
    <React.Fragment></React.Fragment>
  ) : (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          {/* <TableContainer sx={{ maxHeight: 640 }}> */}
          {/* <Table size="small" stickyHeader aria-label="sticky table"> */}
          <Table sx={{ width: "100%" }}>
            <TableBody sx={{ width: "100%" }}>
              {datasets.cellList.map((cl, key) => (
                <>
                  <TableHead key={key}>
                    <TableRow key = {key}>
                      <CellTableCell colSpan={4}>
                        Cell:- {cl.DeptDesc}
                      </CellTableCell>
                      <CellTableCell colSpan={2}>
                        Cell Crew Size :-{cl.CellCrewSize}
                      </CellTableCell>
                      <CellTableCell colSpan={4}>
                        Cell Tool Changes :-{cl.CellToolChanges}
                      </CellTableCell>
                      <CellTableCell colSpan={4}>
                        Cell Master Batch Change :-{cl.CellMBatchChanges}
                      </CellTableCell>
                    </TableRow>
                  </TableHead>

                  <MachineList datasets={datasets} cell={cl} />
                </>
              ))}
            </TableBody>
          </Table>
          {/* </TableContainer> */}
        </Paper>
      </Typography>
    </React.Fragment>
  );
};
export default CellList;
