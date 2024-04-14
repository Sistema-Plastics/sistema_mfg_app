import React, { useState, useEffect, useRef } from "react";
import { Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import useTheme from "@mui/material/styles/useTheme";

 //TODO: remove import FormLabel from "@mui/material/FormLabel";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const JobLabel = styled(InputLabel)(({ theme }) => ({
  backgroundColor: "transparent", //theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.h6,
  // padding: theme.spacing(2),
  border: 0,
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

 //TODO: remove  const ShiftsLabel = styled(FormLabel)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
//   ...theme.typography.h6,
//   // padding: theme.spacing(2),
//   border: 0,
//   textAlign: "left",
//   color: theme.palette.text.secondary,
// }));

const JobInput = styled(Input)(({ theme }) => ({
  // backgroundColor: "none",
  // ...theme.typography.h6,
  // padding: theme.spacing(0.5),
  // border: 0,
  // textAlign: "left",
  // color: theme.palette.text.secondary,
  
}));

const HeaderButton = styled(Button)(({ theme }) => ({
  // backgroundColor: "#005DA1",
  // ...theme.typography.body2,
  // padding: theme.spacing(0),
  // border: 0,
  // textAlign: "left",
  // color: theme.palette.text.secondary.contrast,
}));

// const ColorButton =
//   styled(Button) <
//   ButtonProps >
//   (({ theme }) => ({
//     color: theme.palette.getContrastText(purple[500]),
//     backgroundColor: purple[500],
//     "&:hover": {
//       backgroundColor: purple[700],
//     },
//   }));

const flexContainer = {
  display: "flex",
  flexDirection: "row",
};

const ShiftScheduleHeader = ({
  datasets,
  filters,
  dispNonRunnersCallback,
  cellFiltersCallBack,
  jobFilterCallBack,
  shiftFilterCallBack,
}) => {
  const [cellFilter, setCellFilter] = useState([]);
  const [cellList, setCellList] = useState();
   //TODO: remove  const [jobID, setJobID] = useState();
  const [init, setinit] = useState(false);
  const [dispNonProd, setDispNonProd] = useState(false);

  const jobNo = useRef();
  const shiftData = useRef({ shiftDate: null, shift: null });

  //get the theme defined in App.js\
  const sistTheme = useTheme()
  

  
  useEffect(() => {
    //console.log("ShiftScheduleHeader.js 1st");
  }, []);

  useEffect(() => {
    //console.log("ShiftScheduleHeader.js every");
    if (datasets && !init) setinit(true);

    if (filters.showNonRunners !== dispNonProd)
      setDispNonProd(filters.showNonRunners);

    if (filters.cells.toString() !== cellFilter.toString())
      setCellFilter(filters.cells);
  });

  useEffect(() => {
    if (datasets && init) {
      setCellList(datasets.cellList);
    }

    //console.log(datasets);
  }, [init]);

  useEffect(() => {
    if (datasets) setCellList(datasets.cellList);
    //console.log(datasets);
  }, [dispNonProd]);

  // useEffect(() => {
  //   if (datasets)
  //     setCells(mattecHelpers.getCellsFromRTbyCellFilter(datasets.mattecRt, cellFilter));
  //   //console.log(datasets);
  // }, [cells]);

  const handleCellFilter = (e) => {
    const v = e.target.id;
    const c = e.target.checked;

    let tmparr = cellFilter.map((e) => e);
    !c && tmparr.includes(v)
      ? tmparr.splice(tmparr.indexOf(v), 1)
      : tmparr.push(v);
    cellFiltersCallBack(tmparr);
  };

  const showNonProd = (e) => {
    //console.log(e.target.checked);
    dispNonRunnersCallback(e.target.checked);
  };

  const handleJobIDChange = (event) => {
    jobFilterCallBack(jobNo.current.value);
  };

  const handleShiftChange = (event) => {
    console.log(event.target);
    shiftData.current.shift = event.target.value;
    if (shiftData.current.shiftDate != null) {
      shiftFilterCallBack(shiftData.current);
    } //handle call back}
  };

  const handleDateChange = (e) => {
    const seldate = new Date(e.$d);
    shiftData.current.shiftDate = seldate;
    if (shiftData.current.shift != null) {
      shiftFilterCallBack(shiftData.current);
    } //handle call back}
    console.log(seldate);
  };

  const controlProps = (item) => ({
    //checked: selectedValue === item,
    onChange: handleShiftChange,
    value: item,
    name: "size-radio-button-demo",
    inputProps: { "aria-label": item },
  });
  //#region ETstCode

  //#endregion

 //TODO: remove  const jbl = [
  //   ...new Map(datasets.jobList.map((item) => [item["JobID"], item])).values(),
  // ];

  return !cellList ? (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={6} md={8}>
          <Item>xs=6 md=8</Item>
        </Grid>
        <Grid item xs={6} md={4}>
          <Item>xs=6 md=4</Item>
        </Grid>
        <Grid item xs={6} md={4}>
          <Item>xs=6 md=4</Item>
        </Grid>
        <Grid item xs={6} md={8}>
          <Item>xs=6 md=8</Item>
        </Grid>
      </Grid>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Filters
      </Typography>
      <Grid container spacing={2}>
        <FormGroup style={flexContainer}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={showNonProd}
                size="small"
                checked={filters.showNonRunners}
                sx={{ padding: 0.5 }}
              />
            }
            label="Show Non Productive"
          />
        </FormGroup>
      </Grid>
      <Grid container spacing={2}>
        <FormGroup style={flexContainer}>
          {cellList.map((cl, key) => (
            <FormControlLabel
              control={
                <Checkbox
                  onChange={handleCellFilter}
                  size="small"
                  key={cl.DeptNo}
                  id={cl.DeptNo}
                  checked={cellFilter.includes(cl.DeptNo.toString())}

                />
              }
              label={cl.DeptDesc}
            />
          ))}
        </FormGroup>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={3} xl={2}>
          <FormControl variant="standard">
            <JobLabel htmlFor="component-simple">Filter Job Number</JobLabel>
            <JobInput
              id="component-simple"
              // defaultValue="Composed TextField"
              inputRef={jobNo}
            />
          </FormControl>
          <FormControl variant="standard" sx={{ alignItems: "flex-start" }}>
            {/* <HeaderButton
              variant="contained"
              size="small"
              onClick={handleJobIDChange}
              sx={{
                marginTop: 2,
              }}
            > */}
            <FormControlLabel control={<Button sx={{color:sistTheme.palette.sistema.klipit.contrastText}}>Filter</Button>}/>
              
            {/* </HeaderButton> */}
          </FormControl>
        </Grid>
        {/* </Grid>
      <Grid container spacing={2}> */}
        <Grid item xs={6} sm={3} md={3} lg={3} xl={3} sx={{padding:0,margin:0}}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                onChange={handleDateChange}
                label="Select Shift Date"
                sx={{
                  width: "250px",
                  // "& .MuiInputLabel-root": {
                  //   color: "#000",
                  //   backgroundColor: "transparent",
                  //   border: "none",
                  // }, 

                    "& .MuiButtonBase-root": {
                      padding:0,marginTop:5,
                    color: sistTheme.palette.sistema.klipit.main,
                    backgroundColor: "transparent",
                    border: "none",
                  }, 
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>

        <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
          <FormControl>
  
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                control={<Radio {...controlProps("M")} size="small" />}
                label="Morning"
                sx={{  alignSelf: "center" }}
              />
              <FormControlLabel
                control={<Radio {...controlProps("A")} size="small" />}
                label="Afternoon"
                //sx={{ padding: 0 }}
              />
              <FormControlLabel
                control={<Radio {...controlProps("N")} size="small" />}
                label="Night"
               // sx={{ padding: 0 }}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      {/*  */}
    </React.Fragment>
  );
};
export default ShiftScheduleHeader;
