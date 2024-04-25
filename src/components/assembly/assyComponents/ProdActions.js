import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { IoIosStopwatch } from "react-icons/io";
import { ImClipboard } from "react-icons/im";
import PalletStatus from "./PalletStatus";
import "../../../App.css";
import { IconContext } from "react-icons";

export default function ProdActions(props) {
  const handleQtyBooking = props.handleQtyBooking;
  // const handleDowntimeStart = props.handleDowntimeStart;
  // const handleDowntimeEnd = props.handleDowntimeEnd;
  const onInputChange = props.onInputChange;
  const job = props.job;
  const bookedQty = props.bookedQty;
  const setupIsComplete = job.setupIsComplete === "YES" ? true : false;
  return (
    <>
      <Container fluid>
        <Row style={{ textAlign: "center" }}>
          <Col xs={2}></Col>
          <Col xs={2}>
            {/* <IoIosStopwatch
              className="iconSubHeader"
              onClick={handleDowntimeStart}
              title="Start Downtime"
              alt="Start Downtime"
              type="submit"
            />
            <p>Downtime</p> */}
          </Col>
          <Col xs={2}></Col>
          <Col
            style={{
              color: setupIsComplete ? "black" : "grey",
            }}
          >
            <IconContext.Provider
              value={{ color: setupIsComplete ? "grey" : "black" }}
            >
              <ImClipboard
                className="iconSubHeader"
                style={{
                  fill: setupIsComplete ? "black" : "grey",
                }}
                onClick={setupIsComplete ? handleQtyBooking : null}
                title="Book Completed Quantity"
                alt="Book Completed Quantity"
                type="submit"
              />
              <p>Book Qty</p>
            </IconContext.Provider>
            {/* <div>
              <Button
                className="buttonFullWidth"
                onClick={handleQtyBooking}
                disabled={job.setupIsComplete === "NO"}
              >
                Book Completed Quantity
              </Button>
            </div> */}
          </Col>
        </Row>
        <Row>
          <PalletStatus
            job={job}
            onInputChange={onInputChange}
            bookedQty={bookedQty}
            activeLabor={props.activeLabor}
            expandDetails={props.expandDetails}
            setExpandDetails={props.setExpandDetails}
          />
        </Row>
        {/*<Row>
          <Col>
             <div> 
            <Button className="buttonFullWidth" onClick={handleDowntimeStart}>
                Start Downtime
              </Button> 
           </div> 
            <div>
              <Button className="buttonFullWidth" onClick={handleDowntimeEnd}>
                End Downtime
              </Button>
            </div> 
          </Col>
        </Row>*/}
      </Container>
    </>
  );
}
