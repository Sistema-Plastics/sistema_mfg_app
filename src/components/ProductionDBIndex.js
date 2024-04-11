
import { SistemaContext } from "../assets/components/SistemaHeader";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box"
 //TODO: remove  import Typography from "@mui/material/Typography"

import { styled } from "@mui/material/styles";

const BlankLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",

}));

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
    <Box>
      <h3>Manufacturing</h3>
      <BlankLink to="/McCellDb?cell=8&sb=true">
        Main Injection machine Cell Dashboard - Cell 1
      </BlankLink>
      <br />
      <BlankLink to="/EndActivity">End Production Activity</BlankLink>
      <br />

      <BlankLink to="/ShiftSchedule">Shift Schedule</BlankLink>
      <br />
      <BlankLink to="/Clock">Clock</BlankLink>
      <br />
      <h3>Assembly</h3>
      <BlankLink
        to="/Assembly/EmployeeCellCurrentDB?cell=005_007_008_009"
        target="_blank"
        rel="noopener noreferrer"
      >
        Main Assembly Dashboard - Employee Assignment
      </BlankLink>
      <br />
      <BlankLink
        to="/Assembly/JobsCellDB?cell=005&showConstraintsOnly=false"
        target="_blank"
        rel="noopener noreferrer"
      >
        Main Assembly - Schedule
      </BlankLink>
      <br />
      <BlankLink to="/TestJobsDB?cell=005">Test Jobs DB</BlankLink>
      {/* <BlankLink to="/Assembly/FastPkg">
        Main Assembly Dashboard - Fast Packaging
      </BlankLink>*/}
      <br />
      {/* <BlankLink to="/Assembly/AssemblyNav?shift=5"> */}
      <BlankLink to="/Assembly/AssemblyNav">
        Main Assembly Dashboard - Labour Rostering
      </BlankLink>
      <br />
      <BlankLink to="/Assembly/ProductionBooking">
        Main Assembly - Production Booking
      </BlankLink>
      <br />
      <h3>QA Dashboards</h3>
      <BlankLink to="/QA">Job Startup Inspection</BlankLink>
      <br />
      <h3>Raw Material Handling</h3>
      {/* <BlankLink to="/RawMats/Picking">Picking Schedule</BlankLink> */}
      <BlankLink
        href="https://aauc3spwniis001.nr.ad.newellco.com/sistema/Pickingandstaging.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        Picking Schedule
      </BlankLink>
      <br />
      {/* <BlankLink to="/RawMats/PO">PO Delivery Schedule</BlankLink> */}
      <BlankLink
        href="https://aauc3spwniis001.nr.ad.newellco.com/sistema/DeliverySchedule.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        PO Delivery Schedule
      </BlankLink>
      <br />
      {/* <BlankLink to="/RawMats/Premix">Premix Schedule</BlankLink> */}
      <BlankLink
        href="https://aauc3spwniis001.nr.ad.newellco.com/sistema/PremixSchedule.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        Premix Schedule
      </BlankLink>
      <br />
      {/* <BlankLink to="/RawMats/Regrind">Regrind Schedule</BlankLink> */}
      <BlankLink
        href="https://aauc3spwniis001.nr.ad.newellco.com/sistema/RegrindSchedule.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        Regrind Schedule
      </BlankLink>
      <br />
      <BlankLink
        to="https:\\aauc3spwnmat001.nr.ad.newellco.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Mattec HMI
      </BlankLink>
      <br />
      <h3>Purchase Orders</h3>
      <BlankLink to="/PendingPOs">PO Approval Dashboard</BlankLink>
      <br />
    </Box>
    
  );
}
