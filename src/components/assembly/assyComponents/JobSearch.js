import React, { useRef, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { BiScan, BiSearchAlt2 } from "react-icons/bi";
import { AiFillSecurityScan, AiOutlineClear } from "react-icons/ai";
import CodeScanner from "../../../assets/components/CodeScan";

import { generalFunctions } from "../../../helpers/HelperScripts";

import "../../../App.css";

export default function () {
  var criteria = {
    job: undefined,
    employee: undefined,
    line: undefined,
  };
  const [scan, setScan] = useState(false);
  const [result, setResult] = useState("No code found.");
  const delay = useRef(100);
  const ref = useRef(1);

  function inputCheck(e) {
    let filter = e.target.getAttribute("filter");
    e.target.value = e.target.value
      .replace(new RegExp(filter, "g"), "")
      .toUpperCase();
    criteria[e.target.name] = e.target.value;
    ref.current = parseInt(e.target.id, 10) + 1;
    console.log("ref.current", ref.current);
    if (e.target.value.length === e.target.maxLength) {
      document.getElementById(ref.current).focus();
      if (ref.current === 3) {
        onSearch();
      }
    }
  }

  function onSearch() {
    if (criteria.line === undefined || criteria.employee === undefined) {
      alert("Both job and employee IDs are required.");
    } else {
      generalFunctions.updateURLQueryParam("line", criteria.line);
      generalFunctions.updateURLQueryParam("employee", criteria.employee);
      window.location.reload();
    }
  }

  function onReset() {
    document.getElementById("search").reset();
  }

  function handleScan(data) {
    console.log("data", data);
    setResult(data);
    setScan(!scan);
  }

  function handleError(err) {
    console.log(err);
    setResult("No scanning device was detected.");
    setScan(!scan);
  }

  return (
    <>
      {scan ? (
        <CodeScanner
          delay={delay}
          onError={() => handleError()}
          onScan={() => handleScan()}
          legacyMode
        />
      ) : (
        <form id="search">
          <Container>
            <Row
              style={{ justifyContent: "left" }}
              className="justify-content-md-center"
            >
              <Col xs={{ span: 2, offset: 3 }} style={{ textAlign: "right" }}>
                Line:
              </Col>
              <Col xs={6}>
                <input
                  id={1}
                  type="text"
                  maxLength="10"
                  name="line"
                  value={criteria.line}
                  placeholder="Line ID"
                  onChange={(e) => inputCheck(e)}
                  autoFocus
                />
              </Col>
            </Row>
            <Row
              style={{ justifyContent: "left" }}
              className="justify-content-md-center"
            >
              <Col xs={{ span: 2, offset: 3 }} style={{ textAlign: "right" }}>
                Employee:
              </Col>
              <Col xs={6}>
                <input
                  id={2}
                  type="text"
                  filter="[^0-9]"
                  name="employee"
                  maxLength="6"
                  value={criteria.employee}
                  placeholder="Employee Number"
                  onChange={(e) => inputCheck(e)}
                />
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col xs={{ span: 4.5, offset: 1.5 }}>
                <AiOutlineClear
                  onClick={() => onReset()}
                  className="iconBody"
                  title="Clear search"
                />
              </Col>
              <Col xs={4.5}>
                <BiSearchAlt2
                  id={3}
                  onClick={() => onSearch()}
                  className="iconBody"
                  title="Search"
                />
              </Col>
            </Row>
          </Container>
        </form>
      )}
    </>
  );
}
