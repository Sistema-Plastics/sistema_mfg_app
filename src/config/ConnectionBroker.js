export const connections = {
  getBaseURLfromPort: function (urlRef) {
    let baseURL = "https://aauc3spwntsk001.nr.ad.newellco.com/epicorerp10/api/v1/";

    const webPort = Number(window.location.port);
    switch (webPort) {
      case 5000:
      case 8080:
      case 443:
        baseURL =
          "https://aauc3spwntsk001.nr.ad.newellco.com/epicorerp10/api/v1/";
        break;

      //Test connection on iis001
      case 5500:
      case 5001:
      case 5002:
      case 8081: 
        baseURL = "https://dc1nwnepr001.nr.ad.newellco.com/ERP10TESTO/api/v1/";

        break;
      //typical local ports for VS Code testing
      case 3000:
      case 3001:
      case 3002:
      case 3003:
      default:
      
        baseURL = "https://dc1nwnepr001.nr.ad.newellco.com/ERP10TESTO/api/v1/";
        break;
    }

    console.log(`Port ${webPort}  so API URL ${baseURL}`);
    return baseURL;
  },

  getMQTTServerFromPort: function (urlRef) {
    const webPort = Number(window.location.port);

    let srvr = "";

    switch (webPort) {
      case 44301:
      case 8080:
      case 5001:
      case 443:
      default:
        srvr = "ws://10.92.0.168:9001/ws";
    }
  },

  getMQTTOptionnsWS: function () {
    const options = {
      port: 9001,
      username: "pub_client",
      password: "password",
      clientId:
        "mqttjs_" +
        Number(window.location.port) +
        "_" +
        Math.random().toString(16).substr(2, 8),
    };
    return options;
  },

  getBaseMQTTTopicFromPort: function () {
    let baseTopic = "food/st04/";

    const webPort = Number(window.location.port);
    switch (webPort) {
      case 44301:
      case 8080:
      case 5001:
      case 443:
        {
          console.log(
            "Port " + webPort + " so live server Topic base is food/st04"
          );
        }
        baseTopic = "food/st04/";
        break;

      default:
        {
          console.log(
            "Port " + webPort + " so logging to test Topic Base test/food/st04"
          );
        }
        baseTopic = "test/food/st04/";
        break;
    }
    return baseTopic;
  },
};

export const baseURL = connections.getBaseURLfromPort(window.location);
