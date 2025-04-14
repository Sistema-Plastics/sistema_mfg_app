import React, { useState, useEffect, useContext } from "react";
import { SistemaContext } from "../../assets/components/SistemaHeader";
import { Container } from "@mui/material";
import Content from "./Content";
import { connections } from "../../config/ConnectionBroker";
import mqtt from "mqtt";
import { mqttFunctions } from "./../../helpers/HelperScripts";

const InventoryBooking = () => {
    const sistemaContext = useContext(SistemaContext);
    const [isConnected, setIsConnected] = useState(false);
    const [dataComplete, setDataComplete] = useState(false);

    const [client, setClient] = useState(null);
    const params = new URLSearchParams(document.location.search);
    const mc = params.get("mcID");
    const machineID = mc ? mc.trim().toUpperCase() : "";

    const [datasets, setDatasets] = useState({
        employees: null,
        realtime: null,
        jobsopenops: null,
        machinedata: null,
        palletdata: null,
        palletdataconf: null,
        labourdtl: null,
        jobtraveller: null,
        activeJob: null,
    });

    //TODO: refresh pallet subscription

    //get base topic from config
    const baseTopic = connections.getBaseMQTTTopicFromPort();

    const pltTopic = `+/${machineID.toLowerCase()}/inventorymove/receivemfgparttoinventory`;
    const pltTopicConf = `+/${machineID.toLowerCase()}/inventorymove/receivemfgparttoinventory/confirmation`;
    const activeJob = `+/${machineID.toLowerCase()}/currentjob`;
    // const pltTopic = '+/f04/inventorymove/receivemfgparttoinventory'
    //setup topics
    let topics = [
        "systemdata/dashboards/epicor/employeeslist",
        "systemdata/dashboards/mattec/realtime",
        "systemdata/dashboards/epicor/jobsopenops",
        "systemdata/dashboards/mattec/machinedata",
        "systemdata/dashboards/epicor/labourdtl",
        "systemdata/dashboards/epicor/jobtraveller",
        pltTopic,
        pltTopicConf,
        activeJob,
    ];

    //now add bse topic as prefx
    topics = topics.map((m) => baseTopic + m);

    useEffect(() => {

        let title = "Inventory Booking";

        if (machineID) title += `- ${machineID}`;

        sistemaContext.setPageTitle(title);


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
                case topic.includes("employeeslist"):
                    // tmpDatasets.current.employees = msg;
                    setDatasets((prevState) => {
                        return { ...prevState, employees: msg };
                    });
                    break;
                case topic.includes("labourdtl"):
                    // tmpDatasets.current.employees = msg;
                    setDatasets((prevState) => {
                        return { ...prevState, labourdtl: msg };
                    });
                    break;
                case topic.includes("realtime"):
                    // tmpDatasets.current.realtime = msg;
                    setDatasets((prevState) => {
                        return { ...prevState, realtime: msg };
                    });
                    break;
                case topic.includes("jobsopenops"):
                    // tmpDatasets.current.jobs = msg;
                    setDatasets((prevState) => {
                        return { ...prevState, jobsopenops: msg };
                    });
                    break;
                case topic.includes("machinedata"):
                    // tmpDatasets.current.machinedata = msg;
                    setDatasets((prevState) => {
                        return { ...prevState, machinedata: msg };
                    });
                    break;
                case topic.includes(`confirmation`):
                    setDatasets((prevState) => {
                        return { ...prevState, palletdataconf: msg };
                    });
                    break;
                case topic.includes("receivemfgparttoinventory"):
                    //tmpDatasets.current.palletdata = msg;
                    setDatasets((prevState) => {
                        return { ...prevState, palletdata: msg };
                    });
                    break;
                case topic.includes("jobtraveller"):
                    //tmpDatasets.current.palletdata = msg;
                    setDatasets((prevState) => {
                        return { ...prevState, jobtraveller: msg };
                    });
                    break;
                case topic.includes("activeJob"):
                    setDatasets((prevState) => {
                        return { ...prevState, activejob: msg };
                    });
                    break;
                default:
            }
        });
    }, [client]);

    useEffect(() => {
        if (
            datasets.machinedata !== null &&
            datasets.jobsopenops !== null &&
            datasets.employees !== null &&
            datasets.realtime !== null &&
            datasets.labourdtl !== null &&
            datasets.jobtraveller !== null //&&
            // datasets.current.palletdata !== null
        ) {
            setDataComplete(true);
        }
    }, [datasets]);

    useEffect(() => {
        if (isConnected) {
            for (var i = 0; i < topics.length; i++) {
                client.subscribe(topics[i], function () {
                    //console.log("subscribed to ", topics[i]);
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
                <h2> {isConnected ? "Fetching Datasets" : " "}</h2>
            </Container>
        </React.Fragment>
    );

    // return (

    // );
};

export default InventoryBooking;
