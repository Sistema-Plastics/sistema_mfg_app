import React, { useRef, useState } from "react";
import QrReader from "react-qr-scanner";

export default function CodeScanner(props) {
  const [result, setResult] = useState("No code found.");
  const delay = props.delay;
  const onError = props.onError;
  const onScan = props.onScan;
  const previewStyle = {
    height: 240,
    width: 320,
  };

  //   function handleScan(data) {
  //     setResult(data);
  //     setScan(!scan);
  //   }

  //   function handleError(err) {
  //     console.log(err);
  //     setResult(
  //       "A problem occured while scanning the code. Either try again or replace code."
  //     );
  //     setScan(!scan);
  //   }

  return (
    <>
      {console.log("result: ", result)}
      <QrReader
        delay={delay}
        style={previewStyle}
        onError={onError}
        onScan={onScan}
      />
      <p>{result}</p>
    </>
  );
}
