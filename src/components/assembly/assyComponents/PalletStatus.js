import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { generalFunctions } from "../../../helpers/HelperScripts";

export default function PalletStatus(props) {
  // var getHour = parseInt(job.timeLeft.split(".")[0]) * 60;
  // var getMinute = parseInt(job.timeLeft.split(".")[1]) * 60;
  var job = props.job;
  var onInputChange = props.onInputChange;
  var bookedQty = props.bookedQty;
  var lastPartialQtyBooked = job.lastPartialQtyBooked;
  var remainingPalletQty =
    job.qtyDone === job.qtyReqd
      ? 0
      : job.qtyLeft + lastPartialQtyBooked < job.palletQty
      ? job.qtyLeft
      : job.palletQty - lastPartialQtyBooked;
  var tempClockInDateTime = null;
  var tempExpEndDateTime = null;
  var palletTime = parseInt(remainingPalletQty / job.prodStd);
  const [palletTimeLeft, setPalletTimeLeft] = useState(
    job.setupIsComplete === "NO"
      ? 0
      : parseFloat(
          (job.palletQty - job.lastPartialQtyBooked) / job.prodStd
        ).toFixed(2)
  ); //in minutes
  const expEndDateTime = useRef(null);
  const clockInDateTime = useRef(null);

  useEffect(() => {
    if (
      props.activeLabor.length > 0 &&
      props.activeLabor[0].laborType === "P"
    ) {
      let activeLaborDtls = props.activeLabor[0];

      let clockInHour = parseInt(activeLaborDtls.clockInTime.split(".")[0]);
      let clockInMinute = parseInt(
        activeLaborDtls.clockInTime.split(".")[1] * 0.6
      );

      console.log("clockInHour", clockInHour);
      console.log("clockInMinute", clockInMinute);
      console.log("palletTime", palletTime);

      tempClockInDateTime = new Date(activeLaborDtls.clockInDateTime);
      tempExpEndDateTime = new Date(activeLaborDtls.clockInDateTime);
      tempClockInDateTime.setHours(clockInHour, clockInMinute);
      tempExpEndDateTime.setHours(clockInHour, clockInMinute + palletTime);

      console.log("tempClockInDateTime", tempClockInDateTime);
      console.log("tempExpEndDateTime", tempExpEndDateTime);

      let tempDiffInMs = new Date(tempExpEndDateTime) - new Date();
      let tempDiffInMin = tempDiffInMs / (1000 * 60);

      clockInDateTime.current = generalFunctions.composeDateTime(
        tempClockInDateTime,
        "dateTime"
      );
      expEndDateTime.current = generalFunctions.composeDateTime(
        tempExpEndDateTime,
        "dateTime"
      );

      console.log("clockInDateTime.current", clockInDateTime.current);
      console.log("expEndDateTime.current", expEndDateTime.current);

      setPalletTimeLeft(parseFloat(tempDiffInMin).toFixed(2));
    }
    setInterval(() => {
      timeRemaining(
        new Date(),
        expEndDateTime.current === null
          ? new Date()
          : new Date(tempExpEndDateTime)
      );
    }, 60000);
  }, []);

  function timeRemaining(date1, date2) {
    const diffInMs = date2 - date1;
    let diffInMin = diffInMs / (1000 * 60);
    setPalletTimeLeft(parseFloat(diffInMin).toFixed(2));
  }

  return (
    <Container>
      <Row style={{ textAlign: "center", fontWeight: "bold" }}>
        <Col>Current Pallet Status</Col>
      </Row>
      <Row>
        <table>
          <thead>
            <tr>
              <th>Time Started</th>
              <td>{clockInDateTime.current}</td>
            </tr>
            <tr>
              <th>Expected End Time</th>
              <td>{expEndDateTime.current}</td>
            </tr>
            <tr>
              <th>Minutes Remaining</th>
              <td>{palletTimeLeft}</td>
            </tr>
            <tr>
              <th>Partial Qty Completed</th>
              <td>{lastPartialQtyBooked}</td>
            </tr>
            <tr>
              <th>Current Qty Completed</th>
              <td>
                <input
                  name="qty"
                  type="decimal"
                  disabled={job.setupIsComplete === "NO"}
                  value={bookedQty}
                  onChange={onInputChange}
                ></input>
              </td>
            </tr>
            <tr>
              <th>Remaining Pallet Qty Required</th>
              <td>{remainingPalletQty}</td>
            </tr>
          </thead>
        </table>
      </Row>
    </Container>
  );
}
