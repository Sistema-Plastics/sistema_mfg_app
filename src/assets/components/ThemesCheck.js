import React from "react";
import {
  Typography,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  RadioGroup,
  Radio,
} from "@mui/material";
import {grey} from "@mui/material/colors"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";

import useTheme from "@mui/material/styles/useTheme";
export default function ThemesCheck(props) {
const custTheme = useTheme();

  return (
    <React.Fragment>
      <Box
        sx={{
          width: "100%",
          padding: 1,
          maxWidth: "90%",
          backgroundColor: custTheme.palette.paper.background,
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
        component="main"
      >
        {/* <TextField
          variant="standard"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          label="User ID"
        ></TextField>

        <TextField
          variant="outlined"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          label="User ID"
        ></TextField>

        <TextField
          variant="filled"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          label="User ID"
        ></TextField> */}
        <FormControlLabel
          control={<Checkbox />}
          label="FormControlLabel-Checkbox"
        />
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel
              control={<Radio />}
              label="FormControlLabel-Radio"
            />
          </RadioGroup>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="DatePicker"
              sx={{
                width: "250px",
                "& .MuiButtonBase-root": {
                  color: "#fff",
                  backgroundColor: custTheme.palette.sistema.klipit,
                  // border: "none",
                  borderRadius: 2,
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
        <FormControl variant="standard">
          <InputLabel htmlFor="component-simple">
            FormControl-InputLabel
          </InputLabel>
          <Input id="component-simple">FormControl-Input</Input>
        </FormControl>
        <FormControl variant="standard" sx={{ alignItems: "flex-start" }}>
          <FormControlLabel control={<Button sx={{color:grey[50]}}> FormControlLabel-Button</Button>} />
          {/* 
          <Button
            variant="contained"
            size="small"
            // sx={{
            //   marginTop: 2,
            // }}
          >
            Filter
          </Button> */}
        </FormControl>
        <Typography variant="h1" gutterBottom>
          h1. Heading
        </Typography>
        <Typography variant="h2" gutterBottom>
          h2. Heading
        </Typography>
        <Typography variant="h3" gutterBottom>
          h3. Heading
        </Typography>
        <Typography variant="h4" gutterBottom>
          h4. Heading
        </Typography>
        <Typography variant="h5" gutterBottom>
          h5. Heading
        </Typography>
        <Typography variant="h6" gutterBottom>
          h6. Heading
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Quos blanditiis tenetur
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Quos blanditiis tenetur
        </Typography>
        <Typography variant="body1" gutterBottom>
          body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore
          consectetur, neque doloribus, cupiditate numquam dignissimos laborum
          fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
        <Typography variant="body2" gutterBottom>
          body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore
          consectetur, neque doloribus, cupiditate numquam dignissimos laborum
          fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
        <Typography variant="button" display="block" gutterBottom>
          button text
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          caption text
        </Typography>
        <Typography variant="overline" display="block" gutterBottom>
          overline text
        </Typography>
      </Box>
    </React.Fragment>
  );
}
