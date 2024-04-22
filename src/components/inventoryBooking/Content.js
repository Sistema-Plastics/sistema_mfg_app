import React, { useEffect, useRef, useState } from "react";
import JobStatus from "./JobStats";
import JobDetails from "./JobDetails";
import Actions from "./Actions";
import LastPallet from "./LastPallet";
import { Grid, Paper, Typography } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";

export default function Content({ machineID, ibdData }) {
  // const params = new URLSearchParams(document.location.search);
  // const machineID = params.get("mcID"); //.toLowerCase();
  const [datasets, setDataSets] = useState(ibdData);

  const jobDetails = useRef();
  useEffect(() => {
    setDataSets(ibdData);
  }, []);

  useEffect(() => {
    setDataSets(ibdData);
  }, [ibdData]);

  const sistTheme = useTheme();

  const handleJobDetailsReceipt = (jd) => {
    // return {mcID:jobDetails.current.mcID ,cellRef:jobDetails.current.cell}
    jobDetails.current = jd;
  };
  const handleJobDetailsDelivery = () => {
    return jobDetails.current;
  };
  return (
    <React.Fragment>
      {console.log("Render Content.js")}
      {/* https://mui.com/material-ui/react-grid/ */}
      <Grid container spacing={1} marginTop={0}>
        <Grid item xl={12} xs={12} padding={0}>
          <Paper elevation={10}>
            <Typography
              variant="h3"
              gutterBottom
              padding={sistTheme.spacing(1)}
            >
              Inventory Booking
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={5} padding={0}>
          <Paper elevation={10}>
            <JobDetails
              mcID={machineID}
              datasets={ibdData}
              feedback={handleJobDetailsReceipt}
            />
          </Paper>
        </Grid>
        <Grid item xs={5} padding={0}>
          <Paper elevation={10}>
            <JobStatus machineID={machineID} datasets={ibdData} />
            <LastPallet machineID={machineID} datasets={ibdData} />
          </Paper>
        </Grid>
        <Grid item xs={2} padding={0}>
          <Paper elevation={10}>
            <Actions
            datasets={ibdData}
              fetchJobDetails={handleJobDetailsDelivery}
            />
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
//#region mcData
/*
 * {
    "Calculated_MachID": "B14",
    "Calculated_MachNo": 29,
    "Calculated_DeptNo": 8,
    "Calculated_OEE": "100",
    "Calculated_CycEff": "101.129388456262",
    "Calculated_YieldEff": "103.181607851505",
    "Calculated_AvgCycTime": "12.8548191563745",
    "Calculated_ScrapPercent": "0",
    "Calculated_DownPercent": "0",
    "Calculated_GoodProduction": "17264",
    "Calculated_TotalProduction": "17264",
    "Calculated_GoodPercent": "100",
    "Calculated_RunEfficency": "100",
    "Calculated_Berry105Efficiency": "106.45083759553",
    "Calculated_BerryMeefEfficiency": "100",
    "Calculated_LastCycTime": "12.8",
    "Calculated_TimeToGo": "86.604656853722",
    "Calculated_NextTool": "T627                ",
    "Calculated_NextJob": "A0316408100010      ",
    "Calculated_NextPartNum": "3402333                  ",
    "Calculated_NextPartDesc": "Lid Yogurt Pot Minty Teal                         ",
    "Calculated_CurrentJob": "A0316535100010      ",
    "Calculated_CurrentPartNum": "3402332                  ",
    "Calculated_CurrentPartDesc": "Lid Yogurt Pot Ocean Blue                         ",
    "Calculated_AssyCycTime": "1.60686962065668",
    "Calculated_ExpCycTime": "13",
    "Calculated_CurrentQTY": "25096",
    "Calculated_RequiredQTY": "215040",
    "RowIdent": "b667bf61-7c81-4f91-8e42-d11f2965ba25"
}/ */
//#endregion
//#region rtData
/*     
    "Calculated_MachNo": 56,
    "Calculated_MachID": "A06",
    "Calculated_DeptNo": 8,
    "Calculated_DeptDesc": "Airport Site Cell 1                               ",
    "Calculated_DownNo": null,
    "Calculated_DownDesc": null,
    "Calculated_JobID": "A0316753100010      ",
    "Calculated_JobSeq": 296226,
    "Calculated_PartNo": "14047",
    "Calculated_StartTime": null,
    "Calculated_EndTime": null,
    "Calculated_PartDesc": "Base Yogurt NAT No Lid                            ",
    "Calculated_PartID": "3705445                  ",
    "RowIdent": "277cd0f9-c00c-4ab8-ace0-edcbd47922ac"
 */
//#endregion
//#region jobData
/*     
    "Resource_Cell_c": "",
    "JobHead_JobNum": "A0316753",
    "JobHead_PartNum": "3705445",
    "JobHead_PartDescription": "Base Yogurt NAT No Lid",
    "JobHead_IUM": "EA",
    "Calculated_ProdQty": 177600,
    "Calculated_QtyCompleted": 59196,
    "Calculated_WIPQty": 118404,
    "JobOpDtl_ResourceID": "T417",
    "JobOper_OprSeq": 10,
    "JobOper_MattecStartDate_c": "2023-10-06T00:00:00",
    "Calculated_MattecStartDate": "2023-10-06T00:00:00",
    "JobOper_MattecStartHour_c": "23.53",
    "Calculated_MattecStartHour": "23.53",
    "JobOper_MattecEndDate_c": "2023-10-16T00:00:00",
    "Calculated_MattecEndDate": "2023-10-16T00:00:00",
    "JobOper_MattecEndHour_c": "15.92",
    "Calculated_MattecEndHour": "15.92",
    "Calculated_ProdStd": "4.28571429",
    "Calculated_TimeLeft": "460.459999539540000",
    "ResourceGroup_Description": "Tooling Base Group",
    "ResourceGroup_ResourceGrpID": "TLBASE",
    "ResourceGroup_JCDept": "TOOL",
    "Resource_OutputBinNum": "",
    "Resource_OutputWhse": "",
    "Calculated_SetUpCrewSize": "1.00",
    "Calculated_ProdCrewSize": "0.25",
    "JobOper_OpCode": "OA0417",
    "JobOper_OpDesc": "Base Pottle (4)",
    "ResourceGroup_SetupLabRate": "0.000000",
    "Resource_ResourceID": "T417",
    "JCDept_Description": "Tool Department",
    "Resource_Description": "Tool 417 Base Pottle (4)",
    "JobOper_LaborEntryMethod": "Q",
    "JobOper_AssemblySeq": 0,
    "Part_QtyPerPallet_c": 4800,
    "Part_QtyPerCarton_c": 300,
    "JobOper_EstSetHours": "0.25",
    "JobProd_ReceivedQty": "62400.00000000",
    "Calculated_QtyPerPallet": "4800",
    "Resource_InputBinNum": "",
    "JobHead_LastChangedBy": "",
    "JobHead_LastChangedOn": null,
    "RowIdent": "e5c7afb3-4d1b-4852-aef5-47f8e7766377"
 */
//#endregion
//#region employeeData
/*
{
    "EmpBasic_EmpID": "102571",
    "EmpBasic_JCDept": "MACH",
    "EmpBasic_FirstName": "Abhishek",
    "EmpBasic_Name": "Abhishek Sharma",
    "EmpBasic_Shift": 1,
    "EmpBasic_Cell_c": "",
    "EmpBasic_TempCell_c": "",
    "EmpBasic_TempJob_c": "",
    "EmpBasic_EmpStatus": "I",
    "Supervisor_Name": null,
    "UDCodes_CodeDesc": null,
    "JCDept_Description": "Machines Department",
    "RowIdent": "685cdf72-af54-495f-b57e-cbee8d8d704a"
}
*/
//#endregion
