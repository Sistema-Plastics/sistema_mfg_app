<DragDropContext onDragEnd={handleOnDragEnd}>
	{/** assigned employees */}
	<Grid item xs={3}>
		<Grid container>
			<Box display={"flex"} flexDirection={"row"} maxHeight={"80vh"}>
				<Lane>
					<Typography
						variant='body1'
						sx={{
							color: grey[900],
							minHeight: 60,
							paddingLeft: 2,
							paddingRight: 2,
							backgroundColor: "darkgrey",
						}}
					>
						Available Employees
					</Typography>
					{/** //TODO  filter by cell && active labour */}

					<Droppable droppableId={"available"}>
						{(provided, snapshot) => (
							<List
								ref={provided.innerRef}
								{...provided.droppableProps}
								style={{
									...provided.droppableProps.style,
									backgroundColor: snapshot.isDraggingOver
										? "lightblue"
										: "lightgrey",
									//height: "100%",
									minHeight: "70vh",
									maxHeight: "70vh",
									overflow: "auto",
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
										(e, index) => (
											<Draggable
												key={e.EmpID}
												draggableId={e.EmpID}
												index={index}
											>
												{(provided, snapshot) => (
													<ListItem
														{...provided.dragHandleProps}
														{...provided.draggableProps}
														ref={provided.innerRef}
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
								{provided.placeholder}
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
				justifyContent: "space-evenly",
			}}
		>
			<Tooltip title='Clockout All Employees' arrow>
				<ArrowCircleLeftOutlinedIcon
					sx={{ ...iconSX }}
				></ArrowCircleLeftOutlinedIcon>
			</Tooltip>
		</Box>
	</Grid>
	{/**clocked in employees */}
	<Grid item xs={3}>
		<Box display={"flex"} flexDirection={"row"} maxHeight={"80vh"}>
			<Lane>
				<Typography
					variant='body1'
					sx={{
						color: grey[900],
						minHeight: 60,
						paddingLeft: 2,
						paddingRight: 2,
						backgroundColor: "darkgrey",
					}}
				>
					Clocked In Employees
				</Typography>

				<Droppable droppableId='clockedin'>
					{(provided, snapshot) => (
						<List
							ref={provided.innerRef}
							{...provided.droppableProps}
							style={{
								...provided.droppableProps.style,
								backgroundColor: snapshot.isDraggingOver
									? "lightblue"
									: "lightgrey",
								//height: "100%",
								minHeight: "70vh",
								maxHeight: "70vh",
								overflow: "auto",
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
									(e, index) => (
										<Draggable
											key={e.EmployeeNum}
											draggableId={e.EmployeeNum}
											index={index}
										>
											{(provided, snapshot) => (
												<ListItem
													{...provided.dragHandleProps}
													{...provided.draggableProps}
													ref={provided.innerRef}
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
														primary={e.Name}
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
							{provided.placeholder}
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
				justifyContent: "space-evenly",
			}}
		>
			<Tooltip title='Move Employees to Break' arrow>
				<ArrowCircleRightOutlinedIcon
					sx={{ ...iconSX }}
					onClick={() => handleMoveToBreakEnMasse()}
				></ArrowCircleRightOutlinedIcon>
			</Tooltip>
			<Tooltip title='return Employees From Break' arrow>
				<ArrowCircleLeftOutlinedIcon
					sx={{ ...iconSX }}
					onClick={() => handleReturnFromBreakEnMasse()}
				></ArrowCircleLeftOutlinedIcon>
			</Tooltip>
		</Box>
	</Grid>
	{/**On Break employees */}
	<Grid item xs={3}>
		<Box display={"flex"} flexDirection={"row"} maxHeight={"80vh"}>
			<Lane>
				<Typography
					variant='body1'
					sx={{
						color: grey[900],
						minHeight: 60,
						paddingLeft: 2,
						paddingRight: 2,
						backgroundColor: "darkgrey",
					}}
				>
					Employees On Break
				</Typography>

				<Droppable droppableId={"onbreak"}>
					{(provided, snapshot) => (
						<List
							ref={provided.innerRef}
							{...provided.droppableProps}
							style={{
								...provided.droppableProps.style,
								backgroundColor: snapshot.isDraggingOver
									? "lightblue"
									: "lightgrey",
								//height: "100%",
								minHeight: "70vh",
								maxHeight: "70vh",
								overflow: "auto",
							}}
						>
							{datasets.onbreak.map((e, index) => (
								<Draggable
									key={e.id}
									draggableId={e.id}
									index={index}
								>
									{(provided, snapshot) => (
										<ListItem
											{...provided.dragHandleProps}
											{...provided.draggableProps}
											ref={provided.innerRef}
											style={{
												...provided.draggableProps
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
												primary={e.name}
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
															{e.id}
														</Typography>
													</React.Fragment>
												}
											/>
										</ListItem>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</List>
					)}
				</Droppable>
			</Lane>
		</Box>
	</Grid>
</DragDropContext>;
