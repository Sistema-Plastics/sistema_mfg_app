import * as Cookies from "./CookieFunctions.js";
import UserLogin from "../../components/UserLogin";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CurrentDate from "./Date";
import { useTheme } from "@mui/material/styles";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

import {
  AppBar,
  Avatar,
  Box,
  //Button,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Link,
  MenuItem,
  Snackbar,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  FilterList as FilterListIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

//import clsx from "clsx";

//MOVED OLD styles code below to App.cs to erpa entireity
//note css specificty is advised against, better to use in line sx or custom type

export const SistemaContext = React.createContext({});

export default function SistemaHeader(props) {
  const noUser = {
    userid: "",
    avatar: "/broken-image.jpg",
  };

  const defaultAvatar = "/broken-image.jpg";
  const epicorToken = Cookies.getCookie("epicorToken");
  const epicorUserID = Cookies.getCookie("epicorUserID");

  // const classes = useStyles();
  const theme = useTheme();

  const history = useNavigate();

  const [pageTitle, setPageTitle] = useState("");
  const [pageFilters, setPageFilters] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginStatusTrigger, setLoginStatusTrigger] = useState(0);
  const [logoutOption, setLogoutOption] = useState(false);
  const [user, setUser] = useState(noUser);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarDuration, setSnackbarDuration] = useState(6000);

  const drawerWidth = 300;

  const root = {
    flexGrow: 1,
    marginBottom: "0px",
  };
  const title = {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
    margin: 0,
    padding: 0,
    color: "white",
    fontWeight: "bold",
    //fontSize: 20
  };

  const menuButton = {
    marginRight: theme.spacing(2),
  };

  const titleLink = {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
  };

  const accountIcon = {
    marginLeft: theme.spacing(10),
    marginRight: theme.spacing(1),
  };

  const appBar = {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  };
  const appBarShift = {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  };
  const hide = {
    display: "none",
  };
  const drawer = {
    width: drawerWidth,
    flexShrink: 0,
  };
  const drawerPaper = {
    width: drawerWidth,
  };
  const drawerHeader = {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  };

  const formField = {
    "& > label": {
      backgroundColor: theme.palette.background.paper,
      border: theme.palette.background.paper,
    },
  };
  const toolBar = {
    alignItems: "baseline",
    marginBottom: "0px",
  };

  useEffect(() => {
    console.log(
      "useEffect[user] *",
      "userid:",
      user.userid,
      "Token:",
      epicorToken != null
    );
    if (
      user.userid === "" &&
      epicorUserID != null &&
      epicorUserID !== "" &&
      epicorToken !== null &&
      epicorToken !== ""
    ) {
      setUser({
        userid: epicorUserID,
        avatar: defaultAvatar,
      });
    }
  }, [user]);

  const showSnackbarMessage = (msg, duration = 6000) => {
    setSnackbarMessage(msg);
    setSnackbarDuration(duration);
    setOpenSnackbar(true);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleLoginStatus = (allowLogoutOption = false) => {
    setLogoutOption(allowLogoutOption);
    setLoginStatusTrigger(loginStatusTrigger + 1);
  };

  return (
    // <div className={classes.root}>
    <div sx={{ ...theme.root }}>
      <CssBaseline />
      <AppBar
        position="static"
        sx={{
          "& > div": {
            marginBottom: 0,
          },
        }}
        // className={clsx(classes.appBar, {
        //   [classes.appBarShift]: drawerOpen,
        // })}
      >
        <Toolbar disableGutters variant="dense" sx={{ ...toolBar }}>
          <Tooltip title="Filters">
            <span>
              <IconButton
                sx={{
                  ...menuButton,
                  color: theme.palette.sistema.klipit.contrastText,
                }}
                //color="inherit"
                onClick={handleDrawerOpen}
                disabled={pageFilters.length === 0}
                // className={clsx(classes.menuButton, drawerOpen && classes.hide)}
              >
                {/* </FilterListIcon> */}
                <FilterAltOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Go To Homepage">
            <Typography
              variant="h4"
              sx={{
                ...title,
                color: theme.palette.sistema.klipit.contrastText,
              }}
            >
              <Link
                component="button"
                sx={{
                  ...title,
                  color: theme.palette.sistema.klipit.contrastText,
                  //backgroundColor:'yellow'
                }}
                variant="h3"
                underline="none"
                onClick={() => {
                  history("/");
                }}
              >
                sistema
              </Link>
            </Typography>
          </Tooltip>
          <Typography variant="h5" sx={{ ...title }}>
            {pageTitle}
          </Typography>
          <CurrentDate sx={{ ...title }} />
          <Tooltip
            title={user.userid === "" ? "Login" : "Logout"}
            placement="bottom"
          >
            <IconButton
              sx={{ accountIcon }}
              onClick={() => handleLoginStatus(true)}
              color="inherit"
            >
              {user.userid === "" ? (
                <Avatar src={user.avatar} />
              ) : (
                <Avatar src={user.avatar}>
                  {user.userid.substr(0, 1).toUpperCase() +
                    user.userid.substr(user.userid.length - 1, 1).toUpperCase()}
                </Avatar>
              )}
            </IconButton>
          </Tooltip>
          <UserLogin
            loginStatusTrigger={loginStatusTrigger}
            allowLogout={logoutOption}
            user={user}
            setUser={setUser}
          />
        </Toolbar>
        <Drawer
          variant="persistent"
          anchor="left"
          open={drawerOpen}
          sx={{
            paper: drawerPaper,
          }}
          // classes={{
          //   root: classes.drawer,
          //   paper: classes.drawerPaper,
          // }}
        >
          <div sx={{ drawerHeader }}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <Container>
            <form noValidate autoComplete="off" sx={{ ...root }}>
              {pageFilters.length > 0 &&
                pageFilters.map((f) => {
                  return (
                    <TextField
                      key={f.id}
                      sx={{ formField }}
                      select
                      label={f.label}
                      fullWidth
                      margin="normal"
                      value={f.currentValue}
                      className="vertical-dropdown"
                      onChange={(e) =>
                        setPageFilters(
                          pageFilters.map((pf) =>
                            pf.id !== f.id
                              ? pf
                              : {
                                  id: pf.id,
                                  label: pf.label,
                                  filterValues: pf.filterValues,
                                  currentValue: e.target.value,
                                }
                          )
                        )
                      }
                    >
                      {f.filterValues.map((val) => (
                        <MenuItem key={val} value={val}>
                          {val}
                        </MenuItem>
                      ))}
                    </TextField>
                  );
                })}
            </form>
          </Container>
        </Drawer>
      </AppBar>
      <main
      // className={clsx(classes.content, {
      //   [classes.contentShift]: drawerOpen,
      // })}
      >
        <Box display="flex">
          <Box width="1%" />
          <SistemaContext.Provider
            value={{
              setPageTitle,
              setPageFilters,
              pageFilters,
              handleLoginStatus,
              userid: user.userid,
              showSnackbarMessage,
            }}
          >
            <Box width="100%" mt={1}>
              {props.children}
            </Box>
          </SistemaContext.Provider>
          <Box width="1%" />
        </Box>
      </main>
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        autoHideDuration={snackbarDuration}
        message={snackbarMessage}
        onClose={() => setOpenSnackbar(false)}
      />
    </div>
  );
}
