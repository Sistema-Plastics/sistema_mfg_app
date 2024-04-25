import React, { useEffect } from "react";
import Axios from "axios";
import { baseURL } from "../../../ConnectionBroker";
import { axiosConfigs } from "../../../helpers/HelperScripts";
import Modal from "react-bootstrap/modal";

export default function Indirects(props) {
  let show = props.show;
  let onHide = props.onHide;

  useEffect(() => {
    let getIndirectCodes = await Axios.get(
      `${baseURL}/BaqSvc/Erp.BO.IndirectSvc/List`,
      axiosConfigs.config("GET")
    );
    console.log("getIndirectCodes", getIndirectCodes);
  });

  return <></>;
}
