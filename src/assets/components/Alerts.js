import React, { useState } from "react";
import {Alert,AlertTitle} from "@mui/material";

export default function PageAlert(props) {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <>
        <Alert
          variant={props.variant}
          onClose={() => setShow(false)}
          // dismissible
        >
          <AlertTitle>{props.header}</AlertTitle>
          <div>{props.body}</div>
        </Alert>
      </>
    );
  } else return null;
}
