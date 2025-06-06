import React, { useEffect, useRef, useState } from "react";
import JobStatus from "./JobStats";
import JobDetails from "./JobDetails";
import Actions from "./Actions";
import LastPallet from "./LastPallet";
import { ThemeProvider } from "@mui/material/styles";
import { Grid, Paper, Typography, Button, Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import { RichTreeView } from '@mui/x-tree-view';
import { DataGrid } from '@mui/x-data-grid';
import { sistColours, sistemaTheme } from "../../assets/styling/muiThemes";
import CssBaseline from '@mui/material/CssBaseline';
import { mfgDashboardFunctions } from "../../helpers/HelperScripts";

export default function Content({ machineID, ibdData }) {
    const [datasets, setDataSets] = useState(ibdData);
    const [isMattecMachine, setIsMattecMachine] = useState(false);
    const [hasJobAssigned, sethasJobAssigned] = useState(false);
    const [displayContent, setDisplayContent] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [displayJobAsmbl, setDisplayJobAsmbl] = useState([]);
    const [displayJobOper, setDisplayJobOper] = useState([]);
    const [displayJobOpDtl, setDisplayJobOpDtl] = useState([]);
    const [displayJobMtl, setDisplayJobMtl] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);

    const resGrpDept = ["MACH", "PK Table"];
    const jobDetails = useRef();
    let msgJobNotFound = `No job currently scheduled on ${machineID.toUpperCase()}.\n\nIf this is a non-Mattec resource, please start activity on Epicor MES.`;


    const sistTheme = sistemaTheme;

    useEffect(() => {
        if (machineID) {
            setDataSets(ibdData);
            getCurrentJobData();
        }
    }, []);

    useEffect(() => {
        if (machineID) {
            const unchangedData =
                JSON.stringify(datasets) === JSON.stringify(ibdData);
            if (!unchangedData) {
                setDataSets(ibdData);
                getCurrentJobData();
            }
        }
    }, [ibdData, machineID]);

    const getCurrentJobData = () => {
        let jn = null;
        let asm = null;
        let deptDesc = null;
        let mc = null;
        let cell = null;
        let timeToGo = null;
        let currentQTY = null;
        let remqty = null;
        let requiredQTY = null;

        let msg = 'Checking realtime data...';

        try {
            const tmpRT = ibdData.realtime.value.filter(
                (dept) => dept.MachID.toLowerCase() === machineID.toLowerCase()
            )[0];

            if (tmpRT === undefined) {
                msg += 'NOT FOUND\n';
                msg += `\nResource ${machineID.toUpperCase()} does not have job details in mattec realtime data. May be a non-Mattec resource. \nChecking job labour details to confirm if this is a non-Mattec machine...`;

                const ld = ibdData.labourdtl.value.filter(
                    (ld) =>
                        ld.ResourceID.toLowerCase() === machineID.toLowerCase()
                )[0];

                if (ld !== null && ld !== undefined) {
                    jn = ld.JobNum;
                    asm = ld.AssemblySeq;
                    msg += '\nLabour Detail Current Job: ' + jn;
                    sethasJobAssigned(true);
                } else {
                    msg += 'NOT FOUND\n';
                    msg += "\nPLEASE START JOB IN EPICOR MES";
                }
            } else {
                setIsMattecMachine(true);

                msg += 'FOUND\n';
                msg += 'Checking machine data... ';

                mc = ibdData.machinedata.value.filter(
                    (mc) => mc.MachID.toLowerCase() === machineID.toLowerCase()
                )[0];

                if (mc !== undefined) {
                    msg += 'FOUND\n';
                    msg += 'Getting Mattec job details: ';

                    jn = tmpRT.JobID.trim().substring(
                        0,
                        tmpRT.JobID.trim().length - 6
                    );
                    asm = tmpRT.JobID.trim().replace(jn, "").substring(2, 3);
                    deptDesc = tmpRT.DeptDesc;
                    cell = mfgDashboardFunctions.getCellfromRealtime(deptDesc);
                    timeToGo = mc.TimeToGo;
                    requiredQTY = parseInt(mc.RequiredQTY) || 0;
                    currentQTY = parseInt(mc.CurrentQTY) || 0;
                    remqty = requiredQTY - currentQTY;

                    msg += `\tJobNum: ${jn} ASM: ${asm}`;
                    sethasJobAssigned(true);
                }
                else {
                    msg += 'NOT FOUND\n';
                    msg += `\nMattec machine data is unavailable for Resource ${machineID.toUpperCase()}. \n\nPLEASE CHECK MATTEC TO SEE IF RESOURCE HAS JOB ASSIGNED.`;
                }
            }

            if (jn != null) {
                msg += '\nChecking jobsopenops data... ';
                const tmpJob = datasets.jobsopenops.value.filter(
                    (jb) =>
                        jb.JobNum === jn &&
                        jb.AssemblySeq.toString() === asm.toString() &&
                        jb.ResourceID.toLowerCase() ===
                        machineID.toLowerCase() &&
                        resGrpDept.includes(jb.JCDept)
                )[0];

                if (tmpJob != null) {
                    setDisplayContent(true);
                    msg += 'FOUND';

                    deptDesc = tmpJob.JCDept_Description;
                    cell = tmpJob.Cell_c;
                    timeToGo = tmpJob.TimeLeft < 0 ? 0 : tmpJob.TimeLeft;
                    requiredQTY = parseInt(tmpJob.RequiredQty) || 0;
                    currentQTY = parseInt(tmpJob.QtyCompleted) || 0;
                    remqty = parseInt(tmpJob.WIPQty) || 0;

                    const jd = {
                        jn: tmpJob.JobNum,
                        asm: tmpJob.AssemblySeq,
                        opr: tmpJob.OprSeq,
                        rev: tmpJob.RevisionNum,
                        mc: machineID,
                        cell: cell,
                        cq: tmpJob.QtyPerCarton_c,
                        pq: tmpJob.QtyPerPallet_c,
                        pn: tmpJob.PartNum,
                        pd: tmpJob.PartDescription,
                        ium: tmpJob.IUM,
                        timetogo: timeToGo,
                        reqdqty: requiredQTY,
                        goodqty: currentQTY,
                        remqty: remqty,
                    };

                    const jobTraveller = datasets.jobtraveller.value.filter((job) => job.JobNum === jn);

                    setDataSets((prevState) => {
                        return {
                            ...prevState,
                            currentJob: {
                                ...jd,
                                jobTraveller: jobTraveller[0]
                            }
                        };
                    });
                    console.log('Datasets: ', datasets);
                }
                else {
                    msg += 'NOT FOUND1';
                    msg += `\nResource ${machineID.toUpperCase()} does not have a job assigned.`;
                }
                //console.log(msg);
            }
        } catch (ex) {
            console.log(ex);

            setDataSets((prevState) => {
                return { ...prevState, currentJob: null };
            });
        }
    };

    const handleJobDetailsReceipt = (jd) => {
        jobDetails.current = jd;
    };

    const displayError = (msg) => {
        return (
            <ThemeProvider theme={sistemaTheme}>
                <Typography
                    variant='h5'
                    gutterBottom
                >
                    {msg}
                </Typography>
            </ThemeProvider>
        );
    }

    const openJobTraveller = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleTreeItemClick = (itemId) => {
        setDisplayJobAsmbl([]);  // Clear the JobAsmbl data before setting it again
        setDisplayJobOper([]);  // Clear the JobOper data before setting it again
        setDisplayJobOpDtl([]);  // Clear the JobOpDtl data before setting it again
        setDisplayJobMtl([]);  // Clear the JobMtl data before setting it again
        setSelectedColumns([]);  // Clear the columns before setting it again

        console.log("Clicked item:", itemId);
        if (!itemId) { return; }  // If the itemId is null, return

        const itemParts = itemId.split('-').map(Number);
        const [, jobAsmblIndex, jobOperIndex] = itemParts;

        const jobAsmbl = datasets.currentJob?.jobTraveller?.JobAsmbl[jobAsmblIndex];
        console.log("jobAsmblIndex:", itemParts[1]);
        console.log("jobOperIndex:", jobOperIndex);

        let jobOper;

        if (!isNaN(jobOperIndex)) {
            const selectedJobOper = jobAsmbl?.JobOper[jobOperIndex];

            if (selectedJobOper && Array.isArray(selectedJobOper)) { // Ensure it's an array
                jobOper = selectedJobOper.map((jobOper) => ({
                    AssemblySeq: jobAsmbl.AssemblySeq, ...jobOper
                }));
            } else if (selectedJobOper && typeof selectedJobOper === 'object') {
                jobOper = [{ AssemblySeq: jobAsmbl.AssemblySeq, ...selectedJobOper }];
            } else {
                console.log("No valid JobOper data at index:", jobOperIndex);
            }
        }
        else {
            jobOper = jobAsmbl?.JobOper.length > 0 ? jobAsmbl?.JobOper.map((jobOper) => ({
                AssemblySeq: jobAsmbl.AssemblySeq, ...jobOper
            })) : [];
        };

        const jobOpDtl = jobOper.reduce((acc, jobOper) => {
            return acc.concat(jobOper.JobOpDtl?.map(opDtl => ({ OprSeq: jobOper.OprSeq, ...opDtl })) || []);
        }, []);

        const jobMtl = jobOper?.reduce((acc, jobOper) => {
            return acc.concat(jobOper.JobMtl?.map(mtl => ({ AssemblySeq: jobAsmbl.AssemblySeq, OprSeq: jobOper.OprSeq, ...mtl })) || []);
        }, []);

        console.log("jobAsmbl:", jobAsmbl);
        console.log("jobOper:", jobOper);
        console.log("jobOpDtl:", jobOpDtl);
        console.log("jobMtl:", jobMtl);
        if (jobAsmbl) {
            setDisplayJobAsmbl([jobAsmbl]);  // Ensure the JobAsmbl data is set correctly
            setSelectedColumns(jobAsmblColumns);
        }

        if (jobOper && jobOper.length > 0) {
            setDisplayJobOper(jobOper);  // Ensure the JobOper data is set correctly
        }
        if (jobOpDtl && jobOpDtl.length > 0) {
            setDisplayJobOpDtl(jobOpDtl);  // Ensure the JobOpDtl data is set correctly
        }
        if (jobMtl && jobMtl.length > 0) {
            setDisplayJobMtl(jobMtl);  // Ensure the JobMtl data is set correctly
        }
    };

    const buildTreeData = (job) => {
        const treeData = job.JobAsmbl?.map((jobAsmbl, jobAsmblIndex) => {
            const { AssemblySeq, PartNum, Description, JobOper } = jobAsmbl;

            const jobOperations = JobOper?.map((jobOper, jobOperIndex) => {
                const { OprSeq, OpCode, OpDesc } = jobOper;
                return {
                    id: `JobOper-${jobAsmblIndex}-${jobOperIndex}`,
                    label: `Opr ${OprSeq}: ${OpCode.toUpperCase()}- ${OpDesc}`,
                };
            }) || [];

            return {
                id: `AssemblySeq-${AssemblySeq}`,
                label: `ASM ${AssemblySeq}: ${PartNum.toUpperCase()}- ${Description.toUpperCase()}`,
                children: jobOperations,
            };
        }) || [];
        return treeData;
    };

    const jobTravellerTreeData = (datasets.currentJob?.jobTraveller && Array.isArray(datasets.currentJob.jobTraveller.JobAsmbl))
        ? buildTreeData(datasets.currentJob.jobTraveller)
        : [];

    const jobAsmblColumns = [
        { field: 'AssemblySeq', headerName: 'ASM', align: 'center', headerAlign: 'center', flex: 0.7 },
        { field: 'PartNum', headerName: 'Part Number', flex: 1 },
        { field: 'Description', headerName: 'Part Description', flex: 2 },
        { field: 'RevisionNum', headerName: 'Revision', align: 'center', headerAlign: 'center', flex: 1 },
        { field: 'RequiredQty', headerName: 'Required Qty', flex: 1, align: 'right', headerAlign: 'right', },
        { field: 'IUM', headerName: 'UOM', align: 'center', headerAlign: 'center', flex: 0.7 },
    ];

    const jobOperColumns = [
        { field: 'OprSeq', headerName: 'Opr', align: 'center', headerAlign: 'center', flex: 0.7 },
        { field: 'OpCode', headerName: 'Code', flex: 0.7 },
        { field: 'OpDesc', headerName: 'Description', flex: 2.5 },
        { field: 'RunQty', headerName: 'Required Qty', align: 'right', flex: 1, },
        { field: 'IUM', headerName: 'UOM', align: 'center', headerAlign: 'center', flex: 0.7 },
        { field: 'EstSetHours', headerName: 'Setup Hours (Est)', align: 'center', headerAlign: 'center', flex: 1 },
        { field: 'EstProdHours', headerName: 'Prod Hours (Est)', align: 'center', headerAlign: 'center', flex: 1 },
        { field: 'ExpCycTm', headerName: 'Cycle Time', align: 'center', headerAlign: 'center', flex: 1 },
        { field: 'ProdStandard', headerName: 'Prod Std', align: 'right', flex: 1 },
        { field: 'StdFormat', headerName: '', align: 'center', headerAlign: 'center', flex: 0.7 },
        { field: 'QtyPerCycle', headerName: 'Pcs/ Cycle', align: 'center', headerAlign: 'center', flex: 1 },
    ];

    const jobMtlColumns = [
        { field: 'OprSeq', headerName: 'Opr', align: 'center', headerAlign: 'center', flex: 0.7 },
        { field: 'MtlSeq', headerName: 'Mtl Seq', align: 'center', headerAlign: 'center', flex: 0.7 },
        { field: 'PartNum', headerName: 'Part Number', flex: 1 },
        { field: 'Description', headerName: 'Part Description', flex: 2 },
        { field: 'RequiredQty', headerName: 'Required Qty', align: 'right', headerAlign: 'right', flex: 1, },
        { field: 'IUM', headerName: 'UOM', align: 'center', headerAlign: 'center', flex: 0.7 },
        { field: 'WarehouseCode', headerName: 'Warehouse', align: 'center', headerAlign: 'center', flex: 1 },
        { field: 'RelatedOperation', headerName: 'Rel. Opr', align: 'center', headerAlign: 'center', flex: 1 },
    ];

    const jobOpDtlColumns = [
        { field: 'OprSeq', headerName: 'Opr', align: 'center', headerAlign: 'center', flex: 0.7 },
        { field: 'OpDtlSeq', headerName: 'Op Dtl', align: 'center', headerAlign: 'center', flex: 0.7 },
        { field: 'ResourceID', headerName: 'Resource ID', flex: 1 },
        { field: 'ResourceDescription', headerName: 'Res Description', flex: 2 },
        { field: 'SetupOrProd', headerName: 'Setup/ Prod', align: 'center', headerAlign: 'center', flex: 1 },
        { field: 'ProdCrewSize', headerName: 'Crew', align: 'center', headerAlign: 'center', flex: 1 },
        { field: 'NumCavs', headerName: 'Cavities', align: 'center', headerAlign: 'center', flex: 1 },
        { field: 'RunnerWt', headerName: 'Runner Weight (g)', align: 'center', headerAlign: 'center', flex: 1 },
        { field: 'DailyProdRate', headerName: 'Daily Prod Rate', align: 'center', headerAlign: 'center', flex: 1 },
    ];


    const displayScreenContent = () => {
        return (
            <React.Fragment>
                <Grid container spacing={1} marginTop={0}>
                    {datasets.currentJob !== null && typeof datasets.currentJob !== "undefined" ? (
                        <React.Fragment>
                            {datasets.currentJob?.jobTraveller && (
                                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                    <ThemeProvider theme={sistemaTheme}>
                                        <Button
                                            id="btnJobTraveller"
                                            variant="contained"
                                            color="primary"
                                            onClick={openJobTraveller}
                                            sx={{ backgroundColor: sistColours['purple'], border: sistColours['microwave-Main'] }}
                                        >
                                            Job Traveller
                                        </Button>
                                    </ThemeProvider>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={5} padding={1}>
                                        <Paper elevation={10}>
                                            <JobDetails
                                                mcID={machineID}
                                                datasets={datasets}
                                                feedback={handleJobDetailsReceipt}
                                            />
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={5} padding={1}>
                                        <Paper elevation={10}>
                                            <JobStatus machineID={machineID} datasets={datasets} />
                                            <LastPallet machineID={machineID} datasets={datasets} />
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={2} padding={1}>
                                        <Paper elevation={10}>
                                            <Actions datasets={datasets} />
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    ) : (
                        <div>
                            <Typography
                                variant="h5"
                                gutterBottom
                                padding={sistTheme.spacing(1)}
                            >
                                {msgJobNotFound.split("\n").map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </Typography>
                        </div>
                    )}
                </Grid>

                <ThemeProvider theme={sistemaTheme}>
                    <CssBaseline />
                    <Dialog open={openDialog} onClose={handleCloseDialog} sx={{ minHeight: '80%' }}>
                        <DialogTitle>Job Traveller {datasets.currentJob?.jn}</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={3}>
                                <Grid item xs={3}>
                                    <br />
                                    <RichTreeView
                                        defaultExpandedItems={["grid"]}
                                        items={jobTravellerTreeData}
                                        onItemClick={(event, item) => handleTreeItemClick(item)}
                                        sx={{ position: 'sticky', top: 0 }}
                                    />
                                </Grid>
                                <Grid container item xs={8}>
                                    {displayJobAsmbl.length > 0 && (
                                        <Grid item xs={12}>
                                            <br />
                                            <Typography variant="h6">Assembly Sequence</Typography>
                                            <br />
                                            <DataGrid
                                                rows={displayJobAsmbl.map((asmbl, index) => ({
                                                    id: index,
                                                    AssemblySeq: asmbl.AssemblySeq,
                                                    PartNum: asmbl.PartNum,
                                                    Description: asmbl.Description,
                                                    RevisionNum: asmbl.RevisionNum,
                                                    RequiredQty: asmbl.RequiredQty,
                                                    IUM: asmbl.IUM?.toUpperCase(),
                                                }))}
                                                columns={jobAsmblColumns}
                                                hideFooter
                                            />
                                            <br />
                                        </Grid>
                                    )}

                                    {displayJobMtl.length > 0 && (
                                        <Grid item xs={12}>
                                            <Typography variant="h6">Raw Materials</Typography>
                                            <br />
                                            <DataGrid
                                                rows={displayJobMtl.map((mtl, index) => ({
                                                    id: index,
                                                    OprSeq: mtl.OprSeq,
                                                    MtlSeq: mtl.MtlSeq,
                                                    PartNum: mtl.PartNum,
                                                    Description: mtl.Description,
                                                    RequiredQty: mtl.RequiredQty,
                                                    IUM: mtl.IUM?.toUpperCase(),
                                                    WarehouseCode: mtl.WarehouseCode,
                                                    RelatedOperation: mtl.RelatedOperation,
                                                }))}
                                                columns={jobMtlColumns}
                                                hideFooter
                                            />
                                            <br />
                                        </Grid>
                                    )}
                                    {displayJobOper.length > 0 && (
                                        <Grid item xs={12}>
                                            <Typography variant="h6">Job Operations</Typography>
                                            <br />
                                            <DataGrid
                                                rows={displayJobOper.map((oper, index) => ({
                                                    id: index,
                                                    OprSeq: oper.OprSeq,
                                                    OpCode: oper.OpCode,
                                                    OpDesc: oper.OpDesc,
                                                    RunQty: oper.RunQty,
                                                    IUM: oper.IUM?.toUpperCase(),
                                                    EstSetHours: oper.EstSetHours,
                                                    EstProdHours: oper.EstProdHours,
                                                    ExpCycTm: oper.ExpCycTm,
                                                    ProdStandard: oper.ProdStandard,
                                                    StdFormat: oper.StdFormat?.toUpperCase(),
                                                    QtyPerCycle: oper.QtyPerCycle,
                                                }))}
                                                columns={jobOperColumns}
                                                hideFooter
                                            />
                                            <br />
                                        </Grid>
                                    )}
                                    {displayJobOpDtl.length > 0 && (
                                        <Grid item xs={12}>
                                            <Typography variant="h6">Job Operation Details</Typography>
                                            <br />
                                            <DataGrid
                                                rows={displayJobOpDtl.map((opDtl, index) => ({
                                                    id: index,
                                                    OprSeq: opDtl.OprSeq,
                                                    OpDtlSeq: opDtl.OpDtlSeq,
                                                    OpDtlDesc: opDtl.OpDtlDesc,
                                                    SetupOrProd: opDtl.SetupOrProd,
                                                    ProdCrewSize: opDtl.ProdCrewSize,
                                                    DailyProdRate: opDtl.DailyProdRate,
                                                    ResourceID: opDtl.ResourceID,
                                                    ResourceDescription: opDtl.ResourceDescription,
                                                    NumCavs: opDtl.NumCavs,
                                                    RunnerWt: opDtl.RunnerWt,
                                                }))}
                                                columns={jobOpDtlColumns}
                                                hideFooter
                                            />
                                            <br />
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </ThemeProvider>
            </React.Fragment>
        );
    };


    if (!machineID) {
        return displayError('Resource is not specified in the URL. Please contact IT for assistance.');
    }

    if (displayContent) {
        return displayScreenContent();
    }

    if (!hasJobAssigned) {
        return isMattecMachine
            ? displayError("Please check Mattec to see if resource has job assigned.")
            : displayError(`Resource ${machineID} may be a non-Mattec resource. Please start job in Epicor MES`);
    }

    return displayError("Cannot display job details. Please contact IT for assistance.");
}
