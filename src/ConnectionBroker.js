export const connections = {
  getBaseURLfromPort: function (urlRef) {
    let baseURL = "https://erp-test02.sistemaplastics.com/erp104/api/v1/";

    const webPort = Number(window.location.port);
    switch (webPort) {
      case 5000:
      case 443:
        console.log(
          "Port " +
            webPort +
            " so API URL https://aauc3spwntsk001.nr.ad.newellco.com/epicorerp10/api/v1/"
        );
        baseURL =
          "https://aauc3spwntsk001.nr.ad.newellco.com/epicorerp10/api/v1/";
        break;

      //Test connection on iis001
      case 5500:
      case 5001:
      case 5002:
        console.log(
          "Port " +
            webPort +
            " so API URL https://dc1nwnepr001.nr.ad.newellco.com/ERP10TESTO/api/help/v1/"
        );
        baseURL =
          "https://dc1nwnepr001.nr.ad.newellco.com/ERP10TESTO/api/help/v1/";

        break;
      //typical local ports for VS Code testing
      case 3000:
      case 3001:
      case 3002:
      case 3003:
      default:
        console.log(
          "Port " +
            webPort +
            " so API URL https://dc1nwnepr001.nr.ad.newellco.com/ERP10TESTO/api/help/v1/"
        );

        baseURL =
          "https://dc1nwnepr001.nr.ad.newellco.com/ERP10TESTO/api/help/v1/";
        break;
    }
    return baseURL;
  },

  getBaseURLfromDebugCode: function (debugCodeNo) {
    let baseURL = "https://erp-test02.sistemaplastics.com/erp104/api/v1/";

    switch (debugCodeNo) {
      case 0:
        baseURL = "https://erp-task01.sistemaplastics.com/epicorerp10/api/v1";
        break;
      default:
    }
    return baseURL;
  },

  getBaseURLfromServerName: function (serverRef) {
    let baseURL = "";

    switch (String(serverRef).toLowerCase()) {
      case "erp-task01":
        baseURL = "https://erp-task01.sistemaplastics.com/epicorerp10/api/v1";
        break;
      case "erp-test02":
        break;
      default:
    }
    return baseURL;
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
