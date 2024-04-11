//import { QueryClient, QueryClientProvider } from "react-query";
//import { Connector } from "mqtt-react-hooks";
import "./App.css";
import React from "react";
import {blue} from "@mui/material/colors"
import {
  //createBrowserRouter,
  BrowserRouter,
  //RouterProvider,
  Route,
  Routes,
  //Link,
} from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material";
import { Container, Box } from "@mui/material";
import "@fontsource/roboto";

//#region Import Components & Styles

//Style Sheets
import "./App.css";
import "./index.css";
import "./assets/styling/Element.css";

// --- Main Page
import Index from "./components/ProductionDBIndex";
import SistemaHeader from "./assets/components/SistemaHeader";

//General
// --- Digital Clock
import DigitalClock from "./assets/components/Clock";


// --- Manufacturing
import ShiftSchedule from "./components/shiftSchedule/ShiftSchedule";


//#endregion



/**
// --- Digital Clock
import DigitalClock from "./assets/components/Clock";

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
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    htmlFontSize: 10,
  },
  palette:{
    action:{
      active:blue[500],
      visited:blue[500],
    }
  },

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

sistemaTheme.typography.body1 = { fontFamily: "Roboto" };
//link to se how old JSS is converted to below https://mui.com/material-ui/migration/migrating-from-jss/
//note css specificty is advised against, better to use in line sx or custom type

function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={sistemaTheme}>
        <BrowserRouter>
          <Container maxWidth="false">
            {/* //false disables maxwidth setting */}
            <Box component={"section"}>
              <SistemaHeader>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/Index" element={<Index />} /> 
                  <Route path="/Clock" element={<DigitalClock />} />
                  <Route path="/ShiftSchedule" element={<ShiftSchedule />} />
                </Routes>
              </SistemaHeader>
            </Box>
          </Container>
        </BrowserRouter>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
