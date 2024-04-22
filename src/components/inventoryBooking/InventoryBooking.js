import React, { useState, useContext, useEffect, useRef } from "react";
import { SistemaContext } from "../../assets/components/SistemaHeader";
import { Container, Alert } from "@mui/material";
import { connections } from "../../config/ConnectionBroker";
import Content from "./Content";

import mqttClient from "../../config/mqtt";

const params = new URLSearchParams(window.location.pathname);

const thisClient = create_UUID();

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

const InventoryBooking = () => {
  // const [datasets, setDatasets] = useState();
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [dataComplete, setDataComplete] = useState(false);
  const opt = { clientId: thisClient };
  const [refreshSwitch, setRefreshSwitch] = useState(false);
  const params = new URLSearchParams(document.location.search);
  const machineID = params.get("mcID"); //.toLowerCase();

  const [datasets, setDatasets] = useState({
    employees: null,
    realtime: null,
    jobs: null,
    machinedata: null,
    palletdata: null,
  });

  const tmpDatasets = useRef({
    employees: null,
    realtime: null,
    jobs: null,
    machinedata: null,
    palletdata: null,
  });
  // useEffect(() => {
  //   console.log("InventoryBooking.js useEffct fire every time");

  // });
  // useEffect(() => {
  //   mqttClient.on('connect', function () {
  //     setIsConnected(true);
  //     console.log('connected');
  //   });
  //   return () => {
  //     // cancel the subscription
  //     console.log("closing");
  //   };
  // }, []);

  //get base topic from config
  const baseTopic = connections.getBaseMQTTTopicFromPort();

  const pltTopic = `+/${machineID.toLowerCase()}/inventorymove/receivemfgparttoinventory`;
  // const pltTopic = '+/f04/inventorymove/receivemfgparttoinventory'
  //setup topics
  let routingKeys = [
    "systemdata/dashboards/epicor/employeeslist",
    "systemdata/dashboards/mattec/realtime",
    "systemdata/dashboards/epicor/jobs",
    "systemdata/dashboards/mattec/machinedata",
    pltTopic,
    // "systemdata/dashboards/epicor/jobs",
    // "systemdata/dashboards/epicor/jobs",
  ];

  //now add bse topic as prefx
  routingKeys = routingKeys.map((m) => baseTopic + m);

  useEffect(() => {
    // https://www.hivemq.com/blog/ultimate-guide-on-how-to-use-mqtt-with-node-js/

    mqttClient.on("connect", function () {
      setIsConnected(true);
      console.log("connected");
    });
    mqttClient.on("end", () => {
      console.log("Connection to MQTT broker ended");
    });

    mqttClient.on("message", function (topic, message) {
      // if (topic == routingKey) {
      const msg = JSON.parse(message.toString());
      switch (true) {
        case topic.includes("employeeslist"):
          // tmpDatasets.current.employees = msg;
          setDatasets((prevState) => {
            return { ...prevState, employees: msg };
          });

          break;
        case topic.includes("realtime"):
          // tmpDatasets.current.realtime = msg;
          setDatasets((prevState) => {
            return { ...prevState, realtime: msg };
          });
          break;
        case topic.includes("jobs"):
          // tmpDatasets.current.jobs = msg;
          setDatasets((prevState) => {
            return { ...prevState, jobs: msg };
          });
          break;
        case topic.includes("machinedata"):
          // tmpDatasets.current.machinedata = msg;
          setDatasets((prevState) => {
            return { ...prevState, machinedata: msg };
          });
          break;
        case topic.includes("receivemfgparttoinventory"):
          //tmpDatasets.current.palletdata = msg;
          setDatasets((prevState) => {
            return { ...prevState, palletdata: msg };
          });
          break;
        default:
      }

      // console.log("Received  '" + topic + "'");
    });

    // return () => {
    //   console.log("logging out InvBooking");
    //   mqttClient.end({
    //     reasonCode: 0x04, // Disconnect with Will Message
    //     properties: {
    //       reasonString: "Closing connection with Will Message",
    //     },
    //   });
    // };
  }, []);
  useEffect(() => {
    if (
      datasets.machinedata !== null &&
      datasets.jobs !== null &&
      datasets.employees !== null &&
      datasets.realtime !== null //&&
      // datasets.current.palletdata !== null
    ) {
      setDataComplete(true);
    }
  }, [datasets]);
  useEffect(() => {
    if (isConnected) {
      for (var i = 0; i < routingKeys.length; i++) {
        mqttClient.subscribe(routingKeys[i], function () {
          console.log("subscribed to ", routingKeys[i]);
        });
      }
    }
  }, [isConnected]);

  return dataComplete ? (
    <React.Fragment>
      <Content machineID={machineID} ibdData={datasets} />
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Container>
        <h1> MQTT is {isConnected ? "connected" : "not connected"}</h1>
        <h2> {isConnected ? "Fetchng Datasets" : " "}</h2>
      </Container>
    </React.Fragment>
  );

  // return (

  // );
};

export default InventoryBooking;
