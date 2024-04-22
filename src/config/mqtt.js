import mqtt from "mqtt";
import { mqttFunctions } from "../helpers/HelperScripts";

// https://www.hivemq.com/blog/ultimate-guide-on-how-to-use-mqtt-with-node-js/

const client = mqtt.connect(
  mqttFunctions.getHostname(),
  mqttFunctions.getOptions("mqtt", Math.random().toString(16).substring(2, 8))
);

client.on("connect", function () {
  console.log("connected");
});

export default client;
