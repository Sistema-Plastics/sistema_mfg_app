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

//TODO: Create collapsable section for header
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

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

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  margin:0
}));


const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  // backgroundColor:
  //   theme.palette.mode === 'dark'
  //     ? 'rgba(255, 255, 255, .05)'
  //     : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(270deg)',
  },
  '& .MuiAccordionSummary-content': {
    // marginLeft: theme.spacing(1),
    margin:0
  },
}));



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
  const sistTheme = useTheme();

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
      <Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{color:sistTheme.palette.sistema.klipit.light}}/>}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{  padding: 0, backgroundColor: "transparent" ,margin:0}}
        >
          <Typography component="h2" variant="h6"  gutterBottom>
            Filters
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* 
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Filters
      </Typography> */}
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
              <FormControl
                variant="standard"
                sx={{
                  "& > label": {
                    color: sistTheme.palette.sistema.klipit.main,
                    marginTop: 0,
                  },
                }}
              >
                <JobLabel htmlFor="component-simple">
                  Filter Job Number
                </JobLabel>
                <Input
                  id="component-simple"
                  // defaultValue="Composed TextField"
                  inputRef={jobNo}
                />
              </FormControl>
              <FormControl variant="standard" sx={{ alignItems: "flex-start" }}>
                <FormControlLabel
                  control={
                    <Button
                      size="small"
                      sx={{
                        color: sistTheme.palette.sistema.klipit.contrastText,
                      }}
                      onClick={handleJobIDChange}
                    >
                      Filter
                    </Button>
                  }
                  sx={{ marginLeft: 2, marginTop: 0 }}
                />
              </FormControl>
            </Grid>

            <Grid
              item
              xs={6}
              sm={3}
              md={3}
              lg={3}
              xl={3}
              sx={{ padding: 0, margin: 0 }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    onChange={handleDateChange}
                    label="Select Shift Date"
                    sx={{
                      width: "250px",
                      "& .MuiButtonBase-root": {
                        padding: 0,
                        marginTop: 5,
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
                    sx={{ alignSelf: "center" }}
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
        </AccordionDetails>
      </Accordion>
    </React.Fragment>
  );
};
export default ShiftScheduleHeader;
