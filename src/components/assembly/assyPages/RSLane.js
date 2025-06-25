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
