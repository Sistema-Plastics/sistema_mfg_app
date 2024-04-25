import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import Dropdown from "react-dropdown";

import { generalFunctions } from "../../../helpers/HelperScripts";
import allShifts from "../../../helpers/data/Shifts";

import assyCells from "../assyData/Cells";

import Title from "../../../assets/components/Title";
import PageAlert from "../../../assets/components/Alerts";
import ViewCellAssignments from "../assyComponents/ViewCellAssignments";

//Styling
import { loaderStyle } from "../../../assets/styling/Base";
import "react-dropdown/style.css";
import "../../../App.css";
import "../../../index.css";
import "../../../assets/styling/Element.css";

export default function Navigation() {
  const getParams = new URLSearchParams(useLocation().search);
  const cells = useRef([]);
  const cellParam = useRef("");
  // const shiftParam = useRef(getParams.get("shift"));
  const shifts = useRef([]);
  // const [shiftDescParam, setShiftDescParam] = useState("");
  const [defaultShift, setDefaultShift] = useState({});
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSelection, setShowSelection] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);

  //process new shift filter
  function handleOnChange(option) {
    let selectedShift = shifts.current.filter(
      (s) => s.shiftID === option.value
    )[0];
    setDefaultShift(selectedShift);
    //   shiftParam.current = option.value;
    //   setShiftDescParam(option.label);
    //   generalFunctions.updateURLQueryParam("shift", option.value);
  }

  function onSelectionToggle() {
    setShowSelection(!showSelection);
  }

  useEffect(() => {
    setIsProcessing(true);
    Promise.all([assyCells(), allShifts()])
      .then((res) => {
        var currentShift = 5;
        let tempCells = res[0];
        let tempShifts = res[1].filter(
          (s) =>
            s.shiftDesc.startsWith("ASSY") || s.shiftDesc.startsWith("Assembly")
        );
        console.log("tempShifts", tempShifts);
        let tempCurrentShift = generalFunctions.currentShift(tempShifts);
        if (tempCurrentShift !== 99) {
          currentShift = tempCurrentShift;
        }
        console.log("currentShift", currentShift);
        let tempDefaultShift = tempShifts.filter(
          (s) => s.shiftID === currentShift
        )[0];
        console.log("tempDefaultShift", tempDefaultShift);
        let tempCellParam = tempCells.map((t) => t.cellID).join("_");

        cells.current = tempCells;
        cellParam.current = tempCellParam;
        shifts.current = tempShifts;

        // setShifts(tempShifts);
        setDefaultShift(tempDefaultShift);
        // setShiftDescParam(tempDefaultShift.shiftDesc);
        setIsProcessing(false);
      })
      .catch((err) => {
        setError(true);
        setErrorMsg(
          "There was a problem while getting the data. Please refresh page."
        );
      });
  }, []);

  return (
    <>
      {console.log("defaultShift", defaultShift)}
      {isProcessing ? (
        <div>
          <Spinner animation="border" variant="primary" style={loaderStyle} />
        </div>
      ) : (
        <>
          <Title title="Assembly Lines" />
          <Container>
            <h2>Assembly Lines</h2>
          </Container>
          <>
            {error ? (
              <PageAlert
                header="Something went wrong!"
                body={errorMsg}
                variant="danger"
              />
            ) : null}
            <Container style={{ textAlign: "center" }}>
              <Row>
                <Col>
                  <Dropdown
                    // options={shifts.map((shift) => {
                    options={shifts.current.map((shift) => {
                      let renamedShift = {
                        label: shift.shiftDesc,
                        value: shift.shiftID,
                      };
                      return renamedShift;
                    })}
                    onChange={(option) => {
                      handleOnChange(option);
                    }}
                    value={defaultShift.shiftDesc}
                    placeholder={"Select shift"}
                    className="dropdownQuarter"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Link
                    to={`/Assembly/EmployeeCellPlanDnd/?shift=${defaultShift.shiftID}&shiftDesc=${defaultShift.shiftDesc}`}
                  >
                    <Button>PLAN NEXT SHIFT</Button>
                  </Link>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Link
                    to={`/Assembly/EmployeeJobPlanDnd/?shift=${defaultShift.shiftID}&cell=005`}
                  >
                    <Button>PLAN FIRST JOBS</Button>
                  </Link>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Link
                    to={`/Assembly/EmployeeCellCurrentDnd?shift=${defaultShift.shiftID}&shiftDesc=${defaultShift.shiftDesc}`}
                  >
                    <Button> CURRENT SHIFT</Button>
                  </Link>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Link to={`/`}>
                    <Button> MAIN MENU</Button>
                  </Link>
                </Col>
              </Row>
              <Row>
                <Col>
                  {/* <Button onClick={() => setDisplayDBOptions(!displayDBOptions)}> */}
                  <Button onClick={() => onSelectionToggle()}>
                    VIEW CELL ASSIGNMENTS
                  </Button>
                </Col>
              </Row>
            </Container>
            <ViewCellAssignments
              show={showSelection}
              onHide={() => onSelectionToggle()}
              cells={cells.current}
              shifts={shifts.current}
              title="Dashboard view filter"
            />
          </>
        </>
      )}
    </>
  );
}
