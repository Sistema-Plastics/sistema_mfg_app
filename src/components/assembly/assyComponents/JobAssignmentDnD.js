import React, { useEffect, useState } from "react";
import moment from "moment";
import Board from "react-trello";
import { Container, Row, Col, Spinner } from "react-bootstrap";

import assyEmployees from "../assyData/EmpList";
import activeLabour from "../assyData/ActiveLabour";

import PageAlert from "../../../assets/components/Alerts";

import { loaderStyle } from "../../../assets/styling/Base";
import "../../../App.css";
import "../../../index.css";
import "../../../assets/styling/Element.css";

export default function JobAssignments(props) {
  const job = props.job.jobNum;
  const cell = props.job.cellID;

  useEffect(() => {
    Promise.all([assyEmployees(), activeLabour(job)])
      .then((res) => {
        let getAvailEmployees = res[0];
        let getClockedEmployees = res[1];
      })
      .catch((err) => console.log(err))
      .finally(() => console.log("done"));
  });

  return <>{console.log("cell", cell)}</>;
}
