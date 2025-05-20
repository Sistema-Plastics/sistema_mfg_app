//This is the page where Drag and drop of employees are saved to Cell_c
import React, { useEffect, useRef, useContext, useState } from "react";
import { SistemaContext } from "../../../assets/components/SistemaHeader";
import { useSearchParams } from "react-router-dom";
//import { Typography, } from "@mui/material";
import {
	AccordionDetails,
	Box,
	Button,
	Dialog,
	DialogTitle,
	FormControl,
	FormControlLabel,
	Grid,
	Typography,
	TextField,
	Table,
	TableRow,
	TableCell,
	TableBody,
	Tooltip,
	Link,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { HomeRepairServiceSharp } from "@mui/icons-material";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import KeyboardReturnOutlinedIcon from "@mui/icons-material/KeyboardReturnOutlined";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { DataGrid } from "@mui/x-data-grid";

//import Typography from '@mui/material/Typography';

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { connections } from "../../../config/ConnectionBroker";
import {
	mqttFunctions,
	operationsFunctions,
} from "../../../helpers/HelperScripts";
import { helperfunctions } from "../../../assets/scripts/helperfunctions";
import assyEmployees from "../assyData/EmpList";
import assyShifts from "../assyData/Shifts";
import {
	RowDataTableCell,
	RowHdrTableCell,
} from "../../../assets/styling/muiThemes";
import { muiThemes } from "../../../assets/styling/muiThemes";
import mqtt from "mqtt";
import { amber, grey, yellow } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { sistColours, sistemaTheme } from "../../../assets/styling/muiThemes";

const sistTheme = muiThemes.getSistemaTheme();

const Lane = styled(Box)(({ theme }) => ({
	// border: "solid",
	// borderColor: "black",
	backgroundColor: "lightgrey",
	// paddingBottom: 4,
	// paddingTop: 4,
	fontSize: 14,
	margin: 5,
	width: 250,
}));

const ColumnHeaderItem = styled(Paper)(({ theme }) => ({
	backgroundColor: grey[500], //theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.tableCellHeading,
	margin: 0,
	marginTop: 5,
	borderRadius: 0,
	// padding: theme.spacing(1),
	paddingLeft: 10,
	paddingRight: 10,
	textAlign: "left",
	color: theme.palette.sistema.klipit.contrastText,
}));
const ColumnDataItem = styled(Paper)(({ theme }) => ({
	backgroundColor: grey[50], //theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.tableCellData,
	borderRadius: 0,
	// padding: theme.spacing(1),
	margin: 0,
	paddingLeft: 10,
	paddingRight: 10,
	textAlign: "left",
	color: theme.palette.sistema.klipit.light,
	minWidth: 250,
	maxWidth: 330,
}));

const RowHeaderItem = styled(Paper)(({ theme }) => ({
	backgroundColor: grey[500], //theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.subtitle1,
	margin: 0,
	marginTop: 5,
	borderRadius: 0,
	// padding: theme.spacing(1),
	paddingLeft: 10,
	paddingRight: 10,
	textAlign: "left",
	width: 250,
	color: theme.palette.sistema.klipit.contrastText,
}));
const RowDataItem = styled(Paper)(({ theme }) => ({
	backgroundColor: grey[100], //theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.tableCellData,
	borderRadius: 0,
	// padding: theme.spacing(1),
	margin: 0,
	paddingLeft: 10,
	paddingRight: 10,
	textAlign: "left",
	color: theme.palette.sistema.klipit.light,
	minWidth: 150,
	maxWidth: 630,
}));

const Accordion = styled((props) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
	border: `0px solid ${theme.palette.divider}`,
	margin: 0,
	padding: 0,
}));

const AccordionSummary = styled((props) => (
	<MuiAccordionSummary
		expandIcon={
			<ArrowForwardIosSharpIcon
				sx={{
					display: "flex",
					fontSize: "0.9rem",
					color: "blue",
					marginRight: 1,
				}}
			/>
		}
		{...props}
	/>
))(({ theme }) => ({
	backgroundColor: "transparent",
	// backgroundColor:
	//   theme.palette.mode === 'dark'
	//     ? 'rgba(255, 255, 255, .05)'
	//     : 'rgba(0, 0, 0, .03)',
	flexDirection: "row-reverse",
	"& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
		transform: "rotate(90deg)",
	},
	"& .MuiAccordionSummary-content": {
		// marginLeft: theme.spacing(1),
		margin: 0,
	},
	"& .MuiAccordionSummary-content": {
		// marginLeft: theme.spacing(1),
		margin: 0,
	},
}));

const iconSX = {
	fontSize: 40,
	color: sistTheme.palette.sistema.klipit.light,
};

