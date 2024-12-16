import React, { useState, useContext, useEffect, useRef } from "react";
import { SistemaContext } from "../../assets/components/SistemaHeader";
import { Container } from "@mui/material";
// import Content from "./Content";

import { connections } from "../../config/ConnectionBroker";

import mqtt, { Client } from "mqtt";
import { mqttFunctions } from "../../helpers/HelperScripts";

const PickingSchedule = () => {
  //#region variables
  const [isConnected, setIsConnected] = useState(false);
  const [dataComplete, setDataComplete] = useState(false);
  const [client, setClient] = useState();
  const [datasets, setDatasets] = useState({
    jobmtlpick: null,
  });

  const baseTopic = connections.getBaseMQTTTopicFromPort();
  let topics = baseTopic + "systemdata/dashboards/epicor/jobmtlpick";

  //#endregion

  //#region useEffects
  useEffect(() => {
    // https://www.hivemq.com/blog/ultimate-guide-on-how-to-use-mqtt-with-node-js/

    setClient(
      mqtt.connect(
        mqttFunctions.getHostname(),
        mqttFunctions.getOptions(
          "mqtt",
          Math.random().toString(16).substring(2, 8)
        )
      )
    );
  }, []);

  useEffect(() => {
    if (!client) return;

    client.on("connect", function () {
      setIsConnected(true);
      console.log("connected");
    });
    client.on("end", () => {
      console.log("Connection to MQTT broker ended");
    });

    client.on("message", function (topic, message) {
      // if (topic == routingKey) {
      const msg = JSON.parse(message.toString());
      switch (true) {
        case topic.includes("jobmtlpick"):
          // tmpDatasets.current.employees = msg;
          setDatasets((prevState) => {
            return { ...prevState, jobmtlpick: msg };
          });
          break;
        default:
      }
      // console.log("Received  '" + topic + "'");
    });
  }, [client]);

  useEffect(() => {
    if (datasets.jobmtlpick !== null) {
      setDataComplete(true);
    }
  }, [datasets]);

  useEffect(() => {
    if (isConnected) {
      
      for (var i = 0; i < topics.length; i++) {
        client.subscribe(topics[i], function () {
          console.log("subscribed to ", topics[i]);
        });
      }
    }
  }, [isConnected]);
  
  //#endregion

  return dataComplete ? (
    <React.Fragment>
      {/* <Content machineID={machineID} ibdData={datasets} /> */}
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Container>
        {/* <h1> MQTT is {isConnected ? "connected" : "not connected"}</h1>
        <h2> {isConnected ? "Fetchng Datasets" : " "}</h2> */}
        <h2>Hello World!</h2>
      </Container>
    </React.Fragment>
  );

  // return (

  // );
};

export default PickingSchedule;
