import { createContext } from "react";
import Axios from "axios";
import { baseURL } from "../config/ConnectionBroker";

import "../App.css";

export const operationsFunctions = {
  stockCheck: function (openJob, lowStockJobs) {
    let enoughStock = lowStockJobs.some((j) => j.job === openJob);
    return enoughStock;
  },

  clockIntoJob: async function (employees, jobToStart, actType) {
    //employees: any array of employee with the property "id"
    //jobToStart: 1 job array from the GEN_JobsDashboard BAQ
    //actType: "S" for setup, "P" for production
    let job = jobToStart;
    let result = [];
    var mesData = "";
    for (let i = 0; i < employees.length; i++) {
      let employee = employees[i];
      let res = await operationsFunctions.getLabourDetails(employee.id);

      if (res.length === 0) {
        //res = [] means employee is not logged in to MES yet
        
         //TODO: remove let getMESDtls = await operationsFunctions.clockInOutMES(
        //   employee.id,
        //   "ClockIn"
        // );
        res = await operationsFunctions.getLabourDetails(employee.id);
      }

      // let laborHed = employeeLabourDtl.data.value[0];
      let laborHed = res[0];
      let activityType = actType;
      let ds = {
        LaborHed: [
          {
            Company: "SISTNZ",
            EmployeeNum: laborHed.id,
            LaborHedSeq: laborHed.laborHedSeq,
            PayrollDate: laborHed.payrollDate,
            Shift: laborHed.empShift,
            ClockInDate: laborHed.clockInDate,
            ClockInTime: laborHed.clockInTime,
            DspClockInTime: "",
            // ActualClockInTime: laborHed.ActualClockInTime,
            // ActualClockinDate: laborHed.ActualClockinDate,
            LunchStatus: "N",
            // LunchOutTime: laborHed.LunchOutTime,
            // LunchInTime: laborHed.LunchInTime,
            ClockOutTime: 0.0,
            DspClockOutTime: "",
            ActualClockOutTime: 0.0,
            PayHours: 0.0,
            FeedPayroll: false,
            TransferredToPayroll: false,
            LaborCollection: true,
            TranSet: "",
            ActiveTrans: true,
            ChkLink: "",
            BatchTotalHrsDisp: "",
            BatchHrsRemainDisp: "",
            BatchHrsRemainPctDisp: "",
            BatchSplitHrsMethod: "",
            BatchAssignTo: false,
            BatchComplete: false,
            BatchTotalHrs: 0.0,
            BatchHrsRemain: 0.0,
            BatchHrsRemainPct: 0.0,
            SysRevID: laborHed.sysRevID,
            SysRowID: laborHed.sysRowID,
            Imported: false,
            BatchMode: false,
            HCMPayHoursCalcType: "",
            EmpBasicShift: laborHed.empShift,
            EmpBasicSupervisorID: "",
            GetNewNoHdr: false,
            HCMTotPayHours: 0.0,
            ImagePath: "",
            LunchBreak: true,
            MES: false,
            PayrollValuesForHCM: "NON",
            TimeDisableDelete: false,
            TimeDisableUpdate: false,
            TotBurHrs: 0.0,
            TotLbrHrs: 0.0,
            WipPosted: false,
            DspPayHours: 0.0,
            BitFlag: 0,
            EmployeeNumFirstName: "",
            EmployeeNumName: "",
            EmployeeNumLastName: "",
            HCMStatusStatus: "",
            PRSystHCMEnabled: false,
            ShiftDescription: "",
            RowMod: "",
          },
        ],
      };
      mesData = JSON.stringify({
        LaborHedSeq: laborHed.laborHedSeq,
        StartType: activityType,
        ds: ds,
      });
      let startActResults = await Axios.post(
        `${baseURL}/Erp.BO.LaborSvc/StartActivity`,
        mesData,
        axiosConfigs.config("POST")
      );
      let laborHedData = startActResults.data.parameters;
      let laborHedDtl = startActResults.data.parameters.ds.LaborDtl[0];
      laborHedDtl.JobNum = job.jobNum;
      laborHedDtl.CreatedBy = "epicor_taskagent";
      laborHedDtl.ChangedBy = "epicor_taskagent";
      laborHedDtl.SubmittedBy = "epicor_taskagent";
      laborHedDtl.JCDept = job.dept;
      laborHedDtl.OprSeq = job.opSeq;
      laborHedDtl.ResourceGrpID = job.resGrp;
      laborHedDtl.OpCode = job.op;
      // laborHedDtl.LaborRate = job.labRate;
      laborHedDtl.ResourceID = job.lineID;
      laborHedDtl.DiscrepUOM = job.uom;
      laborHedDtl.LaborUOM = job.uom;
      laborHedDtl.ScrapUOM = job.uom;
      laborHedDtl.JCDeptDescription = job.deptDesc;
      laborHedDtl.JobAsmblPartNum = job.partNum;
      laborHedDtl.JobAsmblDescription = job.partDesc;
      laborHedDtl.MachineDescription = job.lineDesc;
      laborHedDtl.OpCodeOpDesc = job.opDesc;
      laborHedDtl.ResourceGrpDescription = job.resGrpDesc;
      laborHedDtl.ScrapUOM = job.uom;
      laborHedDtl.Complete = false;

      let updateData = JSON.stringify(laborHedData);
      let updateResults = await Axios.post(
        `${baseURL}/Erp.BO.LaborSvc/Update`,
        updateData,
        axiosConfigs.config("POST")
      );
      if (updateResults.status !== 200) {
        result.push(500);
      } else {
        result.push(200);
      }
    }
    return result;
  },

  clockInOutMES: async function (employeeID, action) {
    //employeeID: just 1 employee ID
    //action: either "ClockIn" or "ClockOut"
    let tempEmployee = await Axios.get(
      `${baseURL}/BaqSvc/GEN_EmployeesList/?$select=EmpBasic_Shift&$filter=EmpBasic_EmpID%20eq%20'${employeeID}'`,
      axiosConfigs.config("GET")
    );
    let employee = tempEmployee.data.value[0];
    var data = "";
    if (action === "ClockIn") {
      data = JSON.stringify({
        employeeID: employeeID,
        shift: employee.EmpBasic_Shift,
      });
    } else {
      data = JSON.stringify({ employeeID: employeeID });
    }
    let tempResult = await Axios.post(
      `${baseURL}/Erp.BO.EmpBasicSvc/${action}`,
      data,
      axiosConfigs.config("post")
    );
    let result = { status: tempResult.status, id: employeeID };

    return result;
  },

  endActivity: async function (
    activeLaborDtls,
    jobDetails,
    complete,
    bookedQty
  ) {
    // let action = "ClockOut";
    var result = [];
    let updateData = {};
    var i = 0;
    for (i = 0; i < activeLaborDtls.length; i++) {
      var employee = activeLaborDtls[i];
      let laborDetails = await Axios.post(
        `${baseURL}/Erp.BO.LaborSvc/GetDetail`,
        JSON.stringify({
          iLaborHedSeq: employee.laborHedSeq,
          iLaborDtlSeq: employee.laborDtlSeq,
        }),
        axiosConfigs.config("POST")
      );
      laborDetails.data.returnObj.LaborDtl[0].RowMod = "U";
      let tempEndActData = JSON.stringify(laborDetails.data);
      let endActData = tempEndActData.replace('"returnObj"', '"ds"');
      let tempUpdateData = await Axios.post(
        `${baseURL}/Erp.BO.LaborSvc/EndActivity`,
        endActData,
        axiosConfigs.config("POST")
      );
      let labDtls = tempUpdateData.data.parameters.ds.LaborDtl[0];
      if (i === 0) {
        labDtls.LaborQty = bookedQty;
      }

      labDtls.CreatedBy = "epicor_taskagent";
      labDtls.ChangedBy = "epicor_taskagent";
      labDtls.SubmittedBy = "epicor_taskagent";
      labDtls.EndActivity = true;
      labDtls.EnableLaborQty = true;
      labDtls.EnableRequestMove = true;
      labDtls.EnableResourceGrpID = true;
      labDtls.JCSystScrapReasons = true;
      labDtls.PartNum = jobDetails.partNum;
      labDtls.ResourceDesc = jobDetails.resDesc;
      labDtls.OutputBin = jobDetails.outBin;
      labDtls.OutputWarehouse = jobDetails.outWhse;
      labDtls.Complete = complete;
      labDtls.CompleteFlag = complete;
      labDtls.RowMod = "U";
      if (complete) {
        labDtls.Complete = complete;
        labDtls.CompleteFlag = complete;
        tempUpdateData.data.parameters.cmplete = complete;
        let endActivityComplete = tempUpdateData.data.parameters;
        let completeActResult = await Axios.post(
          `${baseURL}/Erp.BO.LaborSvc/EndActivityComplete`,
          endActivityComplete,
          axiosConfigs.config("POST")
        );

        updateData = completeActResult.data.parameters;
      } else {
        updateData = tempUpdateData.data.parameters;
      }
      let tempStatus = await Axios.post(
        `${baseURL}/Erp.BO.LaborSvc/Update`,
        updateData,
        axiosConfigs.config("POST")
      );

      if (tempStatus.status !== 200) {
        result.push(500);
      } else {
        result.push(200);
      }
    }
    return result;
  },

  checkLastActivity: function (jobArray) {
    let lastActivity = jobArray.reduce((maxSeq, nextSeq) =>
      maxSeq.labHedSeq > nextSeq.labHedSeq ? maxSeq : nextSeq
    );
    return lastActivity;
  },

  startActivity: async function (employeesToClockIn, jobs) {
    //employeesToClockIn: array that
    let action = "ClockIn";
    let i = 0;
    let startActResult = [];
    for (i = 0; i < employeesToClockIn.length; i++) {
      let employee = employeesToClockIn[i];
      // let job = jobs.filter((j) => j.jobNum === employee.job)[0];
      let job = jobs.filter((j) => j.jobNum === employee.job);
      let toClockIn = employee;
      let lastActivity = operationsFunctions.checkLastActivity(job);
      //clockIn to MES
      let mesClockInResult = await operationsFunctions.clockInOutMES(
        toClockIn,
        action
      );
      let jobClockInResult = await operationsFunctions.clockIntoJob(
        mesClockInResult.id,
        lastActivity
      );
      if (jobClockInResult === 200) {
        startActResult.push({ status: 200, id: toClockIn.id });
      } else {
        startActResult.push({ status: 500, id: toClockIn.id });
      }
    }
    return startActResult;
  },

  getLabourDetails: async function (employeeID) {
    let getLabourDtl = await Axios.get(
      `${baseURL}/Erp.BO.LaborSvc/Labors?$filter=EmployeeNum%20eq%20'${employeeID}'%20and%20ActiveTrans%20eq%20true`,
      axiosConfigs.config("GET")
    );
    let labourDtl = getLabourDtl.data.value;
    let tempMESClockIns = labourDtl.map((m) => {
      let renamedM = {
        id: m.EmployeeNum,
        laborHedSeq: m.LaborHedSeq,
        payrollDate: m.PayrollDate,
        clockInDate: m.ClockInDate,
        clockInTime: m.ClockInTime,
        clockOutTime: m.ClockOutTime,
        lunchIn: m.LunchInTime,
        lunchOut: m.LunchOutTime,
        sysRevID: m.SysRevID,
        sysRowID: m.SysRowID,
        empShift: m.Shift,
        supervisor: m.EmpBasicSupervisorID,
        photo: m.ImagePath,
        firstName: m.EmployeeNumFirstName,
        empName: m.EmployeeNumName,
        lastName: m.EmployeeNumLastName,
        shiftDesc: m.ShiftDescription,
        // dept: toClockIn.dept,
      };
      // MESclockIns.push(renamedM);
      return renamedM;
    });
    return tempMESClockIns;
  },

  jobReceiptToInv: async function (job, qty) {
    let data = "";
    let newReceiptParams = {};
    let receiptToInv = [];
    let tempPartTran = {};
    let tempLegalNumGenOpts = {};
    newReceiptParams = {
      pcJobNum: job.jobNum,
      piAssemblySeq: job.asSeq,
      pcTranType: "MFG-STK",
      pcProcessID: "RcptToInvEntry",
      ds: {
        PartTran: [],
      },
    };
    data = JSON.stringify(newReceiptParams);
    receiptToInv = await Axios.post(
      `${baseURL}/Erp.BO.ReceiptsFromMfgSvc/GetNewReceiptsFromMfgJobAsm`,
      data,
      axiosConfigs.config("POST")
    );

    tempPartTran = receiptToInv.data.parameters.ds.PartTran[0];

    tempPartTran.ActTranQty = qty;
    tempPartTran.ThisTranQty = qty;
    tempPartTran.TranQty = qty;
    tempPartTran.BegBurUnitCost = tempPartTran.BurUnitCost;
    tempPartTran.BegLbrUnitCost = tempPartTran.LbrUnitCost;
    tempPartTran.BegBurUnitCost = tempPartTran.MtlUnitCost;
    tempPartTran.CostID = 1;
    tempPartTran.JobBurUnitCost = tempPartTran.BurUnitCost;
    tempPartTran.JobLbrUnitCost = tempPartTran.LbrUnitCost;
    tempPartTran.JobMtlUnitCost = tempPartTran.MtlUnitCost;
    tempPartTran.MtlMtlUnitCost = tempPartTran.MtlUnitCost;
    tempPartTran.TranReference = job.jobNum;
    tempPartTran.RowMod = "U";
    newReceiptParams = {
      ds: {
        PartTran: [tempPartTran],
      },
    };
    data = JSON.stringify(newReceiptParams);
    receiptToInv = await Axios.post(
      `${baseURL}/Erp.BO.ReceiptsFromMfgSvc/PreUpdate`,
      data,
      axiosConfigs.config("POST")
    );

    tempPartTran = receiptToInv.data.parameters.ds.PartTran[0];
    tempLegalNumGenOpts = receiptToInv.data.parameters.ds.LegalNumGenOpts[0];

    newReceiptParams = {
      ds: {
        PartTran: [tempPartTran],
        LegalNumGenOpts: [tempLegalNumGenOpts],
      },
      pdSerialNoQty: 0,
      plNegQtyAction: true,
      pcProcessID: "RcptToInvEntry",
    };
    data = JSON.stringify(newReceiptParams);
    receiptToInv = await Axios.post(
      `${baseURL}/Erp.BO.ReceiptsFromMfgSvc/ReceiveMfgPartToInventory`,
      data,
      axiosConfigs.config("POST")
    );
  },
  unreleaseJob: async function (job) {
    console.log("job to unrelease", job);
    let data = "";
    let dataSet = [];
    let tempUpdate = {};
    let updateJobEntryParam = {};
    let updateJobEntry = {};
    let dataSetParam = {
      ipJobNum: job,
      ipStartAssemblySeq: 0,
      ipCurrentAssemblySeq: 0,
      ipCompleteTree: true,
      ipJobTypeMode: "",
    };
    data = JSON.stringify(dataSetParam);
    dataSet = await Axios.post(
      `${baseURL}/Erp.BO.JobEntrySvc/GetDatasetForTree`,
      data,
      axiosConfigs.config("POST")
    );
    tempUpdate = dataSet.data.returnObj.JobHead[0];
    tempUpdate.JobReleased = false;
    tempUpdate.RowMod = "U";
    tempUpdate.LastChangedBy = "epicor_rest";
    tempUpdate.LastChangedOn = new Date();
    tempUpdate.JobReleased = false;
    updateJobEntryParam = {
      ds: {
        JobHead: [tempUpdate],
      },
    };
    data = JSON.stringify(updateJobEntryParam);
    updateJobEntry = await Axios.post(
      `${baseURL}/Erp.BO.JobEntrySvc/Update`,
      data,
      axiosConfigs.config("POST")
    );
  },
};
export const generalFunctions = {
  composeDateTime: function (date, outputFormat, decimalTime) {
    //outputFormat = customTime (epoch dateTime and decimalTime(hour.minute) provided)
    //outputFormat = dateOnly (epoch dateTime provided, return date format only)
    //outputFormat = dateTime (epoch dateTime provided, return dateTime format)
    let dateTimeOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    let dateOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
    };
    switch (outputFormat) {
      case "dateOnly":
        return date.toLocaleDateString("en-GB", dateOptions);
      case "dateTime":
        return date.toLocaleDateString("en-GB", dateTimeOptions);
      case "UTC":
        return date.toUTCString();
      default:
        let tempHour = parseInt(decimalTime.split(".")[0]);
        let tempMinute = parseInt(decimalTime.split(".")[1] * 0.6);
        date.setHours(tempHour, tempMinute);
        return date.toLocaleDateString("en-GB", dateTimeOptions);
    }
  },
  // format: functionName: function (jsonArray) {},
  getSistemaColours: function () {
    let colours = {};
    colours["green"] = "#c3e6cb";
    colours["yellow"] = "#ffeeba";
    colours["red"] = "#f5c6cb";
    colours["lightGrey"] = "#d4d4d4";
    return colours;
  },
  convertHoursToHhmm: function (decimalHours) {
    let hours = decimalHours;
    let t = new Date(0, 0);
    t.setMinutes(hours * 60);
    let time = t.toLocaleTimeString().slice(0, 5);
    return time;
  },
  updateURLQueryParam: (key, value) => {
    let history = window.history;
    if (history.pushState) {
      let searchParams = new URLSearchParams(window.location.search);
      searchParams.set(key, value);
      let newurl =
        window.location.origin +
        window.location.pathname +
        "?" +
        searchParams.toString();
      history.pushState({ path: newurl }, "", newurl);
    }
  },
  //use this to get the current shift based on current time
  currentShift: (shiftsParam) => {
    console.log("shiftsParam", shiftsParam);
    var currentShift = undefined;
    var dateTimeFilter = new Date();
    const dateTimeNow = Date.now();
    console.log("dateTimeFilter", dateTimeFilter);
    var day = "";
    switch (dateTimeFilter.getDay()) {
      case 0:
        day = "Sunday";
        break;
      case 6:
        day = "Saturday";
        break;
      default:
        day = "Weekday";
    }
    let tempCurrentShift = shiftsParam.filter(
      (t) =>
        ((new Date(t.endDateTimeActual).getTime() >
          new Date(t.startDateTimeActual).getTime() &&
          dateTimeNow >= new Date(t.startDateTimeActual).getTime() &&
          dateTimeNow <= new Date(t.endDateTimeActual).getTime()) ||
          (new Date(t.endDateTimeActual).getTime() <
            new Date(t.startDateTimeActual).getTime() &&
            (dateTimeNow >= new Date(t.startDateTimeActual).getTime() ||
              dateTimeNow <= new Date(t.endDateTimeActual).getTime()))) &&
        t.shiftDesc.startsWith("Assembly")
      // && t.shiftDesc.includes(day)
    );
    tempCurrentShift.length === 0
      ? //console.log("tempCurrentShift", tempCurrentShift)
        (currentShift = 99)
      : (currentShift = tempCurrentShift[0].shiftID);

    return currentShift;
  },
};
export const mfgDashboardFunctions = {
  getMachineRowColour: function (oee, cyceff, scrap) {
    let retCol = "";
    let tmpval = 0;
    switch (true) {
      case oee < 70:
        if (tmpval < 3) {
          tmpval = 3;
        }
        break;
      case oee < 85:
        if (tmpval < 2) {
          tmpval = 2;
        }
        break;
      default:
        // oee >= 85:
        if (tmpval < 1) {
          tmpval = 1;
        }
    }

    switch (true) {
      case cyceff < 98:
        if (tmpval < 3) {
          tmpval = 3;
        }
        break;
      case cyceff < 99:
        if (tmpval < 2) {
          tmpval = 2;
        }
        break;
      default:
        // cyceff >= 99:
        if (tmpval < 1) {
          tmpval = 1;
        }
    }

    switch (true) {
      case scrap > 3:
        if (tmpval < 3) {
          tmpval = 3;
        }
        break;
      case scrap > 2:
        if (tmpval < 2) {
          tmpval = 2;
        }
        break;
      default:
        // scrap >= 3
        if (tmpval < 1) {
          tmpval = 1;
        }
    }
    switch (tmpval) {
      case 0:
      case 1:
        retCol = generalFunctions.getSistemaColours().green;
        break;
      case 2:
        retCol = generalFunctions.getSistemaColours().yellow;
        break;
      default:
        retCol = generalFunctions.getSistemaColours().red;
        break;
    }
    return retCol;
  },
  getOeeGaugeColour: function (oee) {
    let tmpval = 0;
    let retOeeCol = "";
    //oee gauge color
    switch (true) {
      case oee < 80:
        if (tmpval < 3) {
          tmpval = 3;
        }
        break;
      case oee < 85:
        if (tmpval < 2) {
          tmpval = 2;
        }
        break;
      default:
        // oee >= 85:
        if (tmpval < 1) {
          tmpval = 1;
        }
    }
    retOeeCol = mfgDashboardFunctions.convertStatusToColor(tmpval);
    return retOeeCol;
  },
  getEffGaugeColour: function (cyceff) {
    let tmpval = 0;
    let retEffCol = "";
    //eff gauge color
    switch (true) {
      case cyceff < 98:
        if (tmpval !== 3) {
          tmpval = 3;
        }
        break;
      case cyceff < 99:
        if (tmpval !== 2) {
          tmpval = 2;
        }
        break;
      default:
        // cyceff >= 99:
        if (tmpval !== 1) {
          tmpval = 1;
        }
    }
    retEffCol = mfgDashboardFunctions.convertStatusToColor(tmpval);
    return retEffCol;
  },
  getScrapColour: function (scrap) {
    let tmpval = 0;
    let retScrapCol = "";
    //scrap text color
    switch (true) {
      case scrap < 2:
        if (tmpval !== 1) {
          tmpval = 1;
        }
        break;
      case scrap < 3:
        if (tmpval !== 2) {
          tmpval = 2;
        }
        break;
      default:
        // scrap >=3:
        if (tmpval !== 3) {
          tmpval = 3;
        }
    }
    retScrapCol = mfgDashboardFunctions.convertStatusToColor(tmpval);
    return retScrapCol;
  },
  convertStatusToColor: function (tmpval) {
    let retCol = "";
    switch (tmpval) {
      case 0:
      case 1:
        retCol = "#339933";
        break;
      case 2:
        retCol = "#ffcc33";
        break;
      default:
        retCol = "#cc3333";
        break;
    }
    return retCol;
  },
  getCellfromRealtime: function (cellDescription) {
    return cellDescription
      .replace("Airport Site", "")
      .trim()
      .replace(/\s/g, "")
      .toLowerCase();
  },
  trimMattecJobNumber: function (mattecJobID) {
    return mattecJobID.replace("100010", "").trim();
  },
};
export const dragDropFunctions = {
  laneSortFunction: function (card1, card2) {
    return card1 > card2;
  },
  handleDragEnd: function (
    cardId,
    sourceLaneId,
    targetLaneId,
    position,
    cardDetails
  ) {
    let event;
    let toPost = {};
    event = {
      cardId: cardId,
      sourceLaneId: sourceLaneId,
      targetLaneId: targetLaneId,
      position: position,
      cardDetails: cardDetails,
    };
    toPost = {
      id: event.cardDetails.id,
      sourceLaneId: event.sourceLaneId,
      targetLaneId: event.targetLaneId,
    };
    return toPost;
  },
  createSourceLane: function (
    employeesArray,
    shiftParam,
    availField,
    sourceLaneName
  ) {
    //employeesArray is the list of employees
    //shiftParam is a number from the shift field in the employee table
    //availField will either be different depending on the page you want to display
    //"tempAvail" for plan page, "avail" for current page, "jobAvail" for assigned to cell but not to job, "onLeave" when you want to create a lane for on leave employees
    let tempAvailEmployees = [];
    let availEmployees = [];
    let laneName =
      sourceLaneName === undefined ? "Unassigned Employees" : sourceLaneName;
    let colors = {
      a: "green",
      b: "ghostwhite",
      c: "lightcoral",
      d: "lightgray",
    };
    switch (availField) {
      case "tempAvail":
        tempAvailEmployees = employeesArray.filter(
          // (r) => shiftParamArray.includes(r.availShift) && r.tempAvail
          (r) => parseInt(r.availShift) === parseInt(shiftParam) && r.tempAvail
        );
        break;
      case "avail":
        // let shiftArray = shiftParam.map((s) => s.shiftID);
        tempAvailEmployees = employeesArray.filter(
          (r) => parseInt(r.availShift) === parseInt(shiftParam) && r.avail
          // (r) => shiftParam.includes(parseInt(r.availShift)) && r.avail
        );
        break;
      case "jobAvail":
        tempAvailEmployees = employeesArray.filter(
          (r) => !r.avail && r.jobAvail
        );
        break;
      case "onLeave":
        tempAvailEmployees = employeesArray.filter((r) => r.onLeave);
        break;
      default:
        tempAvailEmployees = employeesArray;
    }
    availEmployees = tempAvailEmployees.map((m) => {
      let renamedM = {
        id: m.id,
        title: `${m.name}`,
        label: `${m.id}`,
        draggable: m.onLeave ? false : true,
        style: {
          minWidth: 150,
          backgroundColor: m.onLeave
            ? colors.d
            : m.pgClocked
            ? colors.a
            : colors.c,
          margin: "0px 0px",
          height: 40,
        },
      };
      return renamedM;
    });

    availEmployees.sort(
      (a, b) =>
        a.style.backgroundColor.localeCompare(b.style.backgroundColor) || a - b
    );
    //create avail lane
    let availLane = {
      id: "avail",
      title: laneName,
      label: `${availEmployees.length}`,
      cards: availEmployees,
      style: {
        maxWidth: 350,
        maxHeight: "75vh",
      },
    };
    return availLane;
  },
  createAssignedLane: function (
    cellsArray,
    requiredCrewSize,
    employeesArray,
    shiftParam,
    cellField
  ) {
    //cellsArray is the list of cells
    //requiredCrewSize is the estimated crew size for each cell at the start of the shift for the selected date
    //employeesArray is the list of employees
    //cellField will either be "cell" or "tempCell" depending on the page you want to display
    //"tempCell" for plan page, "cell" for current page
    let colors = {
      a: "green",
      b: "ghostwhite",
      c: "lightcoral",
      d: "lightgray",
    };
    let tempLanes = cellsArray.map((c) => {
      //get all assigned employees
      let tempAssignedEmployees = [];
      let assignedEmployees = [];

      cellField === "cell"
        ? (tempAssignedEmployees = employeesArray.filter(
            // (f) => shiftParam.includes(f.availShift) && f.cell === c.cellID
            (f) =>
              parseInt(shiftParam) === parseInt(f.availShift) &&
              f.cell === c.cellID
          ))
        : (tempAssignedEmployees = employeesArray.filter(
            (f) =>
              parseInt(shiftParam) === parseInt(f.availShift) &&
              f.tempCell === c.cellID
            // (f) => shiftParam.includes(f.availShift) && f.tempCell === c.cellID
          ));
      let totalCrewSizePerCell = requiredCrewSize
        .filter((f) => f.cellID === c.cellID)
        .reduce(function (crewSize1, crewSize2) {
          return crewSize1 + crewSize2.crewSize;
        }, 0);

      assignedEmployees = tempAssignedEmployees.map((m) => {
        let renamedM = {
          id: m.id,
          title: `${m.name}`,
          label: `${m.id}`,
          style: {
            minWidth: 150,
            margin: "0px 0px",
            height: 40,
            backgroundColor: m.onLeave
              ? colors.d
              : m.pgClocked
              ? colors.a
              : colors.c,
          },
        };
        return renamedM;
      });

      assignedEmployees.sort(
        (a, b) =>
          a.style.backgroundColor.localeCompare(b.style.backgroundColor) ||
          a - b
      );

      let renamedA = {
        id: c.cellID,
        title: `${c.cellDesc}`,
        label: `${assignedEmployees.length}`,
        label2: `${totalCrewSizePerCell}`,
        cards: assignedEmployees,
        style: {
          maxWidth: 350,
          maxHeight: "75vh",
        },
      };
      return renamedA;
    });

    return tempLanes;
  },
  // createMfgLane: function (mfgEmployeesArray, shiftParam, cellField) {
  //   let mfgEmployees = [];
  //   let tempMfgEmployees = [];
  //   let colors = {
  //     a: "green",
  //     b: "ghostwhite",
  //     c: "lightcoral",
  //     d: "lightgray",
  //   };
  //   cellField === "cell"
  //     ? (tempMfgEmployees = mfgEmployeesArray.filter(
  //         (m) =>
  //           m.cell === "099" && parseInt(m.availShift) === parseInt(shiftParam)
  //       ))
  //     : (tempMfgEmployees = mfgEmployeesArray.filter(
  //         (m) =>
  //           m.tempCell === "099" &&
  //           parseInt(m.availShift) === parseInt(shiftParam)
  //       ));
  //   mfgEmployees = tempMfgEmployees.map((m) => {
  //     let renamedM = {
  //       id: m.id,
  //       title: `${m.name}`,
  //       label: `${m.id}`,
  //       draggable: m.onLeave ? false : true,
  //       style: {
  //         minWidth: 150,
  //         backgroundColor: m.onLeave
  //           ? colors.d
  //           : m.pgClocked
  //           ? colors.a
  //           : colors.c,
  //         margin: "0px 0px",
  //         height: 40,
  //       },
  //     };
  //     return renamedM;
  //   });

  //   mfgEmployees.sort(
  //     (a, b) =>
  //       a.style.backgroundColor.localeCompare(b.style.backgroundColor) || a - b
  //   );
  //   //create mfgLane
  //   let mfgLane = {
  //     id: "099",
  //     title: "Cell 1 - Manufacturing",
  //     label: `${mfgEmployees.length}`,
  //     cards: mfgEmployees,
  //     style: {
  //       maxWidth: 350,
  //       maxHeight: "85vh",
  //     },
  //   };
  //   return mfgLane;
  // },
  savePlan: async function (updatesToPost, fieldToUpdate) {
    var endResult = [];
    //update employee cell assignment in database
    for (let i = 0; i < updatesToPost.length; i++) {
      let employee = updatesToPost[i];
      let update = {
        Company: "SISTNZ",
        EmpID: employee.id,
        RowMod: "U",
      };

      switch (fieldToUpdate) {
        case "TempCell_c":
          update.TempCell_c = employee.targetLaneId;
          break;
        case "Cell_c":
          update.Cell_c = employee.targetLaneId;
          break;
        case "TempJob_c":
          update.TempJob_c =
            employee.targetLaneId === "avail" ? "" : employee.targetLaneId;
          break;
        default:
      }

      let data = JSON.stringify(update);

      let tempEndResult = await Axios.post(
        `${baseURL}/Erp.BO.EmpBasicSvc/EmpBasics`,
        data,
        axiosConfigs.config("POST")
      );
      if (tempEndResult.status !== 201) {
        endResult.push({ status: 500, id: tempEndResult.data.EmpID });
      } else {
        endResult.push({ status: 201, id: tempEndResult.data.EmpID });
      }
    }
    return endResult;
  },
};
export const cardContext = createContext({
  clockedIn: null,
});
export const axiosConfigs = {
  config: (restMethod) => {
    let config = {
      method: restMethod,
      headers: {
        Authorization: "Basic ZXBpY29yX3Jlc3Q6UjMzdGFwITE=",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return config;
  },
};
export const mqttFunctions = {
  getHostname: function (mode) {
    return "ws://10.92.0.168:9001";
  },

  getOptions: function (pageID,randomID) {
    return {
      protocol: "ws",
      username: "pub_client",
      password: "password",
      keepalive: 60,
      // clientId uniquely identifies client
      // choose any string you wish
      clientId: "mqttjs_" + pageID + '_' + randomID,
    };
  },
};
