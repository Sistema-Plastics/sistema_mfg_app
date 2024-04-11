//use this to get all employees clocked into PayGlobal
import Axios from "axios";
import { baseURL } from "../../ConnectionBroker";
import { axiosConfigs } from "../HelperScripts";

const clockedEmployees = async () => {
  var clockedEmployees = [];

  let getClockedEmployees = await Axios.get(
    `${baseURL}/BaqSvc/GEN_EmpClockIn`,
    axiosConfigs.config("GET")
  );

  let retClockedEmployees = getClockedEmployees.data.value;

  let tempClockedEmployees = retClockedEmployees.map((s) => {
    let renamedS = {
      id: s.Calculated_Calc_EmpID,
    };
    return renamedS;
  });

  clockedEmployees = tempClockedEmployees;
  console.log("clockedEmployees in script", clockedEmployees);
  return clockedEmployees;
};
export default clockedEmployees;
