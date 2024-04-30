//This is the dashboard for employee cell assignments
//nothing draggable nor customizable
//just depends on the filters selected in the previous page

import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
// import { Container, Row, Col, Spinner } from "react-bootstrap";
// import Board from "react-trello";

import {
  generalFunctions,
  dragDropFunctions,
} from "../../../helpers/HelperScripts";

import assyCells from "../assyData/Cells";
import assyEmployees from "../assyData/EmpList";
import cellCrewSize from "../assyData/CellCrewSize";
import shifts from "../../../helpers/data/Shifts";

import PageAlert from "../../../assets/components/Alerts";
import Title from "../../../assets/components/Title";
import MyLaneHeader from "../assyComponents/LaneHeader";

import { MyDBScrollableLane, loaderStyle } from "../../../assets/styling/Base";
import "../../../App.css";
import "../../../index.css";
import "../../../assets/styling/Element.css";

export function MyCard(props) {
  let label = props.label;
  let name = props.title.toUpperCase();
  let cardStyle = {
    margin: "0px 0px",
    padding: "0px 0px",
    fontSize: "20px",
    textAlign: "left",
    hieght: 20,
    color: props.style.backgroundColor,
  };
  return (
    <Container
      fluid
      style={{ minWidth: "150px", fontWeight: "bold" }}
      className="compact"
    >
      <Row style={cardStyle}>
        <Col style={cardStyle}>{name}</Col>
        <Col style={cardStyle} xs={4}>
          {label}
        </Col>
      </Row>
    </Container>
  );
}

export default function EmployeeCellCurrentDB() {
  const title = "Assembly - Employee Cell Assignment";
  const getParams = new URLSearchParams(useLocation().search);
  const shiftDateParam = useRef(new Date());
  const dateTimeFilter = useRef(new Date());
  const cellParam = useRef(getParams.get("cell"));
  const shiftFilter = useRef([]);
  const shiftDescTitle = useRef("");
  const cellsRef = useRef([]);
  const employeesRef = useRef([]);
  const employeeShifts = useRef([]);
  const cellCrewSizeArray = useRef([]);
  const [cellFilter, setCellFilter] = useState([]);
  const [data, setData] = useState({});
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const myComponents = {
    Card: MyCard,
    LaneHeader: MyLaneHeader,
    ScrollableLane: MyDBScrollableLane,
  };

  function refreshWindow() {
    let tempCellParam = cellParam.current.split("_");
    let tempNewCellFilter = cellsRef.current
      .filter((c) => tempCellParam.filter((f) => c.cellID === f).length === 0)
      .map((c) => c.cellID);
    let newCellFilter = tempNewCellFilter.join("_");
    setCellFilter(tempNewCellFilter);
    cellParam.current = newCellFilter;
    generalFunctions.updateURLQueryParam("cell", newCellFilter);
  }

  useEffect(() => {
    setInterval(() => {
      window.location.reload();
    }, 300000);
  }, []);

  useEffect(() => {
    console.log("shiftDateParam.current", shiftDateParam.current);
    Promise.all([
      assyCells(),
      assyEmployees(shiftDateParam.current),
      cellCrewSize(shiftDateParam.current),
      shifts(),
    ])
      .then((res) => {
        let tempCells = res[0];
        let tempEmployees = res[1];
        let tempCrewSizeArray = res[2];
        let tempShifts = res[3];

        console.log("tempEmployees", tempEmployees);
        cellsRef.current = tempCells;
        employeesRef.current = tempEmployees;
        cellCrewSizeArray.current = tempCrewSizeArray;
        employeeShifts.current = tempShifts;
        var day = "";
        switch (dateTimeFilter.current.getDay()) {
          case 0:
            day = "Sunday";
            break;
          case 6:
            day = "Saturday";
            break;
          default:
            day = "Weekday";
        }
        shiftFilter.current = employeeShifts.current.filter(
          (t) =>
            dateTimeFilter.current >= t.startDateTimeOffset &&
            dateTimeFilter.current <= t.endDateTimeOffset &&
            (t.shiftDesc.startsWith("ASSY") ||
              t.shiftDesc.startsWith("Assembly")) &&
            t.shiftDesc.includes(day)
        )[0];
        shiftDescTitle.current = shiftFilter.current.shiftDesc;
        let tempCellFilter = cellParam.current.split("_");
        setCellFilter(tempCellFilter);
      })
      .catch((err) => {
        setError(true);
        console.log("error", err);
        setErrorMsg(
          "Something went wrong while fetching the data. Refresh page to try again."
        );
      })
      .finally(() => {
        // setInterval(() => {
        //   refreshWindow();
        // }, 30000);
        setIsProcessing(false);
      });
  }, []);

  useEffect(() => {
    //filter cells to display
    let cellsToDisplay = cellsRef.current.filter((c) =>
      cellFilter.some((f) => c.cellID === f)
    );
    let availLane = dragDropFunctions.createSourceLane(
      employeesRef.current,
      shiftFilter.current.shiftID,
      "avail"
    );

    let tempLanes = dragDropFunctions.createAssignedLane(
      cellsToDisplay,
      cellCrewSizeArray.current,
      employeesRef.current,
      shiftFilter.current.shiftID,
      "cell"
    );
    // let mfgLane = dragDropFunctions.createMfgLane(
    //   employeesRef.current,
    //   shiftFilter.current.shiftID,
    //   "cell"
    // );

    tempLanes.unshift(availLane);
    // tempLanes.push(mfgLane);
    let tempData = { lanes: tempLanes };
    setData(tempData);
  }, [cellFilter]);

  return (
    <>
      <Title title={title} />
      {error ? (
        <PageAlert
          header="Something went wrong!"
          body={errorMsg}
          variant="danger"
        />
      ) : null}
      {isProcessing ? (
        <Container
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Spinner animation="border" variant="primary" style={loaderStyle} />
        </Container>
      ) : (
        <>
          <h2>
            {title} ({shiftDescTitle.current})
          </h2>
          <Board
            style={{
              backgroundColor: "transparent",
              maxHeight: "80vh",
              justifyContent: "center",
            }}
            data={data}
            hideCardDeleteIcon={true}
            draggable
            cardDraggable={false}
            components={myComponents}
            laneSortFunction={dragDropFunctions.laneSortFunction}
          />
        </>
      )}
    </>
  );
}
