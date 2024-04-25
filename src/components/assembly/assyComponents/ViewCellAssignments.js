import React, { useRef, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { BsDisplay } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function ViewCellAssignments(props) {
  const cells = useRef(props.cells);
  const shifts = useRef(props.shifts);
  const [selectedShift, setSelectedShift] = useState(1);
  const [shiftParam, setShiftParam] = useState(1);
  const [cellParamText, setCellParamText] = useState("");
  const cellParamArr = useRef([]);

  function handleOnCellSelect(cell, event) {
    let tempCellParam = cellParamArr.current;
    if (event.target.checked) {
      tempCellParam.push(cell.cellID);
      cellParamArr.current = tempCellParam;
    } else {
      let index = tempCellParam.indexOf(event.target.value);
      if (index !== -1) {
        tempCellParam.splice(index, 1);
        cellParamArr.current = tempCellParam;
      }
    }
    setCellParamText(tempCellParam.join("_"));
  }

  function handleOnShiftChange(props) {
    setShiftParam(props.shiftID);
    setSelectedShift(props.shiftID);
  }

  return (
    <>
      <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container style={{ border: "1px solid darkgray" }}>
            <Row style={{ fontWeight: "bold" }}>
              <Col>Shifts</Col>
              <Col>Cells</Col>
            </Row>
            <Row>
              <Col>
                {shifts.current.map((s, index) => (
                  <div key={index}>
                    <p>
                      <input
                        id={s.shiftID}
                        value={s.shiftID}
                        name={s.shiftDesc}
                        checked={selectedShift === s.shiftID}
                        onChange={() => handleOnShiftChange(s)}
                        type="radio"
                      />{" "}
                      {s.shiftDesc}
                    </p>
                  </div>
                ))}
              </Col>
              <Col>
                {cells.current.map((c, index) => (
                  <div key={index}>
                    <p>
                      <input
                        id={c.cellID}
                        value={c.cellID}
                        name={c.cellDesc}
                        onChange={(e) => handleOnCellSelect(c, e)}
                        type="checkbox"
                      />{" "}
                      {c.cellDesc}
                    </p>
                  </div>
                ))}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Link
            to={`/Assembly/EmployeeCellCurrentDB?shift=${shiftParam}&cell=${cellParamText}`}
            target="_blank"
          >
            <BsDisplay className="iconBody" title="Display cell assignments" />
          </Link>
        </Modal.Footer>
      </Modal>
    </>
  );
}
