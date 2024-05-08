//use this to get all assembly employees
// import Axios from "axios";
// import { baseURL } from "../../../ConnectionBroker";
// import { axiosConfigs, generalFunctions } from "../../../helpers/HelperScripts";

const assyEmployees = (dateParam, employees,clockins) => {
  //build test data for when no connection
  let retVal = [
    {
      id: "103952",
      name: "Sosefina",
      availShift: 1,
      cell: "0",
      line: "0",
      cellDesc: null,
      tempCell: "",
      tempJob: "",
      avail: true,
      tempAvail: true,
      jobAvail: true,
      pgClocked: false,
      jobClocked: false,
      currentJob: null,
      onLeave: false,
      leaveDate: null,
      labourDtls: [],
    },
    {
      id: "104028",
      name: "Sukhmanjot",
      availShift: 1,
      cell: "0",
      line: "0",
      cellDesc: null,
      tempCell: "",
      tempJob: "",
      avail: true,
      tempAvail: true,
      jobAvail: true,
      pgClocked: true,
      jobClocked: false,
      currentJob: null,
      onLeave: false,
      leaveDate: null,
      labourDtls: [],
    },
    {
      id: "103790",
      name: "Sunputhy",
      availShift: 1,
      cell: "0",
      line: "0",
      cellDesc: null,
      tempCell: "",
      tempJob: "",
      avail: true,
      tempAvail: true,
      jobAvail: true,
      pgClocked: false,
      jobClocked: false,
      currentJob: null,
      onLeave: false,
      leaveDate: null,
      labourDtls: [],
    },
    {
      id: "103886",
      name: "Teikauea",
      availShift: 1,
      cell: "0",
      line: "0",
      cellDesc: null,
      tempCell: "",
      tempJob: "",
      avail: true,
      tempAvail: true,
      jobAvail: true,
      pgClocked: false,
      jobClocked: false,
      currentJob: null,
      onLeave: false,
      leaveDate: null,
      labourDtls: [],
    },
    {
      id: "103955",
      name: "Vaeterei",
      availShift: 1,
      cell: "0",
      line: "0",
      cellDesc: null,
      tempCell: "",
      tempJob: "",
      avail: true,
      tempAvail: true,
      jobAvail: true,
      pgClocked: false,
      jobClocked: false,
      currentJob: null,
      onLeave: false,
      leaveDate: null,
      labourDtls: [],
    },
    {
      id: "103976",
      name: "Victorini",
      availShift: 1,
      cell: "0",
      line: "0",
      cellDesc: null,
      tempCell: "",
      tempJob: "",
      avail: true,
      tempAvail: true,
      jobAvail: true,
      pgClocked: false,
      jobClocked: false,
      currentJob: null,
      onLeave: false,
      leaveDate: null,
      labourDtls: [],
    },
    {
      id: "103794",
      name: "Vira Agnes",
      availShift: 1,
      cell: "0",
      line: "0",
      cellDesc: null,
      tempCell: "",
      tempJob: "",
      avail: true,
      tempAvail: true,
      jobAvail: true,
      pgClocked: false,
      jobClocked: false,
      currentJob: null,
      onLeave: false,
      leaveDate: null,
      labourDtls: [],
    },
    {
      id: "103798",
      name: "Kenneth",
      availShift: 2,
      cell: "0",
      line: "0",
      cellDesc: null,
      tempCell: "",
      tempJob: "",
      avail: true,
      tempAvail: true,
      jobAvail: true,
      pgClocked: false,
      jobClocked: false,
      currentJob: null,
      onLeave: false,
      leaveDate: null,
      labourDtls: [],
    },
    {
      id: "103971",
      name: "Steven",
      availShift: 2,
      cell: "0",
      line: "0",
      cellDesc: null,
      tempCell: "",
      tempJob: "",
      avail: true,
      tempAvail: true,
      jobAvail: true,
      pgClocked: false,
      jobClocked: false,
      currentJob: null,
      onLeave: false,
      leaveDate: null,
      labourDtls: [],
    },
    {
      id: "103598",
      name: "Aachal",
      availShift: 5,
      cell: "0",
      line: "0",
      cellDesc: null,
      tempCell: "avail",
      tempJob: "",
      avail: true,
      tempAvail: true,
      jobAvail: true,
      pgClocked: true,
      jobClocked: false,
      currentJob: null,
      onLeave: false,
      leaveDate: null,
      labourDtls: [],
    },
    {
      id: "101350",
      name: "Alice",
      availShift: 5,
      cell: "010",
      line: "NB01",
      cellDesc: "Bottle Lines (NB)",
      tempCell: "avail",
      tempJob: "",
      avail: false,
      tempAvail: true,
      jobAvail: true,
      pgClocked: true,
      jobClocked: true,
      currentJob: [
        {
          LaborHed_EmployeeNum: "101350",
          LaborDtl_JobNum: "A0322958",
          LaborDtl_LaborHedSeq: 208709,
          LaborDtl_LaborDtlSeq: 10679783,
        },
      ],
      onLeave: false,
      leaveDate: null,
      labourDtls: [
        {
          LaborHed_EmployeeNum: "101350",
          LaborDtl_JobNum: "A0322958",
          LaborDtl_LaborHedSeq: 208709,
          LaborDtl_LaborDtlSeq: 10679783,
        },
      ],
    },
    {
      id: "102039",
      name: "Amandeep",
      availShift: 5,
      cell: "0",
      line: "0",
      cellDesc: null,
      tempCell: "avail",
      tempJob: "",
      avail: true,
      tempAvail: true,
      jobAvail: true,
      pgClocked: false,
      jobClocked: false,
      currentJob: null,
      onLeave: false,
      leaveDate: null,
      labourDtls: [],
    },
    {
      id: "103709",
      name: "Amarjot",
      availShift: 5,
      cell: "0",
      line: "0",
      cellDesc: null,
      tempCell: "avail",
      tempJob: "",
      avail: true,
      tempAvail: true,
      jobAvail: true,
      pgClocked: false,
      jobClocked: false,
      currentJob: null,
      onLeave: false,
      leaveDate: null,
      labourDtls: [],
    },
    {
      id: "100221",
      name: "Anitaben",
      availShift: 5,
      cell: "009",
      line: "N01",
      cellDesc: "Base Lines(N)",
      tempCell: "avail",
      tempJob: "",
      avail: false,
      tempAvail: true,
      jobAvail: true,
      pgClocked: true,
      jobClocked: true,
      currentJob: [
        {
          LaborHed_EmployeeNum: "100221",
          LaborDtl_JobNum: "A0322095",
          LaborDtl_LaborHedSeq: 208689,
          LaborDtl_LaborDtlSeq: 10679927,
        },
      ],
      onLeave: false,
      leaveDate: null,
      labourDtls: [
        {
          LaborHed_EmployeeNum: "100221",
          LaborDtl_JobNum: "A0322095",
          LaborDtl_LaborHedSeq: 208689,
          LaborDtl_LaborDtlSeq: 10679927,
        },
      ],
    },
  ];

  //return test data if nothing else=
  if (typeof dateParam !== "undefined") retVal = 1;

  if (typeof employees !== "undefined") {
    //formulate true return
    let rv = employees
      .filter((e) => e.JCDept === "ASPK")
      .map((e) => {
        let formatedEmp = {
          id: e.EmpID,
          firstname: e.FirstName,
          fullname: e.name,
          availShift: parseInt(e.Shift),
          cell: e.Cell_c,
          cellDesc: e.CodeDesc,
          tempCell: e.TempCell_c,
          tempJob: e.TempJob_c,
          avail: e.Cell_c === "" || e.Cell_c === "avail" ? true : false,
          tempAvail:
            e.TempCell_c === "" || e.TempCell_c === "avail" ? true : false,
          jobAvail:
            e.TempJob_c === "" || e.TempJob_c === "avail" ? true : false,
          //       pgClocked: tempClockedEmployees.some((c) => c.id === e.EmpBasic_EmpID),
          //       jobClocked: jobClocked.length > 0 ? true : false,
          //       currentJob: jobClocked.length > 0 ? currentJob : null,
          //       onLeave: isOnLeave,
          //       leaveDate: leaveDate,
          //       labourDtls: jobClocked,
        };
        return formatedEmp;
      });
    retVal = rv;
    console.log(rv);
  }
  // let date =
  //   dateParam === undefined
  //     ? generalFunctions.composeDateTime(new Date(), "UTC")
  //     : generalFunctions.composeDateTime(dateParam, "UTC");
  // var tempClockedEmployees = [];
  // var tempOnLeave = [];
  // var tempActiveLabour = [];
  // var assyEmployees = [];
  // console.log("date", date);

  // let getEmployees = await Axios.get(
  //   `${baseURL}/BaqSvc/GEN_EmployeesList/?$filter=EmpBasic_EmpStatus%20eq%20'A'%20and%20EmpBasic_JCDept%20eq%20'ASPK'`,
  //   axiosConfigs.config("GET")
  // );
  // let getClockedEmployees = await Axios.get(
  //   `${baseURL}/BaqSvc/GEN_EmpClockIn`,
  //   axiosConfigs.config("GET")
  // );
  // let getOnLeaveEmployees = await Axios.get(
  //   `${baseURL}/BaqSvc/GEN_PlannedLeaves/?date=${date}`,
  //   axiosConfigs.config("GET")
  // );
  // let getActiveLabour = await Axios.get(
  //   `${baseURL}/BaqSvc/ASSY_ActiveLabor/?$select=LaborHed_EmployeeNum%2CLaborDtl_JobNum%2CLaborDtl_LaborHedSeq%2CLaborDtl_LaborDtlSeq`,
  //   axiosConfigs.config("GET")
  // );

  // let retEmployees = getEmployees.data.value;
  // let retClockedEmployees = getClockedEmployees.data.value;
  // let retGetOnLeaveEmployees = getOnLeaveEmployees.data.value;
  // let retGetActiveLabour = getActiveLabour.data.value;

  // if (retClockedEmployees.length > 0) {
  //   tempClockedEmployees = retClockedEmployees.map((s) => {
  //     let renamedS = {
  //       id: s.Calculated_Calc_EmpID,
  //     };
  //     return renamedS;
  //   });
  // }

  // if (retGetOnLeaveEmployees.length > 0) {
  //   tempOnLeave = retGetOnLeaveEmployees.map((d) => {
  //     let renamedD = {
  //       id: d.vw_PayGlobal_Leave_EmpNo,
  //       // date: generalFunctions.composeDateTime(
  //       //   new Date(d.vw_PayGlobal_Leave_Date),
  //       //   "dateOnly"
  //       // ),
  //       date: d.vw_PayGlobal_Leave_Date,
  //     };
  //     return renamedD;
  //   });
  // }

  // if (retGetActiveLabour.length > 0) {
  //   tempActiveLabour = retGetActiveLabour.map((j) => {
  //     let renamedJ = {
  //       id: j.LaborHed_EmployeeNum,
  //       jobNum: j.LaborDtl_JobNum,
  //     };
  //     return renamedJ;
  //   });
  // }

  // if (retEmployees.length > 0) {
  //   assyEmployees = retEmployees.map((e) => {
  //     let isOnLeave = retGetOnLeaveEmployees.some(
  //       (l) => l.vw_PayGlobal_Leave_EmpNo === e.EmpBasic_EmpID
  //     );
  //     let leaveDate = isOnLeave
  //       ? tempOnLeave.filter((d) => d.id === e.EmpBasic_EmpID)
  //       : null;
  //     let jobClocked = retGetActiveLabour.filter(
  //       (l) => l.LaborHed_EmployeeNum === e.EmpBasic_EmpID
  //     );
  //     let currentJob = jobClocked;
  //     let renamedE = {
  //       id: e.EmpBasic_EmpID,
  //       name: e.EmpBasic_FirstName,
  //       availShift: parseInt(e.EmpBasic_Shift),
  //       cell: e.EmpBasic_Cell_c,
  //       cellDesc: e.CodeDesc,
  //       tempCell: e.EmpBasic_TempCell_c,
  //       tempJob: e.EmpBasic_TempJob_c,
  //       avail:
  //         e.EmpBasic_Cell_c === "" || e.EmpBasic_Cell_c === "avail"
  //           ? true
  //           : false,
  //       tempAvail:
  //         e.EmpBasic_TempCell_c === "" || e.EmpBasic_TempCell_c === "avail"
  //           ? true
  //           : false,
  //       jobAvail:
  //         e.EmpBasic_TempJob_c === "" || e.EmpBasic_TempJob_c === "avail"
  //           ? true
  //           : false,
  //       pgClocked: tempClockedEmployees.some((c) => c.id === e.EmpBasic_EmpID),
  //       jobClocked: jobClocked.length > 0 ? true : false,
  //       currentJob: jobClocked.length > 0 ? currentJob : null,
  //       onLeave: isOnLeave,
  //       leaveDate: leaveDate,
  //       labourDtls: jobClocked,
  //     };
  //     return renamedE;
  //   });
  // }
  // console.log("assyEmployees", assyEmployees);
  return retVal;
};
export default assyEmployees;
