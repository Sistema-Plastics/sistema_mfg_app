//This is the page where Drag and drop of employees are saved to TempCell_c
import React, { useEffect, useRef, useState } from "react";
import Board from "react-trello";
import { BiSave, BiArrowBack } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { Col, Spinner, Row, Container } from "react-bootstrap";

import PageAlert from "../../../assets/components/Alerts";
import Title from "../../../assets/components/Title";

import {
  dragDropFunctions,
  operationsFunctions,
  generalFunctions,
} from "../../../helpers/HelperScripts";

import assyCells from "../assyData/Cells";
import assyEmployees from "../assyData/EmpList";
import cellCrewSize from "../assyData/CellCrewSize";
import shifts from "../../../helpers/data/Shifts";
import MyLaneHeader from "../assyComponents/LaneHeader";

import { MyScrollableLane, loaderStyle } from "../../../assets/styling/Base";
import "react-dropdown/style.css";
import "../../../App.css";
import "../../../index.css";
import "../../../assets/styling/Element.css";

export default function EmployeeCellPlanDnd() {
  const getParams = new URLSearchParams(useLocation().search);
  const currentDate = new Date();
  const title = "Shift Assignment Plan";
  // const shiftDateParam = useRef(moment().format("DD/MM/YY"));
  const shiftDateParam = useRef(new Date());
  const shiftParam = useRef(getParams.get("shift"));
  const shiftDescParam = useRef(getParams.get("shiftDesc"));
  const endResult = useRef([]);
  const toPost = useRef([]);
  const laneData = useRef();
  const allShifts = useRef([]);
  const shiftDesc = useRef("");
  const nextShiftDate = useRef("");
  const cellCrewSizeArray = useRef([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState({});
  const cells = useRef([]);
  const employees = useRef([]);
  const myComponents = {
    LaneHeader: MyLaneHeader,
    ScrollableLane: MyScrollableLane,
  };
  const dateFormat = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };

  function onDataChange(newData) {
    let i = 0;
    let count = 0;
    for (i = 0; i < newData.lanes.length; i++) {
      try {
        count = newData.lanes[i].cards.length;
        newData.lanes[i].label = count.toString();
      } catch (error) {
        console.log(error);
      } finally {
        laneData.current = newData;
      }
    }
  }

  function handleDragEnd(
    cardId,
    sourceLaneId,
    targetLaneId,
    position,
    cardDetails
  ) {
    let tempToPost = dragDropFunctions.handleDragEnd(
      cardId,
      sourceLaneId,
      targetLaneId,
      position,
      cardDetails
    );
    let filter = toPost.current.filter((c) => c.id === tempToPost.id);
    for (let i = 0; i < filter.length; i++) {
      let e = toPost.current.indexOf(filter[i]);
      toPost.current.splice(e, 1);
    }
    toPost.current.push(tempToPost);
  }

  async function savePlan() {
    setIsProcessing(true);

    let tempResult = dragDropFunctions.savePlan(toPost.current, "TempCell_c");
    tempResult.then((res) => {
      endResult.current = res;
      if (endResult.current.some((r) => r.status !== 201)) {
        setError(true);
        setErrorMsg(
          "An error occurred when assigning some employees to cells. Refresh the page and try again"
        );
        setIsLoaded(!isLoaded);
      } else {
        setSuccess(true);
        setIsLoaded(!isLoaded);
      }
    });
  }

  function clear() {
    employees.current.forEach((emp) => {
      operationsFunctions.clockInOutMES(emp.id, "ClockOut");
    });
  }

  useEffect(() => {
    shifts()
      .then((res) => {
        allShifts.current = res;
        console.log("shifts", allShifts.current);

        shiftDesc.current = shiftDescParam.current;
        let tempShift = allShifts.current.filter(
          (s) => s.shiftID === parseInt(shiftParam.current)
        )[0];
        console.log("tempShift", tempShift);

        let tempNextShiftDate = tempShift.startDateTimeActual;
        if (tempShift.shiftID === 8 || tempShift.shiftID === 9) {
          tempNextShiftDate = tempShift.startDateTimeActual;
        } else {
          tempNextShiftDate = tempNextShiftDate.setTime(
            tempNextShiftDate.getTime() + 1 * 86400000
          );
        }

        // nextShiftDate.current = new Date(tempNextShiftDate);
        nextShiftDate.current = generalFunctions.composeDateTime(
          tempShift.startDateTimeActual,
          "dateOnly"
        );
        console.log("nextShiftDate.current", nextShiftDate.current);
      })
      .catch((err) => {
        setError(true);
        setErrorMsg("No valid shifts were identified.");
        console.log("error in shift promise: ", err);
      })
      .finally();
  }, []);

  useEffect(() => {
    // switch (parseInt(shiftParam.current)) {
    //   case 2:
    //   case 7:
    //     shiftDate.current = currentDate;
    //     break;
    //   default:
    //     shiftDate.current = new Date(
    //       currentDate.setTime(currentDate.getTime() + 1 * 86400000)
    //     );
    //     shiftDateParam.current = moment(shiftDate.current).format("DD/MM/YY");
    //     break;
    // }
    // shiftDesc.current = shiftDescParam.current;
    // shiftDate.current = shiftDate.current.toLocaleDateString(
    //   "en-NZ",
    //   dateFormat
    // );
    //       currentDate.setTime(currentDate.getTime() + 1 * 86400000)
    //     );
    toPost.current = [];
    Promise.all([
      assyCells(),
      assyEmployees(shiftDateParam.current),
      cellCrewSize(shiftDateParam.current),
    ])
      .then((res) => {
        cells.current = res[0];
        employees.current = res[1];
        cellCrewSizeArray.current = res[2];

        let availLane = dragDropFunctions.createSourceLane(
          employees.current,
          shiftParam.current,
          "tempAvail"
        );
        let tempLanes = dragDropFunctions.createAssignedLane(
          cells.current,
          cellCrewSizeArray.current,
          employees.current,
          shiftParam.current,
          "tempCell"
        );
        // let mfgLane = dragDropFunctions.createMfgLane(
        //   employees.current,
        //   shiftParam.current
        // );
        tempLanes.unshift(availLane);
        // tempLanes.push(mfgLane);
        let tempData = { lanes: tempLanes };
        setData(tempData);
      })
      .catch((err) => {
        setError(true);
        setErrorMsg(err);
      })
      .finally(() => setIsProcessing(false));
    // eslint-disable-next-line
  }, [isLoaded]);

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
        <div>
          <Spinner animation="border" variant="primary" style={loaderStyle} />
        </div>
      ) : (
        <>
          {success ? (
            <PageAlert
              header="Roster saved!"
              body="Planning tomorrow's cell assignments done."
              variant="success"
            />
          ) : null}
          <Container fluid>
            <Row>
              <Col xs={1}>
                <Link to={`/Assembly/AssemblyNav?shift=${shiftParam.current}`}>
                  <BiArrowBack className="iconHeader" title="Back" />
                </Link>
              </Col>
              <Col>
                <h2>
                  {`${shiftDesc.current} Shift Assignment Plan for
                  ${nextShiftDate.current}`}
                </h2>
              </Col>
              <Col xs={1}>
                <BiSave
                  onClick={() => savePlan()}
                  title="Save"
                  className="iconHeader"
                />
              </Col>
            </Row>
          </Container>
          <Board
            style={{
              backgroundColor: "transparent",
              maxHeight: "80vh",
              // justifyContent: "center",
            }}
            data={data}
            hideCardDeleteIcon={true}
            handleDragEnd={handleDragEnd}
            onDataChange={onDataChange}
            draggable={true}
            laneSortFunction={dragDropFunctions.laneSortFunction}
            components={myComponents}
          />
          {/* <button onClick={() => clear()}>Clock Out Everyone</button> */}
        </>
      )}
    </>
  );
}
