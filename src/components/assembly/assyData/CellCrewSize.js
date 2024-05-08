//Use this to get the estimated crewsize for each cell
//note that the date parameter filters out jobs with operation start dates <= date

// import Axios from "axios";
// import { baseURL } from "../../../ConnectionBroker";
// import moment from "moment";
// import { axiosConfigs, generalFunctions } from "../../../helpers/HelperScripts";

const cellCrewSize = (dateParam, cells) => {
  let retVal = [
    {
      cellID: "005",
      line: "ABK-B4",
      crewSize: 5,
    },
    {
      cellID: "007",
      line: "L01",
      crewSize: 5,
    },
    {
      cellID: "007",
      line: "L02",
      crewSize: 5,
    },
    {
      cellID: "008",
      line: "K02",
      crewSize: 5,
    },
    {
      cellID: "009",
      line: "N01",
      crewSize: 5,
    },
    {
      cellID: "010",
      line: "NB01",
      crewSize: 6,
    },
    {
      cellID: "010",
      line: "NB02",
      crewSize: 6,
    },
  ];

  
  if (typeof dateParam !== "undefined") retVal = 1;

  // console.log("dateParam", dateParam);
  // var cellCrewSize = [];
  // let tempCellCrewSize = [];
  // let date = generalFunctions.composeDateTime(dateParam, "UTC");
  // // let date = generalFunctions.composeDateTime(dateParam, "dateTime");
  // console.log("date", date);
  // let getCellCrewSize = await Axios.get(
  //   `${baseURL}/BaqSvc/ASSY_CellCrewSize/?date=${date}`,
  //   axiosConfigs.config("GET")
  // );

  if (typeof cells !== "undefined") retVal = 1;

  const rv = cells.map((c) => {
    let r = {
      cellID: c.Cell_c,
      line: c.ResourceID,
      crewSize: parseInt(c.ProdCrewSize),
    };
    return r;
  });
  retVal = rv;

  //add in blank shift for unavail
  retVal.unshift({ cellID: "0", line: "0", crewSize: 0 });

  // let retCellCrewSize = getCellCrewSize.data.value;
  // console.log("retCellCrewSize", retCellCrewSize);
  // retCellCrewSize.length === 0
  //   ? (tempCellCrewSize = [])
  //   : (tempCellCrewSize = retCellCrewSize.map((e) => {
  //       let renamedE = {
  //         cellID: e.Resource_Cell_c,
  //         line: e.Resource_ResourceID,
  //         crewSize: parseInt(e.JobOpDtl_ProdCrewSize),
  //       };
  //       return renamedE;
  //     }));

  // let lines = [...new Set(tempCellCrewSize.map((a) => a.line))];

  // //get crew size of distinct lines(max crew size in BAQ)
  // for (let index = 0; index < lines.length; index++) {
  //   const element = lines[index];
  //   let lineMaxCrewSize = tempCellCrewSize.filter((a) => a.line === element)[0];
  //   cellCrewSize.push(lineMaxCrewSize);
  // }

  // cellCrewSize = tempCellCrewSize;
  // return cellCrewSize;
  return retVal;
};
export default cellCrewSize;
