import mqtt from "mqtt";
import { connections } from "./ConnectionBroker";

const client = ({ fetchJobDetails }) => {
  return mqtt.connect(
    connections.getMQTTServerFromPort(),
    connections.getMQTTOptionnsWS()
  );
};
export default client;
