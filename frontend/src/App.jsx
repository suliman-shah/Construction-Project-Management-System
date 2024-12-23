import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "C:/Users/PMLS/Documents/CONSTRUCTION App/frontend/src/common/TableListStyling.css";
import "C:/Users/PMLS/Documents/CONSTRUCTION App/frontend/src/common/NewFormStyling.css";
import "C:/Users/PMLS/Documents/CONSTRUCTION App/frontend/src/common/EditFormStyling.css";
import "C:/Users/PMLS/Documents/CONSTRUCTION App/frontend/src/common/DetailsCard.css";
import DashboardPage from "./pages/DashboardPage";
import ProjectPage from "./pages/ProjectPage";
import TaskPage from "./pages/TaskPage";
import EmployeePage from "./pages/EmployeePage";
import ExpensePage from "./pages/ExpensePage";
import InventoryPage from "./pages/InventoryPage";
import SupplierPage from "./pages/SupplierPage";
import ProjectResourcesPage from "./pages/ProjectResourcesPage";
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/SideBar";
import Footer from "./components/Layout/Footer"; // Import Footer component
import ProjectForm from "./components/Projects/ProjectForm";
import ProjectUpdate from "./components/Projects/ProjectUpdate";
import SuppliersForm from "./components/Suppliers/SuppliersForm";
import SuppliersUpdate from "./components/Suppliers/SuppliersUpdate";
import InventoryForm from "./components/Inventory/InventoryForm";
import InventoryUpdate from "./components/Inventory/InventoryUpdate";
import InventoryDetail from "./components/Inventory/InventoryDetail";
import ProjectDetails from "./components/Projects/ProjectDetails";
import EmployeeDetail from "./components/Employees/EmployeeDetail";
import EmployeeForm from "./components/Employees/EmployeeForm";
import EmployeeUpdate from "./components/Employees/EmployeeUpdate";
import TaskForm from "./components/Tasks/TaskForm";
import TaskDetails from "./components/Tasks/TaskDetail";
import TaskUpdate from "./components/Tasks/TaskUpdate";
import ExpenseDetails from "./components/Expenses/ExpenseDetails";
import ExpenseForm from "./components/Expenses/ExpenseForm";
import ExpenseUpdate from "./components/Expenses/ExpenseUpdate";
import ProjectResourcesForm from "./components/projectResources/ProjectResourcesForm";
import ProjectResourcesUpdate from "./components/projectResources/ProjectResourcesUpdate";
import Login from "./components/Auth/Login";
function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="App">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="container-fluid">
        <div className="row">
          {/* Hamburger Menu Button for smaller screens */}
          {/* <div className="col-12 d-md-none">
            <button className="btn btn-primary m-2" onClick={toggleSidebar}>
              {isSidebarOpen ? "Close Menu" : "☰"}
            </button>
          </div> */}
          <Sidebar isOpen={isSidebarOpen} />

          {/* Sidebar (collapsible on smaller screens) */}
          {/* <div
            className={`col-md-3 ${isSidebarOpen ? "" : "d-none d-md-block"}`}
          >
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          </div> */}

          {/* Main Content Area */}
          <div className="col-md-9 col-12">
            <div className="content">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/auth" element={<Login />} />

                {/* Projects */}

                <Route path="/projects" element={<ProjectPage />} />
                <Route path="/projects/new" element={<ProjectForm />} />
                <Route
                  path="/projects/update/:id"
                  element={<ProjectUpdate />}
                />
                <Route
                  path="/projects/detail/:id"
                  element={<ProjectDetails />}
                />
                {/* Tasks */}
                <Route path="/tasks" element={<TaskPage />} />
                <Route path="/tasks/new" element={<TaskForm />} />
                <Route path="/tasks/detail/:id" element={<TaskDetails />} />
                <Route path="/tasks/update/:id" element={<TaskUpdate />} />
                {/* Expenses */}
                <Route path="/expenses" element={<ExpensePage />} />
                <Route path="/expenses/new" element={<ExpenseForm />} />
                <Route
                  path="/expenses/detail/:id"
                  element={<ExpenseDetails />}
                />
                <Route
                  path="/expenses/update/:id"
                  element={<ExpenseUpdate />}
                />
                {/* Suppliers */}
                <Route path="/suppliers" element={<SupplierPage />} />
                <Route path="/suppliers/new" element={<SuppliersForm />} />
                <Route
                  path="/suppliers/update/:id"
                  element={<SuppliersUpdate />}
                />
                {/* <Route
                  path="/suppliers/detail/:id"
                  element={<SuppliersDetail />}
                /> */}
                {/* Inventory */}
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/inventory/new" element={<InventoryForm />} />
                <Route
                  path="/inventory/update/:id"
                  element={<InventoryUpdate />}
                />
                <Route
                  path="/inventory/detail/:id"
                  element={<InventoryDetail />}
                />
                {/* Employees */}
                <Route path="/employees" element={<EmployeePage />} />
                <Route path="/employees/new" element={<EmployeeForm />} />
                <Route
                  path="/employees/update/:id"
                  element={<EmployeeUpdate />}
                />
                <Route
                  path="/employees/detail/:id"
                  element={<EmployeeDetail />}
                />
                {/* ProjectResources */}
                <Route
                  path="/ProjectResources"
                  element={<ProjectResourcesPage />}
                />
                <Route
                  path="/ProjectResources/new"
                  element={<ProjectResourcesForm />}
                />
                <Route
                  path="/ProjectResources/update/:id"
                  element={<ProjectResourcesUpdate />}
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
      {/* Add Footer below content */}
      <Footer />
    </div>
  );
}

export default App;