export default function ProductionBooking() {
	const sistemaContext = useContext(SistemaContext);
	const [isLoggedIn, setIsLoggedIn] = useState(false); //setting to true avoids teh flkashing of the dialog wehn initially rendering. Set to False after datasets populated
	const [client, setClient] = useState(null);
	const [isConnected, setIsConnected] = useState(false);
	const [dataComplete, setDataComplete] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();

	const [jobCrew, setJobCrew] = useState(null);
	const [lineErr, setLineErr] = useState(true);
	const [jobs, setJobs] = useState(null);

	const [employeeColumns, setEmployeeColumns] = useState({
		available: {
			title: "Available Employees",
			items: [],
		},
		clockedin: {
			title: "Clocked In Employees",
			items: [],
		},
		onbreak: {
			title: "Employees On Break",
			items: [],
		},
	});
	const empHelperText = useRef("Employee Number");

	const params = new URLSearchParams(document.location.search);
	const mc = params.get("line");
	const resourceID = mc ? mc.trim().toUpperCase() : "";

	//only define onbreak as empty array, rendering will happen before this can be filled and this will rpevent errors

	const [datasets, setDatasets] = useState({
		onbreak: [],
	});

	// //now add bse topic as prefx
	const baseTopic = connections.getBaseMQTTTopicFromPort();
	let topics = [
		"systemdata/dashboards/epicor/employeeslist",
		"systemdata/dashboards/epicor/activelabour",
		"systemdata/dashboards/epicor/cells",
		"systemdata/dashboards/epicor/assycrewsize",
		"systemdata/dashboards/epicor/jobsallops",
		// "+/+/employees/onbreak", //cannot log these at startup as no line is yet known
	];

	topics = topics.map((m) => baseTopic + m);

	useEffect(() => {
		let title = "Assembly Production Booking";
		if (resourceID) title += ` ${resourceID}`;
		sistemaContext.setPageTitle(title);
		setClient(
			mqtt.connect(
				mqttFunctions.getHostname(),
				mqttFunctions.getOptions(
					"mqtt",
					Math.random().toString(16).substring(2, 8)
				)
			)
		);
	}, []);

	useEffect(() => {
		if (client === null) return;

		client.on("connect", function () {
			//when connected pass to is connected effect to subscribe
			setIsConnected(true);
			console.log("MQTT client connected");
		});
		client.on("end", () => {
			console.log("Connection to MQTT broker ended");
		});

		client.on("message", function (topic, message) {
			//handle systems data messages
			if (topic.includes("systemdata")) {
				const msg = JSON.parse(message.toString()).value;
				switch (true) {
					case topic.includes("employeeslist"):
						setDatasets((prevState) => {
							if (
								JSON.stringify(prevState.employees) ===
								JSON.stringify(msg)
							)
								return prevState;
							return {
								...prevState,
								employees: msg,
							};
						});
						break;
					case topic.includes("activelabour"):
						setDatasets((prevState) => {
							if (
								JSON.stringify(prevState.activelabour) ===
								JSON.stringify(msg)
							)
								return prevState;
							return {
								...prevState,
								activelabour: msg,
							};
						});
						break;
					case topic.includes("assycrewsize"):
						setDatasets((prevState) => {
							if (
								JSON.stringify(prevState.assycrewsizes) ===
								JSON.stringify(msg)
							)
								return prevState;
							return {
								...prevState,
								assycrewsizes: msg,
							};
						});
						break;
					case topic.includes("jobsallops"):
						setDatasets((prevState) => {
							if (
								JSON.stringify(prevState.jobs) ===
								JSON.stringify(msg)
							)
								return prevState;
							return {
								...prevState,
								jobs: msg,
							};
						});
						break;
					case topic.includes("cells"):
						// Add unassigned reference
						msg.unshift({
							CodeID: "0",
							CodeDesc: "Unassigned Employees",
							LongDesc: "ASPK",
						});

						setDatasets((prevState) => {
							if (
								JSON.stringify(prevState.cells) ===
								JSON.stringify(msg)
							)
								return prevState;
							return {
								...prevState,
								cells: msg,
							};
						});
						break;
					default:
						break;
				}

				//now unsubscibe from topic to prevent unwanted updates
				client.unsubscribe(topic, function (resp) {
					resp === null
						? console.log("unsubscribed: " + topic)
						: console.log("unsubscribed error: " + resp);
				});
			} else {
				//populate datasets for this resources when known
				//These should be after the line is set as
				//theyre subscribed ot in teh reource useEffect

				if (topic.includes("onbreak")) {
					setDatasets((prevState) => {
						return {
							...prevState,
							onbreak: JSON.parse(message.toString()),
						};
					});
				}
				console.log(
					`topic ${topic} message ${JSON.stringify(
						JSON.parse(message.toString())
					)} `
				);
			}
		});
	}, [client]);

	useEffect(() => {
		//when connected subscribe to the topics
		if (isConnected) {
			topics.forEach((topic) => {
				client.subscribe(topic, function () {
					console.log("subscribed to ", topic);
				});
			});
		}
	}, [isConnected]);

	useEffect(() => {
		//when datsets are filled we can now get real
		if (
			typeof datasets.employees !== "undefined" &&
			typeof datasets.cells !== "undefined" &&
			typeof datasets.activelabour !== "undefined" &&
			// typeof datasets.onbreak !== "undefined" &&
			typeof datasets.assycrewsizes !== "undefined" &&
			typeof datasets.jobs !== "undefined" &&
			resourceID !== ""
		) {
			// setMaxLineCrewSize();
			setDataComplete(true);

			let jc = datasets.assycrewsizes.filter(
				(a) => a.ResourceID.toUpperCase() === resourceID
			)[0];

			if (!jc) {
				console.warn(`Resource ${resourceID} not in assycrewsizes`);
				return;
			}

			if (jc.ResourceGrpID === "") {
				console.warn(
					`Resource ${resourceID} is not assigned to a Resource Group`
				);
				return;
			}

			let el = datasets.employees.filter(
				(e) => e.ResourceGrpID === jc.ResourceGrpID
			);
			let act = datasets.activelabour.filter(
				(e) => e.ResourceID === jc.ResourceID
			);

			//Filter out of available the already assigned. Has to be on full
			//active labour dataset to make sure we dont see other machine assignments
			el = el.filter(
				(e) =>
					datasets.assycrewsizes.filter(
						(ac) => ac.EmployeeNum === e.EmpID
					).length === 0
			);

			setEmployeeColumns({
				...employeeColumns,
				["available"]: {
					...employeeColumns.available,
					items: el,
				},
				["clockedin"]: {
					...employeeColumns.clockedin,
					items: act,
				},
			});

			const jb = datasets.jobs.filter(
				(jb) =>
					jb.JobNum === jc.JobNum &&
					jb.OprSeq === jc.OprSeq &&
					jb.AssemblySeq === jc.AssemblySeq
			)[0];

			if (!jb) {
				console.warn(
					`Job details for ${jc.JobNum}-${jc.AssemblySeq}-${jc.OprSeq} not in jobsallops`
				);
				return;
			}

			jc.OpCode = jb.OpCode;
			jc.OpDesc = jb.OpDesc;
			jc.JCDeptDescription = jb.JCDeptDesc;
			jc.OpCodeOpDesc = jb.OpCodeOpDesc;
			jc.Company = jb.Company;

			setJobCrew(jc);
			handleLogIn(resourceID);
		}
	}, [datasets]);

	//subscribe to the OnBreak topic when we know teh resource
	useEffect(() => {
		//when datsets are filled we can now get real
		if (jobCrew) {
			//subscribe to topic
			const tpc =
				baseTopic +
				`+/${jobCrew.ResourceID.toLowerCase()}/employees/onbreak`;
			client.subscribe(tpc, function () {
				console.log("subscribed to ", tpc);
			});
		}
	}, [jobCrew]);

	useEffect(() => {
		//get each lines max crewsize for jobs where startdate
		//is less than or equalk to today
		// if (dataComplete) setMaxLineCrewSize(null);
		console.log("useEffect dataComplete");
	}, [dataComplete]);

	const handleLogIn = (resource) => {
		setIsLoggedIn(true);
		//get current job and filter jobs for current resource
		//if no login line is passed we get it from the state

		if (resource === null) resource = jobCrew.ResourceID;
		let v = datasets.jobs.filter((j) => j.ResourceID === resource);

		//if we have jobs returned, get earliest
		if (v.length > 0) {
			v.sort((a, b) => {
				let adate = new Date(a.MattecStartDate);
				let bdate = new Date(b.MattecStartDate);
				adate.setHours(
					a.MattecStartHour.substring(
						0,
						a.MattecStartHour.indexOf(".")
					)
				);
				bdate.setHours(
					b.MattecStartHour.substring(
						0,
						b.MattecStartHour.indexOf(".")
					)
				);
				return adate.getTime() - bdate.getTime();
			});
			//now the jobs are oin dfate getSectionOrder, if
			//If we are sent a job in teh querystring, split the list at that point
			if (searchParams.get("job") !== null) {
				//check that the job exists
				try {
					const tgtJob = v.filter(
						(j) => j.JobNum === searchParams.get("job")
					)[0];

					//if so now filter from that date/tim onwards, taget job will then be [0] and next job [1]
					v = v.filter(
						(j) =>
							new Date(j.MattecStartDate) >=
								new Date(tgtJob.MattecStartDate) &&
							parseFloat(j.MattecStartHour) >=
								parseFloat(tgtJob.MattecStartHour)
					);
					console.log("xxx");
				} catch (ex) {}
			}

			//remap all the objects
			let tmpJ = v[0];
			tmpJ.QtyPerPallet = parseFloat(tmpJ.QtyPerPallet);
			tmpJ.QtyPerPallet_c = parseFloat(tmpJ.QtyPerPallet_c);
			tmpJ.QtyPerCarton_c = parseFloat(tmpJ.QtyPerCarton_c);
			tmpJ.SetupLabRate = parseFloat(tmpJ.SetupLabRate);
			tmpJ.SetUpCrewSize = parseFloat(tmpJ.SetUpCrewSize);
			tmpJ.ProdCrewSize = parseFloat(tmpJ.ProdCrewSize);
			tmpJ.ReceivedQty = parseFloat(tmpJ.ReceivedQty);
			tmpJ.EstSetHours = parseFloat(tmpJ.EstSetHours);
			tmpJ.ProdStd = parseFloat(tmpJ.ProdStd);
			tmpJ.TimeLeft = parseFloat(tmpJ.TimeLeft);
			let d = new Date(tmpJ.MattecStartDate);
			d.setHours(
				tmpJ.MattecStartHour.substring(
					0,
					tmpJ.MattecStartHour.indexOf(".")
				),
				tmpJ.MattecStartHour.substring(
					tmpJ.MattecStartHour.indexOf(".") + 1
				)
			);

			tmpJ.MattecStartDateTime = d;
			d = new Date(tmpJ.MattecEndDate);
			d.setHours(
				tmpJ.MattecEndHour.substring(
					0,
					tmpJ.MattecEndHour.indexOf(".")
				),
				tmpJ.MattecEndHour.substring(
					tmpJ.MattecEndHour.indexOf(".") + 1
				)
			);
			tmpJ.MattecEndDateTime = d;
			// tmpJ.ProdCrewSize = parseFloat(tmpJ.ProdCrewSize);
			// tmpJ.ProdCrewSize = parseFloat(tmpJ.ProdCrewSize);

			//Calc the hours/pallet
			// 1.5 Pce/Min
			// 60/1.5 => 40 Sec/Pce
			// 16 Pce / Pallet x 40 Sec => 640 Secs per Pallet
			// 640 sec / 3600 = 0.1777 Hours per Pallet

			//decimal hour
			tmpJ.HoursPerPalletDc =
				((60 / tmpJ.ProdStd) * tmpJ.QtyPerPallet) / 3600; //hours per pallet digital
			//digital hour
			tmpJ.HoursPerPalletDg = helperfunctions.getRealTimefromSeconds(
				(60 / tmpJ.ProdStd) * tmpJ.QtyPerPallet,
				false,
				"hhmmss"
			); //hours per pallet digital

			let tmpJobs = {
				firstJob: tmpJ,
			};
			//show next job details if avail
			if (v.length > 1) {
				let tmpJ2 = v[1];
				tmpJobs.nextJob = tmpJ2;
			} else {
				//create empty data for render
				let tmpJ2 = {
					JobNum: "",
					ProdCrewSize: "",
				};
				tmpJobs.nextJob = tmpJ2;
			}

			setJobs(tmpJobs);

			/* TODO
			setDatasets((prevState) => {
				return {
					...prevState,
					resourcejobs: tmpJobs,
				};
			});
			*/
		}
	};

	const handleLineChange = (event) => {
		const val = event.target.value.toUpperCase();

		const lines = new Set(
			datasets.jobs.map((j) => j.ResourceID.toUpperCase())
		);
		if (lines.has(val)) {
			setJobCrew(
				datasets.assycrewsizes.filter((a) => a.ResourceID === val)[0]
			);
			setLineErr(false);
		} else {
			setLineErr(true);
		}
	};

	const handleReturnFromBreakEnMasse = () => {
		let record = {
			topic: (
				baseTopic +
				`${jobCrew.Cell_c}/${jobCrew.ResourceID}/employees/onbreak`
			).toLowerCase(),
			qos: 0,
			retain: true,
			payload: "[]",
			status: "",
		};

		record.status = 0;

		let { topic, qos, retain, payload } = record;
		// payload = JSON.stringify(payload);
		client.publish(
			topic,
			payload,
			{
				qos,
				retain,
			},
			(error) => {
				if (error) {
					console.log("Publish error: ", error);
				}
			}
		);
	};

	const handleReturnFromBreak = () => {};

	const handleMoveToBreakEnMasse = () => {
		const emps = datasets.activelabour
			.filter(
				(l) =>
					l.ResourceID === jobCrew.ResourceID &&
					datasets.onbreak.filter((ob) => l.EmployeeNum === ob.id)
						.length < 1
			)
			.map((e) => ({
				id: e.EmployeeNum,
				name: e.Name,
				timestamp: new Date().getTime(),
			}))
			.concat(datasets.onbreak);

		const topic = (
			baseTopic +
			`${jobCrew.Cell_c}/${jobCrew.ResourceID}/employees/onbreak`
		).toLowerCase();

		setDatasets((prevState) => {
			return {
				...prevState,
				onbreak: emps,
			};
		});

		const payload = JSON.stringify(emps);

		publishMQTT(topic, payload);
	};

	const handleOnDragEnd = (result) => {
		console.log("moving ");
		// Use this to exit if drag n drop is outside of droppable areas
		try {
			const t1 = result.source.droppableId;
			const t2 = result.destination.droppableId;
		} catch (error) {
			return;
		}

		const { source, destination } = result;

		const from = source.droppableId;
		const to = destination.droppableId;

		let currONB = [];
		if (source.droppableId == destination.droppableId) {
			const column = employeeColumns[source.droppableId];
			const copiedItems = [...column.items];
			const [removed] = copiedItems.splice(source.index, 1);
			copiedItems.splice(destination.index, 0, removed);
			setEmployeeColumns({
				...employeeColumns,
				[source.droppableId]: {
					...column,
					items: copiedItems,
				},
			});
		} else {
			let pyld = {}; //`{"JobNum":"${jobCrew.JobNum}", "AssemblySeq":"${jobCrew.AssemblySeq}", "OprSeq":"${jobCrew.OprSeq}"}`

			pyld.EmpID = result.draggableId;
			pyld.JobNum = jobCrew.JobNum;
			pyld.Company = jobCrew.Company;
			pyld.AssemblySeq = jobCrew.AssemblySeq;
			pyld.OprSeq = jobCrew.OprSeq;
			pyld.JCDept = jobCrew.JCDept;
			pyld.ResourceID = jobCrew.ResourceID;
			pyld.ResourceGrpID = jobCrew.ResourceGrpID;
			pyld.OpCode = jobCrew.OpCode;
			pyld.JCDeptDescription = jobCrew.JCDeptDescription;
			pyld.OpCodeOpDesc = jobCrew.OpCodeOpDesc;

			let topic =
				baseTopic +
				`${jobCrew.ResourceGrpID}/${jobCrew.ResourceID}/employees`;

			const sourceColumn = employeeColumns[source.droppableId];
			const destColumn = employeeColumns[destination.droppableId];
			const sourceItems = [...sourceColumn.items];
			const destItems = [...destColumn.items];
			const [removed] = sourceItems.splice(source.index, 1);
			destItems.splice(destination.index, 0, removed);
			setEmployeeColumns({
				...employeeColumns,
				[source.droppableId]: {
					...sourceColumn,
					items: sourceItems,
				},
				[destination.droppableId]: {
					...destColumn,
					items: destItems,
				},
			});

			if (from === "available") {
				if (to === "clockedin") {
					//map to avoid byref copy
					// const emp = datasets.employees.filter(
					// (a) => a.EmpID === result.draggableId
					// )
					console.log("clocking in");
					topic += "/clockin";
				} else {
					console.log("cant move avail to break or back to itsel");
				}
			} else if (from === "onbreak") {
			} else {
				//only option left is from clocked in
			}

			// if (from === "clockedin" && to === "onbreak") {
			// //map to avoid byref copy
			// const emp = datasets.activelabour.filter(
			// (a) => a.EmployeeNum === result.draggableId
			// )[0];

			// currONB = [
			// ...datasets.onbreak,
			// {
			// id: result.draggableId,
			// name: emp.Name,
			// timestamp: new Date().getTime(),
			// },
			// ];
			// } else if (from === "onbreak" && to === "clockedin") {
			// currONB = datasets.onbreak.filter((ob) => ob.id !== result.draggableId);
			// }
			// else if (from === "cell" && to === "clockedin") {}
			// const topic = (
			// baseTopic +
			// `${jobCrew.ResourceGrpID}/${jobCrew.ResourceID}/employees/onbreak`
			// ).toLowerCase();
			// const payload = JSON.stringify(currONB);

			const payload = JSON.stringify(pyld);
			publishMQTT(topic.toLowerCase(), payload);
		}
		console.log("moved");
	};

	const onDragEnd = (result, employeeColumns, setEmployeeColumns) => {};

	const displayError = (msg) => {
		return (
			<ThemeProvider theme={sistemaTheme}>
				<Typography variant='h5' gutterBottom>
					{" "}
					{msg}{" "}
				</Typography>{" "}
			</ThemeProvider>
		);
	};

	const publishMQTT = (topic, payload) => {
		const qos = 0;
		const retain = true;

		client.publish(
			topic,
			payload,
			{
				qos,
				retain,
			},
			(error) => {
				if (error) {
					console.log("Publish error: ", error);
				}
			}
		);
	};

	/* TODO
	const jobSummaryColumns = [
		{ field: "Job", headerName: "Job", align: "center", headerAlign: "center", flex: 0.7},
		{ field: "AssemblySeq", headerName: "ASM", align: "center", headerAlign: "center", flex: 0.7},
		{ field: "Part", headerName: "Part Number", flex: 1 },
		{ field: "Description", headerName: "Part Description", flex: 2 },
		{ field: "RequiredQty", headerName: "Required Qty", flex: 2 },
		{ field: "Remaining", headerName: "Remaining Qty", flex: 2 },
	];

	const displayJobSummary = () => {
		console.log("displayJobSummary datasets:", datasets); // <-- add this line to debug

		return (
			<React.Fragment>
				<ThemeProvider theme={sistemaTheme}>
					<Grid container item xs={8}>
						<br />
						<Typography variant='h6'>Assembly Sequence</Typography>
						<br />
						<DataGrid
							rows={datasets?.resourcejobs?.firstjob?.map(
								(job, index) => ({
									id: index,
									Job: job.JobNum.toUpperCase(),
									AssemblySeq: job.AssemblySeq,
									Part: job.PartNum.toUpperCase(),
									Description:
										job.PartDescription.toUpperCase(),
									RequiredQty: job.ProdQty,
									Remaining: job.ProdQty - job.QtyCompleted,
								})
							)}
							columns={jobSummaryColumns}
							hideFooter
						/>
						<br />
					</Grid>
				</ThemeProvider>
			</React.Fragment>
		);
	};
	*/

	if (!resourceID) {
		return displayError(
			"Resource is not specified in the URL. Please contact IT for assistance."
		);
	}
	/* TODO
	return displayJobSummary();
	*/

	return !dataComplete ? (
		<React.Fragment>Waiting for Data</React.Fragment>
	) : (
		<React.Fragment>
			<Box>
				<Grid container>
					<Grid item>
						{jobs !== null ? (
							<Typography variant='h5'>
								Production Processing for {jobs.firstJob.JobNum}{" "}
								on : {jobCrew.ResourceID}
							</Typography>
						) : (
							<Typography variant='h2'></Typography>
						)}
					</Grid>
				</Grid>
				{jobs === null ? (
					<React.Fragment>
						<Typography variant='h2'></Typography>
					</React.Fragment>
				) : (
					<React.Fragment>
						{/** fold out section for Job Info */}
						<Accordion>
							<AccordionSummary>
								<Box
									sx={{
										display: "flex",
										width: "100%",
										margin: 0,
									}}
								>
									<Typography variant='h6'>
										<Grid container>
											<Grid
												item
												xs={1}
												sx={{
													minWidth: 150,
													maxWidth: 600,
												}}
											>
												<ColumnHeaderItem>
													Resource
												</ColumnHeaderItem>
												<ColumnDataItem>
													{" "}
													{jobCrew.ResourceID}
												</ColumnDataItem>
											</Grid>
											<Grid
												item
												xs={1}
												sx={{
													minWidth: 150,
													maxWidth: 600,
												}}
											>
												<ColumnHeaderItem>
													Job
												</ColumnHeaderItem>
												<ColumnDataItem>
													{" "}
													{jobs.firstJob.JobNum}
												</ColumnDataItem>
											</Grid>
											<Grid item>
												<ColumnHeaderItem>
													Part
												</ColumnHeaderItem>
												<ColumnDataItem
													sx={{
														minWidth: 450,
														maxWidth: 600,
													}}
												>
													{jobs.firstJob.PartNum}
													{
														jobs.firstJob
															.PartDescription
													}
												</ColumnDataItem>
											</Grid>
											<Grid itemsx={1}>
												<ColumnHeaderItem>
													Qty Required
												</ColumnHeaderItem>
												<ColumnDataItem
													sx={{
														minWidth: 150,
														maxWidth: 600,
													}}
												>
													{jobs.firstJob.ProdQty}
												</ColumnDataItem>
											</Grid>
											<Grid item sx={1}>
												<ColumnHeaderItem>
													Qty Remaining
												</ColumnHeaderItem>
												<ColumnDataItem
													sx={{
														minWidth: 150,
														maxWidth: 600,
													}}
												>
													{jobs.firstJob.ProdQty -
														jobs.firstJob
															.QtyCompleted}
												</ColumnDataItem>
											</Grid>
										</Grid>
									</Typography>
								</Box>
							</AccordionSummary>
							<AccordionDetails sx={{ paddingLeft: 5 }}>
								<Grid container>
									<Grid item xs={12}>
										<Typography variant='h6'>
											Operation Details
										</Typography>
									</Grid>
									<>
										<Grid item xs={2}>
											<RowHeaderItem>
												{" "}
												Required Crew Size
											</RowHeaderItem>
										</Grid>
										<Grid item xs={10}>
											<RowDataItem>
												{jobs.firstJob.ProdCrewSize}
											</RowDataItem>
										</Grid>
									</>
									<>
										<Grid item xs={2}>
											<RowHeaderItem>
												Standard Cycle Time (pc/min)
											</RowHeaderItem>
										</Grid>
										<Grid item xs={10}>
											<RowDataItem>
												{jobs.firstJob.ProdStd.toFixed(
													2
												)}
											</RowDataItem>
										</Grid>
									</>
									<>
										<Grid item xs={2}>
											<RowHeaderItem>
												Pallet Quantity
											</RowHeaderItem>
										</Grid>
										<Grid item xs={10}>
											<RowDataItem>
												{jobs.firstJob.QtyPerPallet}
											</RowDataItem>
										</Grid>
									</>
									<>
										<Grid item xs={2}>
											<RowHeaderItem>
												Hours per Pallet
											</RowHeaderItem>
										</Grid>
										<Grid item xs={10}>
											<RowDataItem>
												{jobs.firstJob.HoursPerPalletDc.toFixed(
													3
												)}{" "}
												hrs /
												{" " +
													jobs.firstJob
														.HoursPerPalletDg}
											</RowDataItem>
										</Grid>
									</>

									<Grid item xs={6}>
										<Typography variant='h6' sx={{ mt: 2 }}>
											Current Job Details - Production
											Activity
										</Typography>
										<Table sx={{ width: "90%" }}>
											<TableBody>
												<TableRow>
													<RowHdrTableCell>
														Required Crew Size{" "}
													</RowHdrTableCell>
													<RowDataTableCell>
														{
															jobs.firstJob
																.ProdCrewSize
														}
													</RowDataTableCell>
												</TableRow>
												<TableRow>
													<RowHdrTableCell>
														Job Quantity{" "}
													</RowHdrTableCell>
													<RowDataTableCell>
														{jobs.firstJob.ProdQty}
													</RowDataTableCell>
												</TableRow>
												<TableRow>
													<RowHdrTableCell>
														No. of Pallets Required
													</RowHdrTableCell>
													<RowDataTableCell>
														{jobs.firstJob.ProdQty /
															jobs.firstJob
																.QtyPerPallet}
													</RowDataTableCell>
												</TableRow>
												<TableRow>
													<RowHdrTableCell>
														Start Date/Time{" "}
													</RowHdrTableCell>
													<RowDataTableCell>
														{jobs.firstJob.MattecStartDateTime.toLocaleString()}
													</RowDataTableCell>
												</TableRow>
												<TableRow>
													<RowHdrTableCell>
														Expected End Time{" "}
													</RowHdrTableCell>
													<RowDataTableCell>
														{jobs.firstJob.MattecEndDateTime.toLocaleString()}
													</RowDataTableCell>
												</TableRow>
												<TableRow>
													<RowHdrTableCell>
														Quantity Completed
													</RowHdrTableCell>
													<RowDataTableCell>
														{
															jobs.firstJob
																.QtyCompleted
														}
													</RowDataTableCell>
												</TableRow>
												<TableRow>
													<RowHdrTableCell>
														Standard Labour Hours
													</RowHdrTableCell>
													<RowDataTableCell>
														sdcdc{" "}
													</RowDataTableCell>
												</TableRow>
												<TableRow>
													<RowHdrTableCell>
														Actual Labour Hours
													</RowHdrTableCell>
													<RowDataTableCell>
														sdcdc{" "}
													</RowDataTableCell>
												</TableRow>
												<TableRow>
													<RowHdrTableCell>
														Total Down Time{" "}
													</RowHdrTableCell>
													<RowDataTableCell>
														sdcdc{" "}
													</RowDataTableCell>
												</TableRow>
												<TableRow>
													<RowHdrTableCell>
														Job Efficiency{" "}
													</RowHdrTableCell>
													<RowDataTableCell>
														sdcdc{" "}
													</RowDataTableCell>
												</TableRow>
												<TableRow>
													<RowHdrTableCell>
														Quantity Remaining
													</RowHdrTableCell>
													<RowDataTableCell>
														{jobs.firstJob.ProdQty -
															jobs.firstJob
																.QtyCompleted}
													</RowDataTableCell>
												</TableRow>
											</TableBody>
										</Table>
									</Grid>

									<Grid item xs={6}>
										<Typography variant='h6' sx={{ mt: 2 }}>
											Next Job Details - Setup Activity
										</Typography>
										<Table sx={{ width: "90%" }}>
											<TableBody>
												<TableRow>
													<RowHdrTableCell>
														Next Scheduled Job{" "}
													</RowHdrTableCell>
													<RowDataTableCell>
														<Link
															href={
																"/Assembly/ProductionBooking?job=" +
																jobs.nextJob
																	.JobNum +
																"&line=" +
																jobCrew.ResourceID
															}
														>
															{
																jobs.nextJob
																	.JobNum
															}
														</Link>
													</RowDataTableCell>
												</TableRow>
												<TableRow>
													<RowHdrTableCell>
														Required Crew Size{" "}
													</RowHdrTableCell>
													<RowDataTableCell>
														{
															jobs.nextJob
																.ProdCrewSize
														}
													</RowDataTableCell>
												</TableRow>
												<TableRow>
													<RowHdrTableCell>
														Previous Production
														Complete
													</RowHdrTableCell>
													<RowDataTableCell>
														aaaa
													</RowDataTableCell>
												</TableRow>
												<TableRow>
													<RowHdrTableCell>
														Setup Start Time{" "}
													</RowHdrTableCell>
													<RowDataTableCell>
														aaaa
													</RowDataTableCell>
												</TableRow>
												<TableRow>
													<RowHdrTableCell>
														Expected End Time{" "}
													</RowHdrTableCell>
													<RowDataTableCell>
														aaaa
													</RowDataTableCell>
												</TableRow>
												<TableRow>
													<RowHdrTableCell>
														Setup Remaining Minutes
													</RowHdrTableCell>
													<RowDataTableCell>
														aaaa
													</RowDataTableCell>
												</TableRow>
												<TableRow>
													<RowHdrTableCell>
														Setup Complete
													</RowHdrTableCell>
													<RowDataTableCell>
														aaaa{" "}
													</RowDataTableCell>
												</TableRow>
											</TableBody>
										</Table>
									</Grid>
								</Grid>
							</AccordionDetails>
						</Accordion>
						{/** bar of job action buttons */}
						<Grid container>
							<Grid item xs={1}>
								<Typography variant='h6' textAlign={"center"}>
									Setup
								</Typography>
								<PlayArrowIcon
									sx={{ ...iconSX }}
								></PlayArrowIcon>
							</Grid>
							<Grid
								item
								xs={1}
								textAlign={"center"}
								sx={{ justifyContent: "center" }}
							>
								<Typography variant='h6'>Complete</Typography>
								<CheckCircleOutlineIcon
									sx={{ ...iconSX }}
								></CheckCircleOutlineIcon>
							</Grid>
							<Grid
								item
								xs={1}
								textAlign={"center"}
								sx={{ justifyContent: "center" }}
							>
								<Typography variant='h6'>Incomplete</Typography>
							</Grid>
							<Grid
								item
								xs={1}
								textAlign={"center"}
								sx={{ justifyContent: "center" }}
							>
								<Typography variant='h6'>Production</Typography>
							</Grid>
							<Grid
								item
								xs={8}
								textAlign={"center"}
								sx={{ justifyContent: "right" }}
							>
								<Typography variant='h6'>Book Qty</Typography>
								<PostAddIcon sx={{ ...iconSX }}></PostAddIcon>
							</Grid>
						</Grid>

						{/**employees and currest pallet status */}
						<Grid container>
							{/**employee grid */}
							<Grid item xs={8}>
								<Typography variant='h6' textAlign={"center"}>
									Employees
								</Typography>

								<Grid container>
									{" "}
									<DragDropContext
										onDragEnd={handleOnDragEnd}
									>
										{/** assigned employees */}
										<Grid item xs={3}>
											<Grid container>
												<Box
													display={"flex"}
													flexDirection={"row"}
													maxHeight={"80vh"}
												>
													<Lane>
														<Typography
															variant='body1'
															sx={{
																color: grey[900],
																minHeight: 60,
																paddingLeft: 2,
																paddingRight: 2,
																backgroundColor:
																	"darkgrey",
															}}
														>
															Available Employees
														</Typography>
														{/** //TODO  filter by cell && active labour */}

														<Droppable
															droppableId={
																"available"
															}
														>
															{(
																provided,
																snapshot
															) => (
																<List
																	ref={
																		provided.innerRef
																	}
																	{...provided.droppableProps}
																	style={{
																		...provided
																			.droppableProps
																			.style,
																		backgroundColor:
																			snapshot.isDraggingOver
																				? "lightblue"
																				: "lightgrey",
																		//height: "100%",
																		minHeight:
																			"70vh",
																		maxHeight:
																			"70vh",
																		overflow:
																			"auto",
																	}}
																>
																	{
																		// datasets.employees
																		//   .filter(
																		//     (e) =>
																		//       e.cell === jobCrew.Cell_c &&
																		//       datasets.activelabour.filter(
																		//         (ee) => e.id === ee.EmployeeNum
																		//       ).length === 0
																		//   )
																		employeeColumns.available.items.map(
																			(
																				e,
																				index
																			) => (
																				<Draggable
																					key={
																						e.EmpID
																					}
																					draggableId={
																						e.EmpID
																					}
																					index={
																						index
																					}
																				>
																					{(
																						provided,
																						snapshot
																					) => (
																						<ListItem
																							{...provided.dragHandleProps}
																							{...provided.draggableProps}
																							ref={
																								provided.innerRef
																							}
																							style={{
																								...provided
																									.draggableProps
																									.style,
																								backgroundColor:
																									snapshot.isDragging
																										? "darkgrey"
																										: sistTheme
																												.palette
																												.sistema
																												.freshworks
																												.main,
																								// : isclockedin(e)
																								// ? sistTheme.palette.sistema
																								//     .freshworks.main
																								// : sistTheme.palette.sistema
																								//     .microwave.main,
																								padding: 0,
																								// paddingLeft: 5,
																							}}
																						>
																							<ListItemAvatar>
																								<Avatar
																									sx={{
																										margin: 0,
																										marginTop: 1,
																									}}
																								>
																									<PersonAddAlt1Icon />
																								</Avatar>
																							</ListItemAvatar>
																							<ListItemText
																								primary={
																									e.FirstName
																								}
																								secondary={
																									<React.Fragment>
																										<Typography
																											sx={{
																												display:
																													"inline",
																											}}
																											component='span'
																											variant='body2'
																											color='lightblue'
																										>
																											{
																												e.EmpID
																											}
																										</Typography>
																									</React.Fragment>
																								}
																							/>
																						</ListItem>
																					)}
																				</Draggable>
																			)
																		)
																	}
																	{
																		provided.placeholder
																	}
																</List>
															)}
														</Droppable>
													</Lane>
												</Box>
											</Grid>
										</Grid>
										<Grid
											item
											xs={1}
											sx={{
												display: "flex",
												flexDirection: "column",
												justifyContent: "center",
											}}
										>
											<Box
												sx={{
													height: "40%",
													display: "flex",
													flexDirection: "column",
													justifyContent:
														"space-evenly",
												}}
											>
												<Tooltip
													title='Clockout All Employees'
													arrow
												>
													<ArrowCircleLeftOutlinedIcon
														sx={{ ...iconSX }}
													></ArrowCircleLeftOutlinedIcon>
												</Tooltip>
											</Box>
										</Grid>
										{/**clocked in employees */}
										<Grid item xs={3}>
											<Box
												display={"flex"}
												flexDirection={"row"}
												maxHeight={"80vh"}
											>
												<Lane>
													<Typography
														variant='body1'
														sx={{
															color: grey[900],
															minHeight: 60,
															paddingLeft: 2,
															paddingRight: 2,
															backgroundColor:
																"darkgrey",
														}}
													>
														Clocked In Employees
													</Typography>

													<Droppable droppableId='clockedin'>
														{(
															provided,
															snapshot
														) => (
															<List
																ref={
																	provided.innerRef
																}
																{...provided.droppableProps}
																style={{
																	...provided
																		.droppableProps
																		.style,
																	backgroundColor:
																		snapshot.isDraggingOver
																			? "lightblue"
																			: "lightgrey",
																	//height: "100%",
																	minHeight:
																		"70vh",
																	maxHeight:
																		"70vh",
																	overflow:
																		"auto",
																}}
															>
																{
																	// datasets.activelabour
																	//   .filter(
																	//     (l) =>
																	//       l.ResourceID === jobCrew.ResourceID &&
																	//       datasets.onbreak.filter(
																	//         (ob) => l.EmployeeNum === ob.id
																	//       ).length < 1
																	//   )
																	employeeColumns.clockedin.items.map(
																		(
																			e,
																			index
																		) => (
																			<Draggable
																				key={
																					e.EmployeeNum
																				}
																				draggableId={
																					e.EmployeeNum
																				}
																				index={
																					index
																				}
																			>
																				{(
																					provided,
																					snapshot
																				) => (
																					<ListItem
																						{...provided.dragHandleProps}
																						{...provided.draggableProps}
																						ref={
																							provided.innerRef
																						}
																						style={{
																							...provided
																								.draggableProps
																								.style,
																							backgroundColor:
																								snapshot.isDragging
																									? "darkgrey"
																									: sistTheme
																											.palette
																											.sistema
																											.freshworks
																											.main,
																							// : isclockedin(e)
																							// ? sistTheme.palette.sistema
																							//     .freshworks.main
																							// : sistTheme.palette.sistema
																							//     .microwave.main,
																							padding: 0,
																							// paddingLeft: 5,
																						}}
																					>
																						<ListItemAvatar>
																							<Avatar
																								sx={{
																									margin: 0,
																									marginTop: 1,
																								}}
																							>
																								<PersonAddAlt1Icon />
																							</Avatar>
																						</ListItemAvatar>
																						<ListItemText
																							primary={
																								e.Name
																							}
																							secondary={
																								<React.Fragment>
																									<Typography
																										sx={{
																											display:
																												"inline",
																										}}
																										component='span'
																										variant='body2'
																										color='lightblue'
																									>
																										{
																											e.EmployeeNum
																										}
																									</Typography>
																								</React.Fragment>
																							}
																						/>
																					</ListItem>
																				)}
																			</Draggable>
																		)
																	)
																}
																{
																	provided.placeholder
																}
															</List>
														)}
													</Droppable>
												</Lane>
											</Box>

											{/**ResourceID */}
										</Grid>
										<Grid
											item
											xs={1}
											sx={{
												display: "flex",
												flexDirection: "column",
												justifyContent: "center",
											}}
										>
											<Box
												sx={{
													height: "40%",
													display: "flex",
													flexDirection: "column",
													justifyContent:
														"space-evenly",
												}}
											>
												<Tooltip
													title='Move Employees to Break'
													arrow
												>
													<ArrowCircleRightOutlinedIcon
														sx={{ ...iconSX }}
														onClick={() =>
															handleMoveToBreakEnMasse()
														}
													></ArrowCircleRightOutlinedIcon>
												</Tooltip>
												<Tooltip
													title='return Employees From Break'
													arrow
												>
													<ArrowCircleLeftOutlinedIcon
														sx={{ ...iconSX }}
														onClick={() =>
															handleReturnFromBreakEnMasse()
														}
													></ArrowCircleLeftOutlinedIcon>
												</Tooltip>
											</Box>
										</Grid>
										{/**On Break employees */}
										<Grid item xs={3}>
											<Box
												display={"flex"}
												flexDirection={"row"}
												maxHeight={"80vh"}
											>
												<Lane>
													<Typography
														variant='body1'
														sx={{
															color: grey[900],
															minHeight: 60,
															paddingLeft: 2,
															paddingRight: 2,
															backgroundColor:
																"darkgrey",
														}}
													>
														Employees On Break
													</Typography>

													<Droppable
														droppableId={"onbreak"}
													>
														{(
															provided,
															snapshot
														) => (
															<List
																ref={
																	provided.innerRef
																}
																{...provided.droppableProps}
																style={{
																	...provided
																		.droppableProps
																		.style,
																	backgroundColor:
																		snapshot.isDraggingOver
																			? "lightblue"
																			: "lightgrey",
																	//height: "100%",
																	minHeight:
																		"70vh",
																	maxHeight:
																		"70vh",
																	overflow:
																		"auto",
																}}
															>
																{datasets.onbreak.map(
																	(
																		e,
																		index
																	) => (
																		<Draggable
																			key={
																				e.id
																			}
																			draggableId={
																				e.id
																			}
																			index={
																				index
																			}
																		>
																			{(
																				provided,
																				snapshot
																			) => (
																				<ListItem
																					{...provided.dragHandleProps}
																					{...provided.draggableProps}
																					ref={
																						provided.innerRef
																					}
																					style={{
																						...provided
																							.draggableProps
																							.style,
																						backgroundColor:
																							snapshot.isDragging
																								? "darkgrey"
																								: amber[600],
																						// : isclockedin(e)
																						// ? sistTheme.palette.sistema
																						//     .freshworks.main
																						// : sistTheme.palette.sistema
																						//     .microwave.main,
																						padding: 0,
																						// paddingLeft: 5,
																					}}
																				>
																					<ListItemAvatar>
																						<Avatar
																							sx={{
																								margin: 0,
																								marginTop: 1,
																							}}
																						>
																							<PersonAddAlt1Icon />
																						</Avatar>
																					</ListItemAvatar>
																					<ListItemText
																						primary={
																							e.name
																						}
																						secondary={
																							<React.Fragment>
																								<Typography
																									sx={{
																										display:
																											"inline",
																									}}
																									component='span'
																									variant='body2'
																									color='lightblue'
																								>
																									{
																										e.id
																									}
																								</Typography>
																							</React.Fragment>
																						}
																					/>
																				</ListItem>
																			)}
																		</Draggable>
																	)
																)}
																{
																	provided.placeholder
																}
															</List>
														)}
													</Droppable>
												</Lane>
											</Box>
										</Grid>
									</DragDropContext>{" "}
								</Grid>
							</Grid>
							{/** pallet grid */}
							<Grid item xs={4}>
								<Typography variant='h6'>
									Pallet status
								</Typography>

								<Table>
									<TableBody>
										<TableRow>
											<TableCell>Time Started</TableCell>
											<TableCell>01</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</Grid>
						</Grid>
					</React.Fragment>
				)}
			</Box>

			<Dialog open={!isLoggedIn}>
				<Grid container>
					<Grid item xs={12}>
						<DialogTitle>Please log in</DialogTitle>
					</Grid>
					<Grid item xs={6} sx={{ paddingTop: 2 }}>
						<FormControl>
							<FormControlLabel
								sx={{
									backgroundColor: "transparent",
									"& .MuiFilledInput-input": {
										color: sistTheme.palette.sistema.klipit
											.main,
									},
								}}
								control={
									<TextField
										error={lineErr}
										id='outlined-error'
										defaultValue=''
										variant='filled'
										helperText='Line Number'
										onChange={handleLineChange}
									></TextField>
								}
							/>
						</FormControl>
					</Grid>

					<Grid item xs={8}></Grid>
					<Grid item xs={2}>
						<Button onClick={() => setIsLoggedIn(true)}>
							Cancel
						</Button>
					</Grid>
					<Grid item xs={2}>
						<Button
							disabled={lineErr}
							onClick={() => handleLogIn(null)}
						>
							Continue
						</Button>
					</Grid>
				</Grid>
			</Dialog>
		</React.Fragment>
	);
}
