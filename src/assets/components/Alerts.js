import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";

export default function PageAlert(props) {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <>
        <Alert
          variant={props.variant}
          onClose={() => setShow(false)}
          dismissible
        >
          <Alert.Heading>{props.header}</Alert.Heading>
          <div>{props.body}</div>
        </Alert>
      </>
    );
  } else return null;
}
