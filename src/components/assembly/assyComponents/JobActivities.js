import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { IconContext } from "react-icons";
import { BiPackage } from "react-icons/bi";
import { FaBoxOpen } from "react-icons/fa";
import { GrChapterNext, GrPlay, GrPause } from "react-icons/gr";

import "../../../App.css";

export default function JobActivities(props) {
  const handleStartSetup = props.handleStartSetup;
  const handleCompleteSetup = props.handleCompleteSetup;
  const handleIncompleteSetup = props.handleIncompleteSetup;
  const handleStartProduction = props.handleStartProduction;
  const setupIsComplete = props.setupStatus === "YES" ? true : false;
  return (
    <Container fluid>
      <Row style={{ textAlign: "center" }}>
        <Col xs={1}></Col>
        <Col
          style={{
            color: setupIsComplete ? "grey" : "black",
          }}
        >
          <IconContext.Provider
            value={{ color: setupIsComplete ? "grey" : "black" }}
          >
            <GrPlay
              className="iconSubHeader"
              style={{
                fill: setupIsComplete ? "grey" : "black",
              }}
              onClick={setupIsComplete ? null : handleStartSetup}
              title="Start Setup"
              alt="Start Setup"
              type="submit"
            />
            <p>Setup</p>
          </IconContext.Provider>
        </Col>
        <Col
          style={{
            color: setupIsComplete ? "grey" : "black",
          }}
        >
          <IconContext.Provider
            value={{ color: setupIsComplete ? "grey" : "black" }}
          >
            <GrChapterNext
              className="iconSubHeader"
              style={{
                fill: setupIsComplete ? "grey" : "black",
              }}
              onClick={setupIsComplete ? null : handleCompleteSetup}
              title="Complete Setup"
              alt="Complete Setup"
              type="submit"
            />
            <p>Complete</p>
          </IconContext.Provider>
        </Col>
        <Col
          style={{
            color: setupIsComplete ? "grey" : "black",
          }}
        >
          <IconContext.Provider
            value={{ color: setupIsComplete ? "grey" : "black" }}
          >
            <GrPause
              className="iconSubHeader"
              style={{
                fill: setupIsComplete ? "grey" : "black",
              }}
              onClick={setupIsComplete ? null : handleIncompleteSetup}
              title="End Setup as Incomplete"
              alt="End Setup as Incomplete"
              type="submit"
            />
            <p>Incomplete</p>
          </IconContext.Provider>
        </Col>
        <Col
          style={{
            color: setupIsComplete ? "black" : "grey",
          }}
        >
          <IconContext.Provider
            value={{ color: setupIsComplete ? "black" : "grey" }}
          >
            <BiPackage
              className="iconSubHeader"
              // style={{
              //   fill: setupIsComplete ? "black" : "grey",
              // }}
              onClick={setupIsComplete ? handleStartProduction : null}
              title="Start Production"
              alt="Start Production"
              type="submit"
            />
            <p>Production</p>
          </IconContext.Provider>
        </Col>
        <Col xs={1}></Col>
      </Row>
    </Container>
  );
}
