import appConfig from "../Config.json";
import * as Cookies from "../assets/components/CookieFunctions.js";
import axios from "axios";

import {createTheme} from "@mui/material"

import React, { useState, useEffect } from "react";
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";


const theme = createTheme();


const pwdTextFieldStyling = {
  "& > label": {
    backgroundColor: theme.palette.background.paper,
    border: theme.palette.background.paper,
  },
};
const backdrop = {
  zIndex: theme.zIndex.drawer + 1,
  color: "#fff",
}

const noUser = {
  userid: "",
  avatar: "/broken-image.jpg",
};

export default function UserLogin({
  loginStatusTrigger,
  allowLogout,
  user,
  setUser,
}) {

  const [actionType, setActionType] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [userid, setUserid] = useState("");
  const [passwd, setPasswd] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (loginStatusTrigger > 0) {
      const epicorToken = Cookies.getCookie("epicorToken");
      console.log(
        `useEffect[loginStatusTrigger(${loginStatusTrigger})] *`,
        "userid:",
        user.userid,
        "Token:",
        epicorToken != null
      );
      if (epicorToken == null) {
        setTitle("Epicor Login");
        setMessage(
          user.userid === ""
            ? ""
            : "Your session has expired. Please login again."
        );
        setUserid("");
        setPasswd("");
        setUser(noUser);

        setActionType("Login");
      } else if (allowLogout) {
        setTitle("Logout");
        setMessage("Do you wish to logout of Epicor?");
        setActionType("Logout");
      }
    }
  }, [loginStatusTrigger]);

  const handleActionButton = () => {
    if (actionType === "Login") {
      setIsValidating(true);

      // Get New Epicor Token
      const restServerURL = appConfig.ERPRestServerURL;

      const basicToken = window.btoa(userid + ":" + passwd);
      var config = {
        method: "post",
        url: restServerURL + "/Ice.LIB.TokenServiceSvc/GetAccessToken",
        headers: {
          Authorization: "Basic " + basicToken,
        },
        data: {
          clientId: "00000000-0000-0000-0000-000000000000",
          clientSecret: "",
          scope: "",
        },
      };
      axios(config)
        .then((response) => {
          const epicorToken =
            response.data.returnObj.TokenService[0].AccessToken;

          // Get additional User info
          config = {
            method: "get",
            url: `${restServerURL}/Erp.BO.UserFileSvc/UserFiles(${userid})?$select=Name%2CEMailAddress%2CCurComp`,
            headers: {
              Authorization: "Bearer " + epicorToken,
            },
          };
          axios(config)
            .then((response) => {
              Cookies.setCookie("epicorToken", epicorToken, {
                path: "/",
                expiry: 3600,
              });
              Cookies.setCookie("epicorUserID", userid, {
                path: "/",
                expiry: 3600,
              });
              setUser({
                userid: userid,
                avatar: "/broken-image.jpg",
              });
              setIsValidating(false);
              setActionType("");
            })
            .catch((error) => {
              console.log(error);
              setMessage("Unable to verify Epicor User.");
              setIsValidating(false);
            });
        })
        .catch((error) => {
          console.log(error);
          setMessage("Invalid Username/Password. Please try again.");
          setIsValidating(false);
        });
    } else if (actionType === "Logout") {
      Cookies.clearCookie("epicorToken", {
        path: "/",
      });
      Cookies.clearCookie("epicorUserID", {
        path: "/",
      });
      setUser(noUser);
      setActionType("");
    }
  };

  return (
    <React.Fragment>
      <Dialog open={actionType !== ""} onClose={() => setActionType("")}>
        <DialogTitle style={{ textAlign: "center" }}>{title}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>{message}</DialogContentText>
          {actionType === "Login" && (
            <React.Fragment>
              <Box>
                {/* <TextField
                  className={classes.formField}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="User ID"
                  value={userid}
                  onChange={(e) => setUserid(e.target.value)}
                /> */}
                <TextField
                  sx={{ ...pwdTextFieldStyling }}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="User ID"
                  value={userid}
                  onChange={(e) => setUserid(e.target.value)}
                />
              </Box>
              <Box>
                <TextField
                  sx={{ ...pwdTextFieldStyling }}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Password"
                  type="password"
                  value={passwd}
                  onChange={(e) => setPasswd(e.target.value)}
                />
              </Box>
            </React.Fragment>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleActionButton}
            variant="contained"
            color="primary"
            fullWidth
            disabled={isValidating}
          >
            {actionType}
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop sx={{ ...backdrop }} open={isValidating}>
        <CircularProgress color="primary" />
      </Backdrop>
    </React.Fragment>
  );
}
