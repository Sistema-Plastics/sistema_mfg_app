import React, { useState, useContext, useEffect } from "react";
import { SistemaContext } from "../../assets/components/SistemaHeader";

import Content from "./Content";
// import * as Cookies from "../../assets/components/CookieFunctions.js";
// import * as poAPI from "../../helpers/data/POAPI";
// import ConfirmationDialog from "./ConfirmationDialog";
// import PropTypes from "prop-types";
// import { useHistory, useLocation, useParams } from "react-router-dom";
// import { useQuery } from "react-query";
//import {
//   Backdrop,
//   Box,
//   CircularProgress,
//   Fab,
//   Grid,
//   Paper,
//   Snackbar,
//   Tab,
//   Tabs,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
// } from "@material-ui/core";
// import {
//   ThumbUp as ThumbUpIcon,
//   ThumbDown as ThumbDownIcon,
// // } from "@material-ui/icons";
// import { makeStyles } from "@material-ui/core/styles";
// import { grey, green, red } from "@material-ui/core/colors";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//     "& > *": {
//       borderBottom: "unset",
//     },
//   },
//   formField: {
//     "& > label": {
//       backgroundColor: theme.palette.background.paper,
//       border: theme.palette.background.paper,
//     },
//   },
//   extendedIcon: {
//     marginRight: theme.spacing(1),
//   },
//   // fabApprove: {
//   //   margin: theme.spacing(1),
//   //   color: "#ffffff",
//   //   backgroundColor: green[600],
//   // },
//   // fabReject: {
//   //   margin: theme.spacing(1),
//   //   color: "#ffffff",
//   //   backgroundColor: red[600],
//   // },
//   table: {
//     minWidth: 650,
//   },
//   toolbarTitle: {
//     flexGrow: 1,
//   },
//   button: {
//     margin: theme.spacing(1),
//     color: grey[50],
//   },
//   backdrop: {
//     zIndex: theme.zIndex.drawer + 1,
//     color: "#fff",
//   },
// }));

const params = new URLSearchParams(window.location.pathname);

const thisClent = create_UUID();

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

const InventoryBooking = () => {
  const opt = { clientId: thisClent };
  
  useEffect(() => {
    console.log("InventoryBooking.js useEffct fire every time");
  });


  return (
    <React.Fragment>
      {/* <Connector
        brokerUrl="ws://pub_client:password@10.92.0.168:9001"
        options={opt}
      > */}
        <Content />
      {/* </Connector> */}
    </React.Fragment>
  );
};

export default InventoryBooking;
