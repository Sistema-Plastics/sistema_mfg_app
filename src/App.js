import "./App.css";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material";
//import { styled } from "@mui/material/styles";

//import { Container } from "react-bootstrap";
//import { QueryClient, QueryClientProvider } from "react-query";
//import { Connector } from "mqtt-react-hooks";
//import Title from "./assets/components/Title";
import "./App.css";
import "./index.css";
//import "./assets/styling/Element.css";

// --- Main Page
import Index from "./components/ProductionDBIndex";
import SistemaHeader from "./assets/components/SistemaHeader";

import {
  //createBrowserRouter,
  BrowserRouter,
  //RouterProvider,
  Route,
  Routes,
  //Link,
} from "react-router-dom";

/**
// --- Digital Clock
import DigitalClock from "./assets/components/Clock";

// --- Main Page
import Index from "./components/ProductionDBIndex";

// --- Manufacturing
import ShiftSchedule from "./components/shiftSchedule/ShiftSchedule";

// --- Assembly
import AssemblyNav from "./components/assembly/assyPages/Navigation";
import EmployeeCellCurrentDB from "./components/assembly/assyPages/EmployeeCellCurrentDB";
import EmployeeCellCurrentDnd from "./components/assembly/assyPages/EmployeeCellCurrentDnd";
import EmployeeCellPlanDnd from "./components/assembly/assyPages/EmployeeCellPlanDnd";
import EmployeeJobPlanDnd from "./components/assembly/assyPages/EmployeeJobPlanDnd";
import EmployeeJobCurrentDnd from "./components/assembly/assyPages/EmployeeJobCurrentDnd";
import JobsCellDB from "./components/assembly/assyPages/JobsCellDB";
import JobsLineDB from "./components/assembly/assyPages/JobsLineDB";
import InventoryBooking from "./components/inventoryBooking/InventoryBooking";
import InventoryMovements from "./components/inventoryDashboards/inventoryMovements/InventoryMovements";


// --- Automation
import AutomationStatusDashboard from "./components/automationStatusDB/AutomationStatusDB";

// --- General
import CellAssignmentCheck from "./components/general/CellAssignmentCheck";
import OpAssignment from "./components/general/ScanOperator";
// --- Purchase Orders
import POApprovalDashboard from "./components/purchaseOrders/POApprovalDashboard";
import POApproval from "./components/purchaseOrders/POApproval";
import McCellDB from "./components/machineDashboards/CellDashboard";
import JobsDB from "./components/assembly/assyPages/JobsDB";
import JobsTable from "./components/assembly/assyComponents/JobsTable";

const queryClient = new QueryClient();

 */

// Link to how to use https://muhimasri.com/blogs/mui-textfield-colors-styles/#using-the-theme
const sistemaTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          flexGrow: 1,
          marginBottom: "0px",
        },
      },
    },
  },
});



//link to se how old JSS is converted to below https://mui.com/material-ui/migration/migrating-from-jss/ 
//note css specificty is advised against, better to use in line sx or custom type

function App() {
  return (
    /**  
   * Default App header
   *  <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    */
    <React.Fragment>
      <ThemeProvider theme={sistemaTheme}>
        <BrowserRouter>
          <SistemaHeader>
            {" "}
            <h1>Hello World Sistema</h1>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/Index" element={<Index />} />
            </Routes>
          </SistemaHeader>
        </BrowserRouter>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
