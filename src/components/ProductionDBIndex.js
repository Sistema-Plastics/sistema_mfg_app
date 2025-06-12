import { SistemaContext } from "../assets/components/SistemaHeader";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

//TODO: remove  import Typography from "@mui/material/Typography"

import FactoryIcon from "@mui/icons-material/Factory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import HighQualityIcon from "@mui/icons-material/HighQuality";
import HandymanIcon from "@mui/icons-material/Handyman";

import { styled } from "@mui/material/styles";
import { muiThemes } from "../assets/styling/muiThemes";
import { tableCellClasses } from "@mui/material/TableCell";
import { Typography } from "@mui/material";

// https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette.info
// https://mui.com/material-ui/customization/color/#2014-material-design-color-palettes

const sistTheme = muiThemes.getSistemaTheme();

const BlankLink = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    color: sistTheme.palette.sistema.klipit.main,
    "&:visited": { color: sistTheme.palette.sistema.klipit.main }
}));

const MyPaper = styled(Paper)(({ theme }) => ({
    margin: 5, flexGrow: 1, padding: 5
    // backgroundColor:'red'
}))

const GridContainer = styled(Grid)(({ theme }) => ({
    // backgroundColor:'yellow'
    alignItems: 'stretch', display: 'flex'
}))
const GridItem = styled(Grid)(({ theme }) => ({
    // backgroundColor:'green', 
    // width :'100%', height:'100%',
    flexGrow: 1
}))
const HeadrTypography = styled(Typography)(({ theme }) => ({
    variant: 'h4'
}))
const LinkTypography = styled(Typography)(({ theme }) => ({
    variant: 'h6'
}))

