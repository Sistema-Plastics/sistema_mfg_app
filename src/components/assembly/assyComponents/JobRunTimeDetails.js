import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function JobRunTimeDetails(props) {
  let currentJob = props.currentJob;
  let nextJob = props.nextJob;
  let prodDtl = currentJob.prodDtl;
  let totLaborQty = prodDtl.reduce(function (total, dtl) {
    return total + +dtl.LaborDtl_LaborQty;
  }, 0);
  console.log("nextJob", nextJob);
  const [setUpTimeLeft, setSetUpTimeLeft] = useState(0);
  let actualManHours = parseFloat(
    prodDtl.reduce(function (total, dtl) {
      return total + +dtl.LaborDtl_LaborHrs;
    }, 0)
  ).toFixed(2);
  let stdManHours = parseFloat(
    (currentJob.prodCrewSize * (totLaborQty / currentJob.prodStd)) / 60
  ).toFixed(2);
  let jobEfficiency =
    stdManHours > 0
      ? parseFloat((stdManHours / actualManHours) * 100).toFixed(2)
      : 0;

  useEffect(() => {
    if (nextJob !== undefined) {
      setInterval(() => {
        timeRemaining(new Date(), new Date(nextJob.setUpEndDateTime));
      }, 60000);
    }
  }, []);

  function timeRemaining(date1, date2) {
    if (nextJob.setupIsComplete === "NO") {
      const diffInMs = date2 - date1;
      let diffInMin = diffInMs / (1000 * 60);
      setSetUpTimeLeft(parseFloat(diffInMin).toFixed(2));
    } else {
      setSetUpTimeLeft(0);
    }
  }

  function handleJobSelect(job) {
    window.location.href = `/Assembly/ProductionBooking/?job=${job}`;
  }
  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <h6>Part - Run Time Details</h6>
            <table>
              <tbody>
                <tr>
                  <th style={{ width: 260 }}>Required Crew Size</th>
                  <td>{currentJob.prodCrewSize}</td>
                </tr>
                <tr>
                  <th>Standard Cycle Time (pc/min)</th>
                  <td>{currentJob.prodStd}</td>
                </tr>
                <tr>
                  <th>Pallet Quantity</th>
                  <td>{currentJob.palletQty}</td>
                </tr>
                <tr>
                  <th>Hour per Pallet</th>
                  <td>
                    {parseFloat(
                      currentJob.palletQty / currentJob.prodStd / 60
                    ).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        <Row>
          <Col>
            <h6>Current Job Details - Production Activity</h6>
            <table>
              <tbody>
                <tr>
                  {/* <th style={{ width: 260 }}>Required Crew Size</th> */}
                  <th>Required Crew Size</th>
                  <td>{currentJob.prodCrewSize}</td>
                </tr>
                <tr>
                  <th>Job Quantity</th>
                  <td>{currentJob.qtyReqd}</td>
                </tr>
                <tr>
                  <th>No. of Pallets Required</th>
                  <td>
                    {parseInt(
                      currentJob.qtyReqd / currentJob.palletQty
                    ).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <th>Start Date/Time</th>
                  <td>{currentJob.startDate}</td>
                </tr>
                <tr>
                  <th>Expected End Time</th>
                  <td>{currentJob.endDate}</td>
                </tr>
                <tr>
                  <th>Quantity Completed</th>
                  <td>{currentJob.qtyDone}</td>
                </tr>
                <tr>
                  <th>Standard Labour Hours</th>
                  <td>{stdManHours}</td>
                </tr>
                <tr>
                  <th>Actual Labour Hours</th>
                  <td>{actualManHours}</td>
                </tr>
                <tr>
                  <th>Total Down Time</th>
                  <td></td>
                </tr>
                <tr>
                  <th>Job Efficiency</th>
                  <td>{jobEfficiency}%</td>
                </tr>
                <tr>
                  <th>Quantity Remaining</th>
                  <td>{currentJob.qtyLeft}</td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col>
            <h6>Next Job Details - Set-up Activity</h6>
            {nextJob === undefined ? (
              <Container>
                <p>There are no more jobs running after this.</p>
              </Container>
            ) : (
              <table>
                <tbody>
                  <tr>
                    {/* <th style={{ width: 260 }}>Next Scheduled Job</th> */}
                    <th>Next Scheduled Job</th>
                    {/* <td onClick={() => handleJobSelect}> */}
                    <td>
                      <Link
                        to={`/Assembly/ProductionBooking/?job=${nextJob.jobNum}`}
                        target="_blank"
                      >
                        {nextJob.jobNum}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <th>Required Crew Size</th>
                    <td>{nextJob.setupCrewSize}</td>
                  </tr>
                  <tr>
                    <th>Previous Production Complete</th>
                    <td>
                      {nextJob.jobLabourDtl.length > 0
                        ? parseFloat(
                            nextJob.jobLabourDtl[
                              nextJob.jobLabourDtl.length - 1
                            ].LaborDtl_LaborQty
                          ).toFixed(2)
                        : parseFloat(0).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <th>Setup Start Time</th>
                    <td>{nextJob.setUpStartDateTime}</td>
                  </tr>
                  <tr>
                    <th>
                      {nextJob.setupIsComplete === "YES"
                        ? "Setup End Time"
                        : "Expected End Time"}
                    </th>
                    <td>{nextJob.setUpEndDateTime}</td>
                  </tr>
                  <tr>
                    <th>Setup Remaining Minutes</th>
                    <td>
                      {nextJob.currentActivity === "S" ? setUpTimeLeft : null}
                    </td>
                  </tr>
                  <tr>
                    <th>Setup Complete</th>
                    <td>{nextJob.setupIsComplete}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
