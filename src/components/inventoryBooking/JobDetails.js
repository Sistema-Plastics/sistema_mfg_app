import React, { useState, useEffect, useRef } from "react";
import { Grid, Container } from "@mui/material";

import { mfgDashboardFunctions } from "../../helpers/HelperScripts";

import { muiThemes } from "../../assets/styling/muiThemes";
import { TableRowTypography } from "../../assets/styling/muiThemes";
const tableTheme = muiThemes.getSistemaTheme();

const JobDetails = ({ mcID, datasets, feedback }) => {


  return datasets.currentJob === null ? (
      <React.Fragment>
          <Container>
              <h1> No Job Data found</h1>
          </Container>
      </React.Fragment>
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
                      {datasets.currentJob.mc.toUpperCase()}
                  </TableRowTypography>
              </Grid>
              <Grid item xs={4}>
                  <TableRowTypography variant="h4">Job</TableRowTypography>
              </Grid>
              <Grid item xs={8}>
                  {
                      <TableRowTypography variant="h3">
                          {datasets.currentJob.jn} ASM:{" "}
                          {datasets.currentJob.asm} Opr:{" "}
                          {datasets.currentJob.opr} Rev:{" "}
                          {datasets.currentJob.rev}{" "}
                      </TableRowTypography>
                  }
              </Grid>
              <Grid item xs={4}>
                  <TableRowTypography variant="h4">
                      Part Number
                  </TableRowTypography>
              </Grid>
              <Grid item xs={8}>
                  {
                      <TableRowTypography variant="h3">
                          {datasets.currentJob.pn}
                      </TableRowTypography>
                  }
              </Grid>
              <Grid item xs={4}>
                  <TableRowTypography variant="h4">
                      Part Desc
                  </TableRowTypography>
              </Grid>
              <Grid item xs={8}>
                  {
                      <TableRowTypography variant="h3">
                          {datasets.currentJob.pd}
                      </TableRowTypography>
                  }
              </Grid>
              <Grid item xs={4}>
                  <TableRowTypography variant="h4">
                      Inventory UOM
                  </TableRowTypography>
              </Grid>
              <Grid item xs={8}>
                  {
                      <TableRowTypography variant="h3">
                          {" "}
                          {datasets.currentJob.ium}
                      </TableRowTypography>
                  }
              </Grid>
              <Grid item xs={4}>
                  <TableRowTypography variant="h4">
                      Qty Per Carton
                  </TableRowTypography>
              </Grid>
              <Grid item xs={8}>
                  {
                      <TableRowTypography variant="h3">
                          {datasets.currentJob.cq} ea
                      </TableRowTypography>
                  }
              </Grid>
              <Grid item xs={4}>
                  <TableRowTypography variant="h4">
                      Qty Per Pallet
                  </TableRowTypography>
              </Grid>
              <Grid item xs={8}>
                  {
                      <TableRowTypography variant="h3">
                          {datasets.currentJob.ium &&
                          datasets.currentJob.ium.toLowerCase() === "ct"
                              ? parseFloat(datasets.currentJob.pq) /
                                    parseFloat(datasets.currentJob.cq) +
                                " ctns"
                              : datasets.currentJob.pq + " ea"}
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
