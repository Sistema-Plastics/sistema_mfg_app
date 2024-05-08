//use this to get all assembly cells
import Axios from "axios";
import { baseURL } from "../../../ConnectionBroker";
import { axiosConfigs } from "../../../helpers/HelperScripts";

const assyCells = async () => {
  var assyCells = [];
  let retAssyCells = await Axios.get(
    `${baseURL}/BaqSvc/GEN_Cells/?$filter=LongDesc%20eq%20%20'ASPK'`,
    axiosConfigs.config("GET")
  );
  let retCells = retAssyCells.data.value;
  retCells.length === 0
    ? (assyCells = [])
    : (assyCells = retCells.map((c) => {
        let renamedC = {
          cellID: c.CodeID,
          cellDesc: c.CodeDesc,
        };
        return renamedC;
      }));
  return assyCells;
};
export default assyCells;
