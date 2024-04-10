// import { Container } from "react-bootstrap";
// import { SistemaContext } from "../assets/components/SistemaHeader";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Index() {
  //==========================================================
  // Initialize data for Sistema Toolbar and Filtering options
  //==========================================================
 
  // const sistemaContext = useContext(SistemaContext);
  // useEffect(() => {
  //   sistemaContext.setPageTitle("");
  //   sistemaContext.setPageFilters([]);
  // }, []);

  return (
    // <Container fluid>
      <div>
        <h3>Manufacturing</h3>
        <Link to="/McCellDb?cell=8&sb=true">
          Main Injection machine Cell Dashboard - Cell 1
        </Link>
        <br />
        <Link to="/EndActivity">End Production Activity</Link>
        <br />

        <Link to="/ShiftSchedule">Shift Schedule</Link>
        <br />
        <h3>Assembly</h3>
        <Link
          to="/Assembly/EmployeeCellCurrentDB?cell=005_007_008_009"
          target="_blank"
        >
          Main Assembly Dashboard - Employee Assignment
        </Link>
        <br />
        <Link
          to="/Assembly/JobsCellDB?cell=005&showConstraintsOnly=false"
          target="_blank"
        >
          Main Assembly - Schedule
        </Link>
        <br />
        <Link to="/TestJobsDB?cell=005">Test Jobs DB</Link>
        {/* <Link to="/Assembly/FastPkg">
        Main Assembly Dashboard - Fast Packaging
      </Link>*/}
        <br />
        {/* <Link to="/Assembly/AssemblyNav?shift=5"> */}
        <Link to="/Assembly/AssemblyNav">
          Main Assembly Dashboard - Labour Rostering
        </Link>
        <br />
        <Link to="/Assembly/ProductionBooking">
          Main Assembly - Production Booking
        </Link>
        <br />
        <h3>QA Dashboards</h3>
        <Link to="/QA">Job Startup Inspection</Link>
        <br />
        <h3>Raw Material Handling</h3>
        {/* <Link to="/RawMats/Picking">Picking Schedule</Link> */}
        <a
          href="https://aauc3spwniis001.nr.ad.newellco.com/sistema/Pickingandstaging.html"
          target="_blank"
        >
          Picking Schedule
        </a>
        <br />
        {/* <Link to="/RawMats/PO">PO Delivery Schedule</Link> */}
        <a
          href="https://aauc3spwniis001.nr.ad.newellco.com/sistema/DeliverySchedule.html"
          target="_blank"
        >
          PO Delivery Schedule
        </a>
        <br />
        {/* <Link to="/RawMats/Premix">Premix Schedule</Link> */}
        <a
          href="https://aauc3spwniis001.nr.ad.newellco.com/sistema/PremixSchedule.html"
          target="_blank"
        >
          Premix Schedule
        </a>
        <br />
        {/* <Link to="/RawMats/Regrind">Regrind Schedule</Link> */}
        <a
          href="https://aauc3spwniis001.nr.ad.newellco.com/sistema/RegrindSchedule.html"
          target="_blank"
        >
          Regrind Schedule
        </a>
        <br />
        <a href="https:\\aauc3spwnmat001.nr.ad.newellco.com" target="_blank">
          Mattec HMI
        </a>
        <br />
        <h3>Purchase Orders</h3>
        <Link to="/PendingPOs">PO Approval Dashboard</Link>
        <br />
      </div>
    // </Container>
  );
}