export default function Index() {
    //==========================================================
    // Initialize data for Sistema Toolbar and Filtering options
    //==========================================================

    const sistemaContext = useContext(SistemaContext);
    useEffect(() => {
        sistemaContext.setPageTitle("");
        sistemaContext.setPageFilters([]);
    }, []);

    return (
		<Box sx={{ display: "flex", width: "100%" }}>
			<Container maxWidth='false'>
				<GridContainer container>
					{/* //mfg */}
					<GridContainer item xs={6}>
						<MyPaper elevation={16}>
							<GridItem xs={12}>
								<HeadrTypography variant='h5'>
									<FactoryIcon
										sx={{
											color: sistTheme.palette.sistema
												.klipit.main,
											marginRight: 2,
											fontSize: 30,
										}}
									/>
									Manufacturing
								</HeadrTypography>
							</GridItem>
							<GridItem>
								<LinkTypography variant='h6'>
									<BlankLink to='/McCellDb?cell=8&sb=true'>
										Main Injection machine Cell Dashboard -
										Cell 1
									</BlankLink>
								</LinkTypography>
							</GridItem>
							<GridItem>
								<LinkTypography variant='h6'>
									<BlankLink to='/EndActivity'>
										End Production Activity
									</BlankLink>
								</LinkTypography>
							</GridItem>
							<GridItem>
								<LinkTypography variant='h6'>
									<BlankLink to='/ShiftSchedule'>
										Shift Schedule
									</BlankLink>
								</LinkTypography>
							</GridItem>
							<GridItem>
								<LinkTypography variant='h6'>
									<BlankLink to='/InvBooking?mcID=F04'>
										Book Inventory
									</BlankLink>
								</LinkTypography>
							</GridItem>
							<GridItem>
								<LinkTypography variant='h6'>
									<BlankLink to='/Clock'>Clock</BlankLink>
								</LinkTypography>
							</GridItem>
							<GridItem>
								<LinkTypography variant='h6'>
									<BlankLink to='/BarcodeLabelPrinting'>
										Barcode Label Printing
									</BlankLink>
								</LinkTypography>
							</GridItem>
						</MyPaper>
					</GridContainer>

					{/* Assy */}
					<GridContainer item xs={6}>
						<MyPaper elevation={16}>
							<GridItem xs={12}>
								<HeadrTypography variant='h5'>
									<HandymanIcon
										sx={{
											color: sistTheme.palette.sistema
												.klipit.main,
											marginRight: 2,
											fontSize: 30,
										}}
									/>
									Assembly
								</HeadrTypography>
							</GridItem>
							<GridItem>
								<HeadrTypography variant='h6'>
									<BlankLink
										to='/Assembly/EmployeeCellCurrentDB?cell=005_007_008_009'
										target='_blank'
										rel='noopener noreferrer'
									>
										Main Assembly Dashboard - Employee
										Assignment
									</BlankLink>
								</HeadrTypography>
							</GridItem>

							<GridItem>
								<LinkTypography variant='h6'>
									<BlankLink
										to='/Assembly/JobsCellDB?cell=007&showConstraintsOnly=false'
										// target="_blank"
										// rel="noopener noreferrer"
									>
										Main Assembly - Schedule
									</BlankLink>
								</LinkTypography>
							</GridItem>

							<GridItem>
								<LinkTypography variant='h6'>
									<BlankLink to='/TestJobsDB?cell=005'>
										Test Jobs DB
									</BlankLink>
								</LinkTypography>
							</GridItem>
							<GridItem>
								<LinkTypography variant='h6'>
									{/* <BlankLink to="/Assembly/AssemblyNav"> */}
									<BlankLink to='/Assembly/EmployeeCellPlanDnd'>
										Main Assembly Dashboard - Labour
										Rostering
									</BlankLink>
								</LinkTypography>
							</GridItem>
							<GridItem>
								<LinkTypography variant='h6'>
									<BlankLink to='/Assembly/ProductionBooking?line='>
										Main Assembly - Production Booking
									</BlankLink>{" "}
								</LinkTypography>
							</GridItem>
						</MyPaper>
					</GridContainer>

					{/* QA */}
					<GridContainer item xs={6}>
						<MyPaper elevation={16}>
							<GridItem xs={12}>
								<HeadrTypography variant='h5'>
									<HighQualityIcon
										sx={{
											color: sistTheme.palette.sistema
												.klipit.main,
											marginRight: 2,
											fontSize: 30,
										}}
									/>
									Quality
								</HeadrTypography>
							</GridItem>
							<GridItem>
								<LinkTypography variant='h6'>
									<BlankLink to='/QA'>
										Job Startup Inspection
									</BlankLink>
								</LinkTypography>
							</GridItem>
						</MyPaper>
					</GridContainer>

					{/* Raw Matl */}
					<GridContainer item xs={6}>
						<MyPaper elevation={16}>
							<GridItem xs={12}>
								<HeadrTypography variant='h5'>
									<WavingHandIcon
										sx={{
											color: sistTheme.palette.sistema
												.klipit.main,
											marginRight: 2,
											fontSize: 30,
										}}
									/>
									Raw Material Handling
								</HeadrTypography>
							</GridItem>
							<GridItem>
								<LinkTypography variant='h6'>
									<BlankLink
										href='https://aauc3spwniis001.nr.ad.newellco.com/sistema/Pickingandstaging.html'
										target='_blank'
										rel='noopener noreferrer'
									>
										Picking Schedule
									</BlankLink>
								</LinkTypography>
							</GridItem>
							<GridItem>
								<LinkTypography variant='h6'>
									<BlankLink
										href='https://aauc3spwniis001.nr.ad.newellco.com/sistema/DeliverySchedule.html'
										target='_blank'
										rel='noopener noreferrer'
									>
										PO Delivery Schedule
									</BlankLink>
								</LinkTypography>
							</GridItem>
							<GridItem>
								<LinkTypography variant='h6'>
									<BlankLink
										href='https://aauc3spwniis001.nr.ad.newellco.com/sistema/PremixSchedule.html'
										target='_blank'
										rel='noopener noreferrer'
									>
										Premix Schedule
									</BlankLink>
								</LinkTypography>
							</GridItem>
							<GridItem>
								<LinkTypography variant='h6'>
									<BlankLink
										href='https://aauc3spwniis001.nr.ad.newellco.com/sistema/RegrindSchedule.html'
										target='_blank'
										rel='noopener noreferrer'
									>
										Regrind Schedule
									</BlankLink>
								</LinkTypography>
							</GridItem>
							<GridItem>
								<LinkTypography variant='h6'>
									<BlankLink
										to='https:\\aauc3spwnmat001.nr.ad.newellco.com'
										target='_blank'
										rel='noopener noreferrer'
									>
										Mattec HMI
									</BlankLink>
								</LinkTypography>
							</GridItem>
						</MyPaper>
					</GridContainer>

					{/* PO's */}
					<GridContainer item xs={6}>
						<MyPaper elevation={16}>
							<GridItem xs={12}>
								<HeadrTypography variant='h5'>
									<ShoppingCartIcon
										sx={{
											color: sistTheme.palette.sistema
												.klipit.main,
											marginRight: 2,
											fontSize: 30,
										}}
									/>
									Purchasing
								</HeadrTypography>
							</GridItem>
							<GridItem>
								<LinkTypography variant='h6'>
									<BlankLink to='/PendingPOs'>
										PO Approval Dashboard
									</BlankLink>
								</LinkTypography>
							</GridItem>
						</MyPaper>
					</GridContainer>
				</GridContainer>
			</Container>
		</Box>
	);
}
