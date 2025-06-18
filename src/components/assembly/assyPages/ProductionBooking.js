//This is the page where Drag and drop of employees are saved to Cell_c
import React, { useEffect, useMemo, useRef, useContext, useState } from "react";
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
import { HomeRepairServiceSharp, Publish } from "@mui/icons-material";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import KeyboardReturnOutlinedIcon from "@mui/icons-material/KeyboardReturnOutlined";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { DataGrid } from "@mui/x-data-grid";

//import Typography from '@mui/material/Typography';

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { baseURL, connections } from "../../../config/ConnectionBroker";
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
	color: sistColours["klipit-Light"],
};

export default function ProductionBooking() {
	const sistemaContext = useContext(SistemaContext);
	const [isLoggedIn, setIsLoggedIn] = useState(false); //setting to true avoids teh flkashing of the dialog wehn initially rendering. Set to False after datasets populated
	const [client, setClient] = useState(null);
	const [isConnected, setIsConnected] = useState(false);
	const [dataComplete, setDataComplete] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();

	const [jobSummary, setJobSummary] = useState(null);
	const [lineErr, setLineErr] = useState(true);
	const [jobs, setJobs] = useState(null);
	const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

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
		crewavailable: [],
		crewclockedin: [],
		crewonbreak: [],
	});

	const [selectedEmpIDs, setSelectedEmpIDs] = useState([]);
	const [readyState, setReadyState] = useState({
		crewavailable: false,
		crewclockedin: false,
		crewonbreak: false,
		employees: false,
		assycrewsize: false,
	});

	// //now add bse topic as prefx
	const baseTopic = connections.getBaseMQTTTopicFromPort();
	let topics = [
		"systemdata/dashboards/epicor/employeeslist",
		"systemdata/dashboards/epicor/activelabour",
		"systemdata/dashboards/epicor/cells",
		"systemdata/dashboards/epicor/assycrewsize",
		"systemdata/dashboards/epicor/jobsallops",
		`+/${resourceID.toLowerCase()}/crew/clockedin`,
		`+/${resourceID.toLowerCase()}/crew/onbreak`,
		`+/${resourceID.toLowerCase()}/crew/available`,
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
			let hasChanged = false;
			if (topic.includes("systemdata")) {
				const msg = JSON.parse(message.toString()).value;
				switch (true) {
					case topic.includes("employeeslist"):
						hasChanged = hasUpdates(datasets.employees, msg);
						setReadyState((prevState) => ({
							...prevState,
							employees: true,
						}));
						if (hasChanged) {
							setDatasets((prevState) => {
								return {
									...prevState,
									employees: msg,
								};
							});
						}
						break;
					case topic.includes("activelabour"):
						setDatasets((prevState) => {
							if (!hasUpdates(prevState.activelabour, msg))
								return prevState;

							return {
								...prevState,
								activelabour: msg,
							};
						});
						break;
					case topic.includes("assycrewsize"):
						hasChanged = hasUpdates(datasets.assycrewsize, msg);
						setReadyState((prevState) => ({
							...prevState,
							assycrewsize: true,
						}));
						setDatasets((prevState) => {
							if (!hasUpdates(prevState.assycrewsize, msg))
								return prevState;

							return {
								...prevState,
								assycrewsize: msg,
							};
						});
						break;
					case topic.includes("jobsallops"):
						setDatasets((prevState) => {
							if (!hasUpdates(prevState.jobs, msg))
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
						hasChanged = hasUpdates(datasets.cells, msg);
						if (hasChanged) {
							setDatasets((prevState) => {
								return {
									...prevState,
									cells: msg,
								};
							});
						}
						break;
					default:
						break;
				}
			} else {
				const msg = JSON.parse(message.toString());
				switch (true) {
					case topic.includes(`crew/available`):
						// print(topic, message);
						hasChanged = hasUpdates(datasets.crewavailable, msg);

						setReadyState((prevState) => ({
							...prevState,
							crewavailable: true,
						}));

						if (hasChanged) {
							setDatasets((prevState) => ({
								...prevState,
								crewavailable: msg,
							}));
						}
						break;
					case topic.includes(`crew/clockedin`):
						// Uncomment the next line to print the topic and message for debugging
						// print(topic, message);

						// Check if there are updates in the crewclockedin dataset
						hasChanged = hasUpdates(datasets.crewclockedin, msg);

						// Determine if the message has been processed by checking for the presence of "EmpID" in any element
						const processed = !msg.some((e) =>
							e.hasOwnProperty("EmpID")
						);

						// Update the ready state to indicate that the crewclockedin data is ready
						setReadyState((prevState) => ({
							...prevState,
							crewclockedin: true,
						}));

						// If there are changes and the message has been processed, update the crewclockedin dataset
						if (hasChanged && processed) {
							setDatasets((prevState) => ({
								...prevState,
								crewclockedin: msg,
							}));
						}
						break;
					case topic.includes(`crew/onbreak`):
						print(topic, message);
						hasChanged = hasUpdates(datasets.crewonbreak, msg);

						setReadyState((prevState) => ({
							...prevState,
							crewonbreak: true,
						}));

						if (hasChanged) {
							setDatasets((prevState) => ({
								...prevState,
								crewonbreak: msg,
							}));
						}
						break;
					default:
				}
			}
		});
	}, [client]);

	const allReady = useMemo(
		() => Object.values(readyState).every(Boolean),
		[readyState]
	);

	useEffect(() => {
		if (isConnected && client) {
			console.log("MQTT is connected. Subscribing to topics...");

			topics.forEach((topic) => {
				console.log("Subscribing to:", topic); // ✅ Helpful for debugging
				client.subscribe(topic, (err) => {
					if (err) {
						console.error(
							`❌ Failed to subscribe to topic: ${topic}`,
							err
						);
					} else {
						console.log(
							`✅ Successfully subscribed to topic: ${topic}`
						);
					}
				});
			});
		}
	}, [isConnected]);

	useEffect(() => {
		if (!isConnected) return;

		const timeouts = [];

		const topicKeys = ["crewclockedin", "crewonbreak", "crewavailable"];

		topicKeys.forEach((key) => {
			if (!readyState[key]) {
				const timeout = setTimeout(() => {
					console.warn(
						`⚠️ No MQTT message received for ${key}. Setting as empty.`
					);
					setReadyState((prev) => ({ ...prev, [key]: true }));
					setDatasets((prev) => ({ ...prev, [key]: [] }));
				}, 2000);
				timeouts.push(timeout);
			}
		});

		return () => {
			timeouts.forEach(clearTimeout);
		};
	}, [
		isConnected,
		readyState.crewclockedin,
		readyState.crewonbreak,
		readyState.crewavailable,
	]);

	useEffect(() => {
		const { assycrewsize, jobs } = datasets;
		//console.log("[datasets.assycrewsize, resourceID]");
		if (!assycrewsize || !jobs || !resourceID) return;

		let jobSum = assycrewsize.find(
			(a) => a.ResourceID.toUpperCase() === resourceID
		);

		if (!jobSum) {
			console.warn(`Resource ${resourceID} not in assycrewsize`);
			return;
		}

		if (jobSum.ResourceGrpID === "") {
			console.warn(
				`Resource ${resourceID} does not have a Resource Group`
			);
			return;
		}
		const jb = jobs?.find(
			(jb) =>
				jb.JobNum === jobSum.JobNum &&
				jb.OprSeq === jobSum.OprSeq &&
				jb.AssemblySeq === jobSum.AssemblySeq
		);
		if (jb) {
			jobSum.OpCode = jb.OpCode ?? "";
			jobSum.OpDesc = jb.OpDesc ?? "";
			jobSum.JCDeptDescription = jb.JCDeptDesc ?? "";
			jobSum.OpCodeOpDesc = jb.OpCodeOpDesc ?? "";
			jobSum.Company = jb.Company ?? "";
		}
		if (hasUpdates(jobSum, jobSummary)) {
			setJobSummary(jobSum);
			handleLogIn(resourceID);
		}
		setDataComplete(true);
		setIsLoggedIn(true);
	}, [datasets.assycrewsize, datasets.jobs, resourceID]);

	//TODO DONE useEffect[jobSummary, allReady]
	useEffect(() => {
		if (!allReady || !jobSummary) return;

		const { activelabour, employees, crewonbreak } = datasets;

		const crewClockedIn = activelabour.filter(
			(e) =>
				e.JobNum === jobSummary.JobNum &&
				e.ResourceID === jobSummary.ResourceID
		);

		let crewAvailable = employees.filter(
			(e) =>
				e.ResourceGrpID === jobSummary.ResourceGrpID &&
				e.EmpStatus === "A" &&
				!isNaN(parseInt(e.EmpID))
		);

		const assignedCrew = new Set([
			...(crewClockedIn ?? []).map((e) => e.EmployeeNum),
			...(crewonbreak ?? []).map((e) => e.EmpID),
		]);

		crewAvailable = crewAvailable.filter((e) => !assignedCrew.has(e.EmpID));

		if (
			hasUpdates(
				stripRowIdent(crewAvailable),
				stripRowIdent(datasets.crewavailable)
			)
		) {
			setDatasets((prev) => ({
				...prev,
				crewavailable: crewAvailable,
			}));

			const topic = `${baseTopic}${jobSummary.ResourceGrpID.toLowerCase()}/${jobSummary.ResourceID.toLowerCase()}/crew/available`;
			publishMQTT(topic, JSON.stringify(crewAvailable));
		}

		if (
			hasUpdates(
				stripRowIdent(crewClockedIn),
				stripRowIdent(datasets.crewclockedin)
			)
		) {
			setDatasets((prev) => ({
				...prev,
				crewclockedin: crewClockedIn,
			}));

			const topic = `${baseTopic}${jobSummary.ResourceGrpID.toLowerCase()}/${jobSummary.ResourceID.toLowerCase()}/crew/clockedin`;
			publishMQTT(topic, JSON.stringify(crewClockedIn));
		}

		setEmployeeColumns((prev) => ({
			...prev,
			clockedin: {
				...prev.clockedin,
				items: crewClockedIn,
			},
			onbreak: {
				...prev.onbreak,
				items: datasets.crewonbreak,
			},
			available: {
				...prev.available,
				items: crewAvailable,
			},
		}));
	}, [
		datasets.activelabour,
		datasets.employees,
		datasets.crewavailable,
		datasets.crewclockedin,
		datasets.crewonbreak,
		jobSummary,
		allReady,
	]);

	function stripRowIdent(arr) {
		if (!arr || !Array.isArray(arr)) return [];
		return arr.map(({ RowIdent, ...rest }) => rest);
	}

	const hasUpdates = (a, b) => JSON.stringify(a) !== JSON.stringify(b);
	const print = (topic, message) =>
		console.log(
			`${topic} \n ${JSON.stringify(JSON.parse(message.toString()))} `
		);

	//TODO RS Original Code
	const handleLogIn = (resource) => {
		setIsLoggedIn(true);
		//get current job and filter jobs for current resource
		//if no login line is passed we get it from the state

		if (resource === null) resource = jobSummary.ResourceID;

		let v = datasets?.jobs?.filter(
			(j) => j.ResourceID.toUpperCase() === resource
		);

		//if we have jobs returned, get earliest
		if (v?.length > 0) {
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
		}
	};

	const handleLineChange = (event) => {
		const val = event.target.value.toUpperCase();

		const lines = new Set(
			datasets.jobs.map((j) => j.ResourceID.toUpperCase())
		);
		if (lines.has(val)) {
			setJobSummary(
				datasets.assycrewsize.filter((a) => a.ResourceID === val)[0]
			);
			setLineErr(false);
		} else {
			setLineErr(true);
		}
	};

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
		//const qos = 0;
		//const retain = true;

		client.publish(
			topic.toLowerCase(),
			payload,
			{
				qos: 0,
				retain: true,
			},
			(error) => {
				if (error) {
					console.log("Publish error: ", error);
				}
			}
		);
	};

	const getKey = (droppableId) =>
		droppableId === "clockedin" ? "EmployeeNum" : "EmpID";

	const handleClick = (e, id) => {
		if (e.ctrlKey || e.metaKey) {
			setSelectedEmpIDs((prev) =>
				prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
			);
		} else {
			setSelectedEmpIDs([id]);
		}
	};

	const handleOnDragEnd = (result) => {
		if (!result.destination) return;

		const { source, destination, draggableId } = result;
		const from = source.droppableId;
		const to = destination.droppableId;

		if (from === to) return;
		if (!validMoves[from]?.includes(to)) return;

		moveSelectedItems(from, to, draggableId);
	};

	const moveSelectedItems = (from, to, fallbackID) => {
		const fromItems = Array.from(datasets[`crew${from}`] || []);
		const toItems = Array.from(datasets[`crew${to}`] || []);

		const fromIdKey = getKey(from);

		const idsToMove =
			selectedEmpIDs.length > 0 ? selectedEmpIDs : [fallbackID];

		const itemsToMove =
			fromItems.filter((item) =>
				idsToMove.includes(String(item[fromIdKey]))
			) || [];
		if (itemsToMove.length === 0) return;
		const remainingFromItems =
			fromItems.filter(
				(item) => !idsToMove.includes(String(item[fromIdKey]))
			) || [];

		const newToItems = [...toItems, ...itemsToMove] || [];

		setDatasets((prev) => ({
			...prev,
			[`crew${from}`]: remainingFromItems,
			[`crew${to}`]: newToItems,
		}));

		if (to === "clockedin") {
			const topic = `${baseTopic}${jobSummary.ResourceGrpID.toLowerCase()}/${jobSummary.ResourceID.toLowerCase()}/crew/clockedin`;
			if (
				hasUpdates(
					stripRowIdent(newToItems),
					stripRowIdent(datasets.crewclockedin)
				)
			) {
				publishMQTT(topic, JSON.stringify(newToItems));
			}
		} else if (from === "clockedin") {
			const topic = `${baseTopic}${jobSummary.ResourceGrpID.toLowerCase()}/${jobSummary.ResourceID.toLowerCase()}/crew/clockedin`;
			if (
				hasUpdates(
					stripRowIdent(remainingFromItems),
					stripRowIdent(datasets.crewclockedin)
				)
			) {
				publishMQTT(topic, JSON.stringify(remainingFromItems));
			}
		}

		if (to === "onbreak") {
			const topic = `${baseTopic}${jobSummary.ResourceGrpID.toLowerCase()}/${jobSummary.ResourceID.toLowerCase()}/crew/onbreak`;
			if (
				hasUpdates(
					stripRowIdent(newToItems),
					stripRowIdent(datasets.crewonbreak)
				)
			) {
				publishMQTT(topic, JSON.stringify(newToItems));
			}
		} else if (from === "onbreak") {
			const topic = `${baseTopic}${jobSummary.ResourceGrpID.toLowerCase()}/${jobSummary.ResourceID.toLowerCase()}/crew/onbreak`;
			if (
				hasUpdates(
					stripRowIdent(remainingFromItems),
					stripRowIdent(datasets.crewonbreak)
				)
			) {
				publishMQTT(topic, JSON.stringify(remainingFromItems));
			}
		}
		setSelectedEmpIDs([]);
	};

	const moveAllItems = (from, to) => {
		const fromItems = Array.from(datasets[`crew${from}`] || []);
		if (fromItems.length === 0) return;

		const toItems = Array.from(datasets[`crew${to}`] || []);
		const newToItems = [...toItems, ...fromItems];

		setDatasets((prev) => ({
			...prev,
			[`crew${from}`]: [],
			[`crew${to}`]: newToItems,
		}));

		setSelectedEmpIDs([]);
	};

	const validMoves = {
		available: ["clockedin"],
		clockedin: ["available", "onbreak"],
		onbreak: ["clockedin"],
	};
	const laneColours = {
		available: sistColours["klipit-Light"],
		clockedin: "green",
		onbreak: "orange",
	};

	const getKeyForLane = (lane) =>
		lane === "clockedin" ? "EmployeeNum" : "EmpID";

	const renderDroppable = (id, items) => {
		const key = getKeyForLane(id);
		const allowedTargets = validMoves[id] || [];
		const laneColour = laneColours[id] || "#e0f7fa";
		const droppableLabels = {
			available: "Available",
			clockedin: "Clocked In",
			onbreak: "On Break",
		};

		return (
			<div
				style={{
					width: 250,
					display: "flex",
					flexDirection: "column",
					border: "1px solid lightgrey",
					borderRadius: 4,
				}}
			>
				<div
					style={{
						color: "#212121",
						minHeight: 60,
						padding: "0.5rem 1rem",
						backgroundColor: "darkgrey",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						fontSize: "1.5rem",
						fontWeight: 600,
						fontFamily: "inherit",
					}}
				>
					{droppableLabels[id]}
					<div style={{ display: "flex", gap: "0.5rem" }}>
						{allowedTargets.map((target) => (
							<button
								key={target}
								onClick={() => moveAllItems(id, target)}
							>
								→ {target}
							</button>
						))}
					</div>
				</div>

				<Droppable droppableId={id}>
					{(provided, snapshot) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							style={{
								...provided.droppableProps.style,
								backgroundColor: snapshot.isDraggingOver
									? "lightblue"
									: "lightgrey",
								minHeight: "70vh",
								maxHeight: "70vh",
								overflow: "auto",
								padding: "0.5rem",
								flexGrow: 1,
							}}
						>
							{items.map((item, index) => (
								<Draggable
									key={item[key]}
									draggableId={String(item[key])}
									index={index}
								>
									{(provided, snapshot) => {
										const isSelected =
											selectedEmpIDs.includes(item[key]);
										return (
											<ListItem
												{...provided.dragHandleProps}
												{...provided.draggableProps}
												ref={provided.innerRef}
												onClick={(e) =>
													handleClick(e, item[key])
												}
												style={{
													...provided.draggableProps
														.style,
													backgroundColor: laneColour,
													padding: "0.5rem 1rem",
													border: "1px solid #ccc",
													borderRadius: 4,
													cursor: "pointer",
													userSelect: "none",
													// Remove position: "relative",
													zIndex: snapshot.isDragging
														? 1000
														: "auto",
													boxShadow:
														snapshot.isDragging
															? "0 4px 8px rgba(0, 0, 0, 0.2)"
															: "none",
													opacity:
														isSelected &&
														!snapshot.isDragging
															? 0.5
															: 1,
												}}
											>
												{item.Name} ({item[key]})
												{snapshot.isDragging &&
													selectedEmpIDs.length >
														1 && (
														<span
															style={{
																position:
																	"absolute",
																top: 0,
																right: 4,
																background:
																	"red",
																color: "white",
																fontSize:
																	"0.75rem",
																fontWeight:
																	"bold",
																borderRadius:
																	"999px",
																padding:
																	"0.15rem 0.5rem",
															}}
														>
															+
															{
																selectedEmpIDs.length
															}
														</span>
													)}
											</ListItem>
										);
									}}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</div>
		);
	};

	if (!resourceID) {
		return displayError(
			"Resource is not specified in the URL. Please contact IT for assistance."
		);
	}
	/* TODO RS return displayJobSummary()
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
								on : {jobSummary.ResourceID}
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
													{jobSummary.ResourceID}
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
																jobSummary.ResourceID
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
						{/* RS 20250526 DISABLING OLD LANE CODE */}
						{/**employees and currest pallet status */}
						<Grid container>
							{/**employee grid */}
							<Grid item xs={8}>
								<Typography variant='h6' textAlign={"center"}>
									Employees
								</Typography>
								<DragDropContext onDragEnd={handleOnDragEnd}>
									<div
										style={{ display: "flex", gap: "2rem" }}
									>
										{renderDroppable(
											"available",
											datasets.crewavailable
										)}
										{renderDroppable(
											"clockedin",
											datasets.crewclockedin
										)}
										{renderDroppable(
											"onbreak",
											datasets.crewonbreak
										)}
									</div>
								</DragDropContext>
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
