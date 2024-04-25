import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../../App.css";

export default function MyLaneHeader(props) {
  let title = props.cardDraggable ? props.title : props.title.toUpperCase();
  let label1 = props.label;
  let label2 = props.label2;
  let label3 = props.label3;
  let label4 = props.label4 === undefined ? null : `${props.label4} : `;
  let desc = props.description;
  let icon = props.icon;
  let db = !props.cardDraggable;
  if (props.id === "099") {
    label2 = undefined;
  }
  return (
    <>
      <Container
        fluid
        className="compact"
        style={{
          width: db ? "300px" : "180px",
          minHeight: 80,
        }}
      >
        <Row
          className="compact"
          style={{
            width: db ? "300px" : "180px",
          }}
        >
          <Col
            className="laneTitle"
            style={{
              fontSize: db ? "20px" : "13px",
            }}
          >
            {label4}
            {title}
          </Col>
          <Col
            xs={3}
            className="laneLabel"
            style={{
              backgroundColor:
                parseInt(label1) > parseInt(label2) ? "red" : "transparent",
              fontSize: db ? "20px" : "13px",
            }}
          >
            {label2 === undefined ? label1 : `${label1}/${label2}`}
          </Col>
        </Row>
        <hr className="compact" />
        <Row className="compact" style={{ width: db ? "300px" : "180px" }}>
          <Col className="laneTitle" style={{ fontSize: "11px" }}>
            {desc}
          </Col>
          <Col xs={3} className="laneLabel" style={{ fontSize: "11px" }}>
            {label3}
            {icon}
          </Col>
        </Row>
      </Container>
    </>
  );
}
