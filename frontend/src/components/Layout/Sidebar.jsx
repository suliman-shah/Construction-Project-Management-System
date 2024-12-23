// import React from "react";
// import { Link, NavLink } from "react-router-dom";

// import { Add } from "@mui/icons-material";
// function Sidebar() {
//   return (
//     <aside className="sidebar">
//       <ul>
//         <li>
//           <NavLink to="/projects/new" className={"btn btn-primary "}>
//             Project <Add />
//           </NavLink>
//         </li>
//         <li>
//           <Link to="/tasks/new">Add New Task</Link>
//         </li>
//         <li>
//           <Link to="/employees/new">Add New Employee</Link>
//         </li>
//         <li>
//           <Link to="/expenses/new">Add New Expense</Link>
//         </li>
//         <li>
//           <Link to="/suppliers/new">Add New Suppliers</Link>
//         </li>
//         <li>
//           <Link to="/inventory/new">Add New Inventory</Link>
//         </li>
//         <li>
//           <Link to="/ProjectResources/new">New Project Resource</Link>
//         </li>
//       </ul>
//     </aside>
//   );
// }
// // import "./Sidebar.css"; // Add custom CSS for extra styling
// export default Sidebar;
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Add,
  Assignment,
  People,
  Receipt,
  Store,
  Inventory,
  Build,
} from "@mui/icons-material";
import "./Sidebar.css"; // Assuming you will add custom styles here

function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"} shadow`}>
      <ul className="list-unstyled">
        <li>
          <NavLink to="/projects/new" className="sidebar-link">
            <Add className="icon" /> Project
          </NavLink>
        </li>
        <li>
          <NavLink to="/tasks/new" className="sidebar-link">
            <Assignment className="icon" /> Add New Task
          </NavLink>
        </li>
        <li>
          <NavLink to="/employees/new" className="sidebar-link">
            <People className="icon" /> Add New Employee
          </NavLink>
        </li>
        <li>
          <NavLink to="/expenses/new" className="sidebar-link">
            <Receipt className="icon" /> Add New Expense
          </NavLink>
        </li>
        <li>
          <NavLink to="/suppliers/new" className="sidebar-link">
            <Store className="icon" /> Add New Suppliers
          </NavLink>
        </li>
        <li>
          <NavLink to="/inventory/new" className="sidebar-link">
            <Inventory className="icon" /> Add New Inventory
          </NavLink>
        </li>
        <li>
          <NavLink to="/ProjectResources/new" className="sidebar-link">
            <Build className="icon" /> New Project Resource
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
