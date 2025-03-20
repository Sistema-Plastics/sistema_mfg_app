import React, { useEffect, useRef, useState } from "react";
import JobStatus from "./JobStats";
import JobDetails from "./JobDetails";
import Actions from "./Actions";
import LastPallet from "./LastPallet";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Grid, Paper, Typography, Button, Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import { RichTreeView, TreeViewItems } from '@mui/x-tree-view';
//import { ChevronRightIcon, ExpandMoreIcon } from '@mui/icons-material';
//import useTheme from "@mui/material/styles/useTheme";
//import { sistemaTheme, sistTreeItem } from "../../assets/styling/muiThemes";
import { sistemaTheme } from "../../assets/styling/muiThemes";
import { mfgDashboardFunctions } from "../../helpers/HelperScripts";

export default function Content({ machineID, ibdData }) {
    const [datasets, setDataSets] = useState(ibdData);
    const [isMattecMachine, setIsMattecMachine] = useState(false);
    const [hasJobAssigned, sethasJobAssigned] = useState(false);
    const [displayContent, setDisplayContent] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
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
                console.log(msg);
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
            <themeProvider theme={sistemaTheme}>
                <Typography
                    variant='h5'
                    gutterBottom
                >
                    {msg}
                </Typography>
            </themeProvider>
        );
    }

    const openJobTraveller = () => {
        setOpenDialog(true);

    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const buildTreeData = (job) => {
        if (!Array.isArray(job.JobAsmbl)) return [];

        return job.JobAsmbl.map((jobAsmbl, index) => ({
            id: index,
            label: `ASM: ${jobAsmbl.AssemblySeq}\t${jobAsmbl.Description.toUpperCase()}`,
        }));

        //return jobTravellerData.map((job, index) => ({
        //    id: index,
        //    label: `JobAsmbl: ${job.JobAsmbl.AssemblySeq}`,
        //    //children: job.JobOper?.map((opr, oprIndex) => ({
        //    //    id: `JobOper-${job.JobAsmbl}-${opr.OprSeq}-${oprIndex}`,
        //    //    label: `JobOper: ${opr.OprSeq} - ${opr.OpDesc}`,
        //    //    children: opr.JobOpDtl?.map((opDtl, dtlIndex) => ({
        //    //        id: `JobOpDtl-${job.JobAsmbl}-${opr.OprSeq}-${dtlIndex}`,
        //    //        label: `JobOpDtl: ${opDtl.DetailDesc}`,
        //    //    })) || [],
        //    //})) || [],
        //}));
    };

    const jobTravellerTreeData = (datasets.currentJob?.jobTraveller && Array.isArray(datasets.currentJob.jobTraveller.JobAsmbl))
        ? buildTreeData(datasets.currentJob.jobTraveller)
        : [];

    //console.log("RAYHAAN", jobTravellerTreeData);
    ////const renderTree = (node) => {
    ////    if (!node) return null;
    ////    return (
    ////        <TreeItem key={node.id} nodeId={node.id} label={node.label}>
    ////            {node.children?.map((child) => renderTree(child))}
    ////        </TreeItem>
    ////    );
    ////};





    const displayScreenContent = () => {
        return (
            <React.Fragment>
                <Grid container spacing={1} marginTop={0}>
                    {datasets.currentJob !== null &&
                        typeof datasets.currentJob !== "undefined" ? (
                        <>
                            <Grid item xs={5} padding={0}>
                                <Paper elevation={10}>
                                    <JobDetails
                                        mcID={machineID}
                                        datasets={datasets}
                                        feedback={handleJobDetailsReceipt}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={5} padding={0}>
                                <Paper elevation={10}>
                                    <JobStatus
                                        machineID={machineID}
                                        datasets={datasets}
                                    />
                                    <LastPallet
                                        machineID={machineID}
                                        datasets={datasets}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={2} padding={0}>
                                <Paper elevation={10}>
                                    <Actions
                                        datasets={datasets}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} padding={0}>
                                <Button id="btnJobTraveller"
                                    variant="contained"
                                    color="primary"
                                    onClick={openJobTraveller}
                                >
                                    Job Traveller
                                </Button>
                            </Grid>
                        </>
                    ) : (
                        <div>
                            <Typography
                                variant='h5'
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
                    <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
                        <DialogTitle>Job Traveller {datasets.currentJob?.jn}</DialogTitle>
                        <DialogContent>
                            <Box>
                                <Grid>
                                    <RichTreeView
                                        defaultExpandedItems={['grid']}
                                        items={jobTravellerTreeData}
                                    />
                                </Grid>
                            </Box>


                        </DialogContent>
                        <DialogActions><Button onClick={() => setOpenDialog(false)}>Close</Button></DialogActions>
                    </Dialog>
                </ThemeProvider>
            </React.Fragment>

        );
    }

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


