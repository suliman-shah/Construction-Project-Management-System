////////////////////table with pagination and responsive  using bootstarp/////////////////////////////
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate"; // Import ReactPaginate
import { deleteTask, getAllTask } from "../../services/taskService";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { getAllProjects } from "../../services/projectService";
import { getAllEmployees } from "../../services/employeeService";
import {
  Spinner,
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
  Badge,
} from "react-bootstrap";
import { Search } from "@mui/icons-material";
import { AddCircle, Visibility, Delete, Edit, Add } from "@mui/icons-material";

import { useLocation } from "react-router-dom"; // Import useLocation
import { Alert } from "react-bootstrap"; // Import Alert for success message
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Import success icon from Material UI

const TaskList = () => {
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparent background like other fields
      color: "white",
      borderRadius: "15px", // Rounded corners
      // border: "1px solid rgba(255, 255, 255, 0.4)", // Light white border
      border: "none",
      boxShadow: state.isFocused
        ? "0 0 8px rgba(255, 255, 255, 0.5); "
        : "none", // White glow on focus
      transition: "all 0.3s ease-in-out",
      backdropFilter: "blur(5px)", // Optional glass-like effect
      padding: "15px", // Padding to match other inputs
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(255, 255, 255, 0.6)", // Light white placeholder like other fields
      fontStyle: "italic", // Italic placeholder styling
      fontSize: "16px", // Same size as other inputs
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white", // Selected text color white
    }),
    input: (provided) => ({
      ...provided,
      color: "white", // Input text color white
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.9)", // Transparent dropdown menu background
      backdropFilter: "blur(50px)", // Optional glass-like effect
      borderRadius: "10px", // Rounded corners for the dropdown
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "rgba(41, 49, 255, 0.9)"
        : "transparent", // Light background on hover
      color: state.isFocused ? "white" : "#000", // White text on hover, black otherwise
      padding: "10px", // Option padding for better readability
      borderRadius: "5px", // Rounded corners for options
    }),
  };
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(location.state?.success || false);
  const [type, setType] = useState(location.state?.type || ""); // "add" or "update"
  console.log(location);
  const [currentPage, setCurrentPage] = useState(0); // Current page state
  const tasksPerPage = 3; // Number of tasks per page
  const offset = currentPage * tasksPerPage; // Calculate offset for pagination
  const pageCount = Math.ceil(filteredTasks.length / tasksPerPage); // Total page count

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setType(""); // Clear type after alert is hidden
        navigate("/tasks", { replace: true }); // Clear the success state from history
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const fetchTasks = () => {
    setLoading(true);
    getAllTask()
      .then((res) => {
        setTasks(res.data);
        setFilteredTasks(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  };

  const fetchProjects = () => {
    getAllProjects()
      .then((res) => {
        const projectsOptions = res.data.map((project) => ({
          value: project.id,
          label: project.name,
        }));
        setProjects(projectsOptions);
      })
      .catch((err) => console.error("Error fetching projects:", err));
  };

  const fetchEmployees = () => {
    getAllEmployees()
      .then((res) => {
        const employeeOptions = res.data.map((employee) => ({
          value: employee.id,
          label: `${employee.first_name} ${employee.last_name}`,
        }));
        setEmployees(employeeOptions);
      })
      .catch((err) => console.error("Error fetching employees:", err));
  };

  const handleDelete = () => {
    deleteTask(taskToDelete)
      .then(() => {
        fetchTasks();
        setShowModal(false);
      })
      .catch((err) => console.error("Error deleting task:", err));
  };

  const confirmDelete = (id) => {
    setTaskToDelete(id);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleFilterChange = () => {
    let filtered = [...tasks];

    if (selectedProject) {
      filtered = filtered.filter(
        (task) => task.project_id === selectedProject.value
      );
    }

    if (selectedEmployee) {
      filtered = filtered.filter(
        (task) => task.assigned_to === selectedEmployee.value
      );
    }

    setFilteredTasks(filtered);
    setCurrentPage(0); // Reset to the first page when filters are applied
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedProject, selectedEmployee]);

  const projectLookup = projects.reduce((acc, project) => {
    acc[project.value] = project.label;
    return acc;
  }, {});

  const employeeLookup = employees.reduce((acc, employee) => {
    acc[employee.value] = employee.label;
    return acc;
  }, {});

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="container-fluid">
      {/* Conditionally show the appropriate alert based on "type" */}
      {success && type === "add" && (
        <Alert
          variant="success"
          className="mt-4 d-flex align-items-center"
          style={{ backgroundColor: "#d4edda", color: "#155724" }}
        >
          <CheckCircleIcon style={{ marginRight: "10px", fontSize: "24px" }} />
          <span>Task added successfully!</span>
        </Alert>
      )}

      {success && type === "update" && (
        <Alert
          variant="success"
          className="mt-4 d-flex align-items-center"
          style={{ backgroundColor: "#d4edda", color: "#155724" }}
        >
          <CheckCircleIcon style={{ marginRight: "10px", fontSize: "24px" }} />
          <span>Task updated successfully!</span>
        </Alert>
      )}

      <div className="row">
        <div className="col-12">
          {/* <h1 className="mt-3">Task List</h1> */}

          {/* Filters Section */}
          <div className="row mb-3">
            <div className="col-md-6 col-sm-12">
              <OverlayTrigger overlay={<Tooltip>Filter by Project</Tooltip>}>
                <div className="filter-select">
                  <Select
                    styles={customSelectStyles}
                    // components={{
                    //   DropdownIndicator: () => (
                    //     <Search className="search-icon" />
                    //   ),
                    // }}
                    placeholder="Filter by Project"
                    options={projects}
                    value={selectedProject}
                    onChange={(selectedOption) =>
                      setSelectedProject(selectedOption)
                    }
                    isClearable
                  />
                </div>
              </OverlayTrigger>
            </div>
            <div className="col-md-6 col-sm-12">
              <OverlayTrigger overlay={<Tooltip>Filter by Employee</Tooltip>}>
                <div className="filter-select">
                  <Select
                    styles={customSelectStyles}
                    // components={{
                    //   DropdownIndicator: () => (
                    //     <Search className="search-icon" />
                    //   ),
                    // }}
                    placeholder="Filter by Employee"
                    options={employees}
                    value={selectedEmployee}
                    onChange={(selectedOption) =>
                      setSelectedEmployee(selectedOption)
                    }
                    isClearable
                  />
                </div>
              </OverlayTrigger>
            </div>
          </div>

          <div className="mb-3">
            <OverlayTrigger
              overlay={<Tooltip className="tooltip">Add New Task</Tooltip>}
            >
              <Link to="/tasks/new" className="add-icon">
                <Add />
              </Link>
            </OverlayTrigger>
          </div>
          {/* Task Table */}
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <>
              <div className="table-responsive ">
                <table responsive className="table table-custom  ">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Project</th>
                      {/* <th>Description</th> */}
                      <th>Assigned To</th>
                      <th>Status</th>
                      <th>Priority </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks
                      .slice(offset, offset + tasksPerPage)
                      .map((task) => (
                        <tr
                          key={task.id}
                          onDoubleClick={() =>
                            navigate(`/tasks/detail/${task.id}`)
                          } // Navigate to task detail on row click
                          style={{ cursor: "pointer" }} // Add pointer to indicate it's clickable
                        >
                          <td>{task.name}</td>
                          <td>
                            {projectLookup[task.project_id] || task.project_id}
                          </td>
                          {/* <td>{task.description}</td> */}
                          <td>{employeeLookup[task.assigned_to] || "N/A"}</td>

                          <td>
                            <Badge
                              bg={
                                task.status === "Completed"
                                  ? "success"
                                  : task.status === "In-Progress"
                                  ? "warning"
                                  : "secondary"
                              }
                            >
                              {task.status}
                            </Badge>
                          </td>
                          <td>{task.priority}</td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
                                <Link
                                  style={{ borderRadius: "50%" }}
                                  to={`/tasks/detail/${task.id}`}
                                  className="btn btn-info btn-sm  "
                                >
                                  <Visibility />
                                </Link>
                              </OverlayTrigger>
                              <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                                <Link
                                  style={{ borderRadius: "50%" }}
                                  to={`/tasks/update/${task.id}`}
                                  className="btn btn-warning btn-sm  "
                                >
                                  <Edit />
                                </Link>
                              </OverlayTrigger>
                              <OverlayTrigger
                                overlay={<Tooltip>Delete</Tooltip>}
                              >
                                <Button
                                  style={{ borderRadius: "50%" }}
                                  variant="danger"
                                  size="sm"
                                  onClick={() => confirmDelete(task.id)}
                                >
                                  <Delete />
                                </Button>
                              </OverlayTrigger>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"react-paginate"}
                activeClassName={"selected"}
                disabledClassName={"disabled"}
              />
            </>
          )}

          {/* Modal for Delete Confirmation */}
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default TaskList;

///////////////////////// table using react data table but not responsive////////////////////////

// import React, { useEffect, useState } from "react";
// import { deleteTask, getAllTask } from "../../services/taskService";
// import Select from "react-select";
// import { Link } from "react-router-dom";
// import { getAllProjects } from "../../services/projectService";
// import { getAllEmployees } from "../../services/employeeService";
// import DataTable from "react-data-table-component";
// import "./TaskList.css"; // Make sure to style your components appropriately
// import {
//   IconButton,
//   Tooltip,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Button,
//   // TextField,
//   // InputAdornment,
// } from "@mui/material";
// import { Visibility, Delete, Edit, Search } from "@mui/icons-material";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import "./TaskList.css";

// const TaskList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [taskToDelete, setTaskToDelete] = useState(null);

//   useEffect(() => {
//     fetchTasks();
//     fetchProjects();
//     fetchEmployees();
//   }, []);

//   // Fetch tasks, projects, employees (same as before)
//   const fetchTasks = () => {
//     getAllTask()
//       .then((res) => {
//         setTasks(res.data);
//         setFilteredTasks(res.data);
//       })
//       .catch((err) => console.error("Error fetching tasks:", err));
//   };

//   const fetchProjects = () => {
//     getAllProjects()
//       .then((res) => {
//         const projectsOptions = res.data.map((project) => ({
//           value: project.id,
//           label: project.name,
//         }));
//         setProjects(projectsOptions);
//       })
//       .catch((err) => console.error("Error fetching projects:", err));
//   };

//   const fetchEmployees = () => {
//     getAllEmployees()
//       .then((res) => {
//         const employeeOptions = res.data.map((employee) => ({
//           value: employee.id,
//           label: `${employee.first_name} ${employee.last_name}`,
//         }));
//         setEmployees(employeeOptions);
//       })
//       .catch((err) => console.error("Error fetching employees:", err));
//   };

//   const handleDelete = () => {
//     deleteTask(taskToDelete)
//       .then(() => {
//         fetchTasks();
//         setOpenDialog(false);
//         setTaskToDelete(null);
//       })
//       .catch((err) => console.error("Error deleting task:", err));
//   };

//   const confirmDelete = (id) => {
//     setTaskToDelete(id);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setTaskToDelete(null);
//   };
//   const handleFilterChange = () => {
//     // Filtering logic (same as before)
//     let filtered = [...tasks];

//     if (selectedProject) {
//       filtered = filtered.filter(
//         (task) => task.project_id === selectedProject.value
//       );
//     }

//     if (selectedEmployee) {
//       filtered = filtered.filter(
//         (task) => task.assigned_to === selectedEmployee.value
//       );
//     }

//     setFilteredTasks(filtered);
//   };

//   useEffect(() => {
//     handleFilterChange();
//   }, [selectedProject, selectedEmployee]);

//   const projectLookup = projects.reduce((acc, project) => {
//     acc[project.value] = project.label;
//     return acc;
//   }, {});
//   console.log("projectLookup", projectLookup);
//   const employeeLookup = employees.reduce((acc, employee) => {
//     acc[employee.value] = employee.label;
//     return acc;
//   }, {});
//   const columns = [
//     // Columns configuration (same as before)
//     // { name: "ID", selector: (row) => row.id, sortable: true, width: "60px" },
//     {
//       name: "Name",
//       selector: (row) => row.name,
//       sortable: true,
//       wrap: true,
//     },
//     {
//       name: "Project",
//       selector: (row) => projectLookup[row.project_id] || row.project_id,
//       sortable: true,
//     },

//     {
//       name: "Description",
//       selector: (row) => row.description,
//       sortable: false,
//       wrap: true,
//     },
//     {
//       name: "Assigned To",
//       selector: (row) => employeeLookup[row.assigned_to] || "N/A",
//       sortable: true,
//     },
//     // {
//     //   name: "Start Date",
//     //   selector: (row) => new Date(row.start_date).toLocaleDateString(),
//     //   sortable: true,
//     // },
//     // {
//     //   name: "End Date",
//     //   selector: (row) =>
//     //     row.end_date ? new Date(row.end_date).toLocaleDateString() : "N/A",
//     //   sortable: true,
//     // },
//     { name: "Status", selector: (row) => row.status, sortable: true },
//     // { name: "Priority", selector: (row) => row.priority, sortable: true },
//     {
//       name: "Actions",
//       cell: (row) => (
//         <div className="actions">
//           <Tooltip title="View">
//             <IconButton
//               component={Link}
//               to={`/tasks/detail/${row.id}`}
//               color="primary"
//               size="small"
//             >
//               <Visibility />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Delete">
//             <IconButton
//               color="error"
//               size="small"
//               onClick={() => confirmDelete(row.id)}
//             >
//               <Delete />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Update">
//             <IconButton
//               component={Link}
//               to={`/tasks/update/${row.id}`}
//               color="secondary"
//               size="small"
//             >
//               <Edit />
//             </IconButton>
//           </Tooltip>
//         </div>
//       ),
//       ignoreRowClick: true,
//       allowOverflow: true,
//       button: true,
//       width: "150px",
//     },
//   ];

//   return (
//     <div className="task-list">
//       <h1>Task List</h1>

//       <div className="filters">
//         <Tooltip title="Filter by Project">
//           <div className="filter-select">
//             <Select
//               components={{
//                 DropdownIndicator: () => <Search className="search-icon" />,
//               }}
//               placeholder="Filter by Project"
//               options={projects}
//               value={selectedProject}
//               onChange={(selectedOption) => setSelectedProject(selectedOption)}
//               isClearable
//             />
//           </div>
//         </Tooltip>

//         <Tooltip title="Filter by Employee">
//           <div className="filter-select">
//             <Select
//               components={{
//                 DropdownIndicator: () => <Search className="search-icon" />,
//               }}
//               placeholder="Filter by Employee"
//               options={employees}
//               value={selectedEmployee}
//               onChange={(selectedOption) => setSelectedEmployee(selectedOption)}
//               isClearable
//             />
//           </div>
//         </Tooltip>
//       </div>

//       {/* <div className="add-task">
//         <Link to={"/tasks/new"} className="btn add-btn">
//           <AddCircleOutline className="add-icon" />
//           New Task
//         </Link>
//       </div> */}
//       <div className="add-task">
//         <Tooltip title="Add New Task">
//           <Link to={"/tasks/new"} className="btn add-btn">
//             <AddCircleIcon className="add-icon" />
//           </Link>
//         </Tooltip>
//       </div>

//       <hr />

//       <DataTable
//         columns={columns}
//         data={filteredTasks}
//         pagination
//         paginationPerPage={10}
//         paginationRowsPerPageOptions={[10, 20, 30]}
//         highlightOnHover
//         pointerOnHover
//         className="custom-data-table custom-datatable"
//       />

//       <Dialog
//         open={openDialog}
//         onClose={handleCloseDialog}
//         aria-labelledby="confirm-dialog-title"
//         aria-describedby="confirm-dialog-description"
//       >
//         <DialogTitle id="confirm-dialog-title">{"Delete Task?"}</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="confirm-dialog-description">
//             Are you sure you want to delete this task? This action cannot be
//             undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleDelete} color="error" autoFocus>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default TaskList;
// import React, { useEffect, useState } from "react";
// import { deleteTask, getAllTask } from "../../services/taskService";
// import Select from "react-select";
// import { Link } from "react-router-dom";
// import { getAllProjects } from "../../services/projectService";
// import { getAllEmployees } from "../../services/employeeService";
// import DataTable from "react-data-table-component";
// import "./TaskList.css"; // Ensure you have updated the CSS

// import {
//   IconButton,
//   Tooltip,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Button,
// } from "@mui/material";
// import { Visibility, Delete, Edit, Search } from "@mui/icons-material";
// import AddCircleIcon from "@mui/icons-material/AddCircle";

// const TaskList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [taskToDelete, setTaskToDelete] = useState(null);

//   useEffect(() => {
//     fetchTasks();
//     fetchProjects();
//     fetchEmployees();
//   }, []);

//   const fetchTasks = () => {
//     getAllTask()
//       .then((res) => {
//         setTasks(res.data);
//         setFilteredTasks(res.data);
//       })
//       .catch((err) => console.error("Error fetching tasks:", err));
//   };

//   const fetchProjects = () => {
//     getAllProjects()
//       .then((res) => {
//         const projectsOptions = res.data.map((project) => ({
//           value: project.id,
//           label: project.name,
//         }));
//         setProjects(projectsOptions);
//       })
//       .catch((err) => console.error("Error fetching projects:", err));
//   };

//   const fetchEmployees = () => {
//     getAllEmployees()
//       .then((res) => {
//         const employeeOptions = res.data.map((employee) => ({
//           value: employee.id,
//           label: `${employee.first_name} ${employee.last_name}`,
//         }));
//         setEmployees(employeeOptions);
//       })
//       .catch((err) => console.error("Error fetching employees:", err));
//   };

//   const handleDelete = () => {
//     deleteTask(taskToDelete)
//       .then(() => {
//         fetchTasks();
//         setOpenDialog(false);
//         setTaskToDelete(null);
//       })
//       .catch((err) => console.error("Error deleting task:", err));
//   };

//   const confirmDelete = (id) => {
//     setTaskToDelete(id);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setTaskToDelete(null);
//   };

//   const handleFilterChange = () => {
//     let filtered = [...tasks];
//     if (selectedProject) {
//       filtered = filtered.filter(
//         (task) => task.project_id === selectedProject.value
//       );
//     }

//     if (selectedEmployee) {
//       filtered = filtered.filter(
//         (task) => task.assigned_to === selectedEmployee.value
//       );
//     }

//     setFilteredTasks(filtered);
//   };

//   useEffect(() => {
//     handleFilterChange();
//   }, [selectedProject, selectedEmployee]);

//   const projectLookup = projects.reduce((acc, project) => {
//     acc[project.value] = project.label;
//     return acc;
//   }, {});

//   const employeeLookup = employees.reduce((acc, employee) => {
//     acc[employee.value] = employee.label;
//     return acc;
//   }, {});

//   const columns = [
//     {
//       name: "Name",
//       selector: (row) => row.name,
//       sortable: true,
//       wrap: true,
//     },
//     {
//       name: "Project",
//       selector: (row) => projectLookup[row.project_id] || row.project_id,
//       sortable: true,
//     },
//     {
//       name: "Description",
//       selector: (row) => row.description,
//       sortable: false,
//       wrap: true,
//     },
//     {
//       name: "Assigned To",
//       selector: (row) => employeeLookup[row.assigned_to] || "N/A",
//       sortable: true,
//     },
//     { name: "Status", selector: (row) => row.status, sortable: true },
//     {
//       name: "Actions",
//       cell: (row) => (
//         <div className="actions">
//           <Tooltip title="View">
//             <IconButton
//               component={Link}
//               to={`/tasks/detail/${row.id}`}
//               color="primary"
//               size="small"
//             >
//               <Visibility />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Delete">
//             <IconButton
//               color="error"
//               size="small"
//               onClick={() => confirmDelete(row.id)}
//             >
//               <Delete />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Update">
//             <IconButton
//               component={Link}
//               to={`/tasks/update/${row.id}`}
//               color="secondary"
//               size="small"
//             >
//               <Edit />
//             </IconButton>
//           </Tooltip>
//         </div>
//       ),
//       ignoreRowClick: true,
//       allowOverflow: true,
//       button: true,
//       width: "150px",
//     },
//   ];

//   return (
//     <div className="task-list">
//       <h1>Task List</h1>

//       <div className="filters">
//         <Tooltip title="Filter by Project">
//           <div className="filter-select">
//             <Select
//               components={{
//                 DropdownIndicator: () => <Search className="search-icon" />,
//               }}
//               placeholder="Filter by Project"
//               options={projects}
//               value={selectedProject}
//               onChange={(selectedOption) => setSelectedProject(selectedOption)}
//               isClearable
//             />
//           </div>
//         </Tooltip>

//         <Tooltip title="Filter by Employee">
//           <div className="filter-select">
//             <Select
//               components={{
//                 DropdownIndicator: () => <Search className="search-icon" />,
//               }}
//               placeholder="Filter by Employee"
//               options={employees}
//               value={selectedEmployee}
//               onChange={(selectedOption) => setSelectedEmployee(selectedOption)}
//               isClearable
//             />
//           </div>
//         </Tooltip>
//       </div>

//       <div className="add-task">
//         <Tooltip title="Add New Task">
//           <Link to={"/tasks/new"} className="btn add-btn">
//             <AddCircleIcon className="add-icon" />
//           </Link>
//         </Tooltip>
//       </div>

//       <hr />

//       <div className="table-responsive">
//         <DataTable
//           columns={columns}
//           data={filteredTasks}
//           pagination
//           paginationPerPage={10}
//           paginationRowsPerPageOptions={[10, 20, 30]}
//           highlightOnHover
//           pointerOnHover
//           className="custom-data-table"
//         />
//       </div>

//       <Dialog
//         open={openDialog}
//         onClose={handleCloseDialog}
//         aria-labelledby="confirm-dialog-title"
//         aria-describedby="confirm-dialog-description"
//       >
//         <DialogTitle id="confirm-dialog-title">{"Delete Task?"}</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="confirm-dialog-description">
//             Are you sure you want to delete this task? This action cannot be
//             undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleDelete} color="error" autoFocus>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default TaskList;

//////////////////////////////table without pagonation but responsive using bootstrap/////////////////////////////////
// import React, { useEffect, useState } from "react";
// import { deleteTask, getAllTask } from "../../services/taskService";
// import Select from "react-select";
// import { Link } from "react-router-dom";
// import { getAllProjects } from "../../services/projectService";
// import { getAllEmployees } from "../../services/employeeService";
// import {
//   Table,
//   Spinner,
//   Button,
//   Modal,
//   OverlayTrigger,
//   Tooltip,
// } from "react-bootstrap";
// import "bootstrap-icons/font/bootstrap-icons.css"; // Ensure Bootstrap Icons are imported
// import "./TaskList.css"; // Custom CSS for further styling

// const TaskList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [taskToDelete, setTaskToDelete] = useState(null);

//   useEffect(() => {
//     fetchTasks();
//     fetchProjects();
//     fetchEmployees();
//   }, []);

//   const fetchTasks = () => {
//     setLoading(true);
//     getAllTask()
//       .then((res) => {
//         setTasks(res.data);
//         setFilteredTasks(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching tasks:", err);
//         setLoading(false);
//       });
//   };

//   const fetchProjects = () => {
//     getAllProjects()
//       .then((res) => {
//         const projectOptions = res.data.map((project) => ({
//           value: project.id,
//           label: project.name,
//         }));
//         setProjects(projectOptions);
//       })
//       .catch((err) => console.error("Error fetching projects:", err));
//   };

//   const fetchEmployees = () => {
//     getAllEmployees()
//       .then((res) => {
//         const employeeOptions = res.data.map((employee) => ({
//           value: employee.id,
//           label: `${employee.first_name} ${employee.last_name}`,
//         }));
//         setEmployees(employeeOptions);
//       })
//       .catch((err) => console.error("Error fetching employees:", err));
//   };

//   const handleDelete = () => {
//     deleteTask(taskToDelete)
//       .then(() => {
//         fetchTasks();
//         setShowDeleteModal(false);
//         setTaskToDelete(null);
//       })
//       .catch((err) => console.error("Error deleting task:", err));
//   };

//   const handleFilterChange = () => {
//     let filtered = [...tasks];
//     if (selectedProject) {
//       filtered = filtered.filter(
//         (task) => task.project_id === selectedProject.value
//       );
//     }
//     if (selectedEmployee) {
//       filtered = filtered.filter(
//         (task) => task.assigned_to === selectedEmployee.value
//       );
//     }
//     setFilteredTasks(filtered);
//   };

//   useEffect(() => {
//     handleFilterChange();
//   }, [selectedProject, selectedEmployee]);

//   const confirmDelete = (id) => {
//     setTaskToDelete(id);
//     setShowDeleteModal(true);
//   };

//   const renderTooltip = (msg) => <Tooltip>{msg}</Tooltip>;

//   return (
//     <div className="task-list container-fluid">
//       <h1 className="my-4">Task List</h1>

//       <div className="filters row mb-3">
//         <div className="col-md-6 mb-2">
//           <OverlayTrigger
//             placement="top"
//             overlay={renderTooltip("Filter by Project")}
//           >
//             <Select
//               className="filter-select"
//               components={{
//                 DropdownIndicator: () => (
//                   <i className="bi bi-search" style={{ padding: "10px" }} />
//                 ),
//               }}
//               placeholder="Filter by Project"
//               options={projects}
//               value={selectedProject}
//               onChange={(option) => setSelectedProject(option)}
//               isClearable
//             />
//           </OverlayTrigger>
//         </div>

//         <div className="col-md-6 mb-2">
//           <OverlayTrigger
//             placement="top"
//             overlay={renderTooltip("Filter by Employee")}
//           >
//             <Select
//               className="filter-select"
//               components={{
//                 DropdownIndicator: () => (
//                   <i className="bi bi-search" style={{ padding: "10px" }} />
//                 ),
//               }}
//               placeholder="Filter by Employee"
//               options={employees}
//               value={selectedEmployee}
//               onChange={(option) => setSelectedEmployee(option)}
//               isClearable
//             />
//           </OverlayTrigger>
//         </div>
//       </div>

//       <div className="add-task mb-3 text-end">
//         <OverlayTrigger placement="top" overlay={renderTooltip("Add New Task")}>
//           <Link to="/tasks/new" className="btn btn-success">
//             <i className="bi bi-plus-circle"></i> Add Task
//           </Link>
//         </OverlayTrigger>
//       </div>

//       {loading ? (
//         <div className="text-center">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </Spinner>
//         </div>
//       ) : (
//         <div className="table-responsive">
//           <Table bordered hover className="table table-dark table-hover ">
//             <thead className="table-success" x>
//               <tr>
//                 <th>Name</th>
//                 <th>Project</th>
//                 <th>Description</th>
//                 <th>Assigned To</th>
//                 <th>Status</th>
//                 <th class="table-light">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredTasks.map((task) => (
//                 <tr key={task.id}>
//                   <td>{task.name}</td>
//                   <td>
//                     {
//                       projects.find((proj) => proj.value === task.project_id)
//                         ?.label
//                     }
//                   </td>
//                   <td>{task.description}</td>
//                   <td>
//                     {employees.find((emp) => emp.value === task.assigned_to)
//                       ?.label || "N/A"}
//                   </td>
//                   <td>{task.status}</td>
//                   <td className="table-light">
//                     <div className="d-flex justify-content-around flex-wrap ">
//                       <OverlayTrigger
//                         placement="top"
//                         overlay={renderTooltip("View Task")}
//                       >
//                         <Button
//                           variant="info"
//                           size="sm"
//                           as={Link}
//                           to={`/tasks/detail/${task.id}`}
//                         >
//                           <i className="bi bi-eye"></i>
//                         </Button>
//                       </OverlayTrigger>
//                       <OverlayTrigger
//                         placement="top"
//                         overlay={renderTooltip("Edit Task")}
//                       >
//                         <Button
//                           variant="secondary"
//                           size="sm"
//                           as={Link}
//                           to={`/tasks/update/${task.id}`}
//                         >
//                           <i className="bi bi-pencil"></i>
//                         </Button>
//                       </OverlayTrigger>
//                       <OverlayTrigger
//                         placement="top"
//                         overlay={renderTooltip("Delete Task")}
//                       >
//                         <Button
//                           variant="danger"
//                           size="sm"
//                           onClick={() => confirmDelete(task.id)}
//                         >
//                           <i className="bi bi-trash"></i>
//                         </Button>
//                       </OverlayTrigger>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       )}

//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Delete Task</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to delete this task? This action cannot be
//           undone.
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleDelete}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default TaskList;

// import React, { useEffect, useState } from "react";
// import { deleteTask, getAllTask } from "../../services/taskService";
// import Select from "react-select";
// import { Link, useNavigate } from "react-router-dom";
// import { getAllProjects } from "../../services/projectService";
// import { getAllEmployees } from "../../services/employeeService";
// import {
//   Spinner,
//   Modal,
//   Button,
//   OverlayTrigger,
//   Tooltip,
// } from "react-bootstrap";
// import { Search } from "@mui/icons-material";
// import { AddCircle, Visibility, Delete, Edit } from "@mui/icons-material";
// // import "bootstrap/dist/css/bootstrap.min.css";
// import "./TaskList.css";
// import { useLocation } from "react-router-dom"; // Import useLocation
// import { Alert } from "react-bootstrap"; // Import Alert for success message
// import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Import success icon from Material UI

// const TaskList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [taskToDelete, setTaskToDelete] = useState(null);

//   const location = useLocation(); // Get location
//   const navigate = useNavigate(); // Use navigate to modify the URL without state
//   const [success, setSuccess] = useState(location.state?.success || false); // Retrieve success state

//   useEffect(() => {
//     fetchTasks();
//     fetchProjects();
//     fetchEmployees();
//   }, []);

//   useEffect(() => {
//     if (success) {
//       const timer = setTimeout(() => {
//         setSuccess(false);
//         // Replace the URL to remove the state after the alert is displayed
//         navigate("/tasks", { replace: true }); // Replace the state after showing the alert
//       }, 3000); // Auto-hide success message after 3 seconds

//       return () => clearTimeout(timer);
//     }
//   }, [success, navigate]); // Add navigate as a dependency to avoid stale closures

//   const fetchTasks = () => {
//     getAllTask()
//       .then((res) => {
//         setTasks(res.data);
//         setFilteredTasks(res.data);
//         setLoading(false);
//       })
//       .catch((err) => console.error("Error fetching tasks:", err));
//   };

//   const fetchProjects = () => {
//     getAllProjects()
//       .then((res) => {
//         const projectsOptions = res.data.map((project) => ({
//           value: project.id,
//           label: project.name,
//         }));
//         setProjects(projectsOptions);
//       })
//       .catch((err) => console.error("Error fetching projects:", err));
//   };

//   const fetchEmployees = () => {
//     getAllEmployees()
//       .then((res) => {
//         const employeeOptions = res.data.map((employee) => ({
//           value: employee.id,
//           label: `${employee.first_name} ${employee.last_name}`,
//         }));
//         setEmployees(employeeOptions);
//       })
//       .catch((err) => console.error("Error fetching employees:", err));
//   };

//   const handleDelete = () => {
//     deleteTask(taskToDelete)
//       .then(() => {
//         fetchTasks();
//         setShowModal(false);
//       })
//       .catch((err) => console.error("Error deleting task:", err));
//   };

//   const confirmDelete = (id) => {
//     setTaskToDelete(id);
//     setShowModal(true);
//   };

//   const handleClose = () => setShowModal(false);

//   const handleFilterChange = () => {
//     let filtered = [...tasks];

//     if (selectedProject) {
//       filtered = filtered.filter(
//         (task) => task.project_id === selectedProject.value
//       );
//     }

//     if (selectedEmployee) {
//       filtered = filtered.filter(
//         (task) => task.assigned_to === selectedEmployee.value
//       );
//     }

//     setFilteredTasks(filtered);
//   };

//   useEffect(() => {
//     handleFilterChange();
//   }, [selectedProject, selectedEmployee]);

//   const projectLookup = projects.reduce((acc, project) => {
//     acc[project.value] = project.label;
//     return acc;
//   }, {});

//   const employeeLookup = employees.reduce((acc, employee) => {
//     acc[employee.value] = employee.label;
//     return acc;
//   }, {});

//   return (
//     <div className="container-fluid">
//       {success && (
//         <Alert
//           variant="success"
//           className="mt-4 d-flex align-items-center"
//           style={{ backgroundColor: "#d4edda", color: "#155724" }}
//         >
//           <CheckCircleIcon style={{ marginRight: "10px", fontSize: "24px" }} />
//           <span>Task added successfully!</span>
//         </Alert>
//       )}

//       <div className="row">
//         <div className="col-12">
//           <h1 className="mt-3">Task List</h1>

//           {/* Filters Section */}
//           <div className="row mb-3">
//             <div className="col-md-6 col-sm-12">
//               <OverlayTrigger overlay={<Tooltip>Filter by Project</Tooltip>}>
//                 <div className="filter-select">
//                   <Select
//                     components={{
//                       DropdownIndicator: () => (
//                         <Search className="search-icon" />
//                       ),
//                     }}
//                     placeholder="Filter by Project"
//                     options={projects}
//                     value={selectedProject}
//                     onChange={(selectedOption) =>
//                       setSelectedProject(selectedOption)
//                     }
//                     isClearable
//                   />
//                 </div>
//               </OverlayTrigger>
//             </div>
//             <div className="col-md-6 col-sm-12">
//               <OverlayTrigger overlay={<Tooltip>Filter by Employee</Tooltip>}>
//                 <div className="filter-select">
//                   <Select
//                     components={{
//                       DropdownIndicator: () => (
//                         <Search className="search-icon" />
//                       ),
//                     }}
//                     placeholder="Filter by Employee"
//                     options={employees}
//                     value={selectedEmployee}
//                     onChange={(selectedOption) =>
//                       setSelectedEmployee(selectedOption)
//                     }
//                     isClearable
//                   />
//                 </div>
//               </OverlayTrigger>
//             </div>
//           </div>

//           {/* Add Task Button */}
//           <div className="mb-3">
//             <OverlayTrigger overlay={<Tooltip>Add New Task</Tooltip>}>
//               <Link to={"/tasks/new"} className="btn btn-primary">
//                 <AddCircle className="mr-1" /> Add Task
//               </Link>
//             </OverlayTrigger>
//           </div>

//           {/* Task Table */}
//           {loading ? (
//             <Spinner animation="border" />
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-hover table-dark ">
//                 <thead className="table-primary">
//                   <tr>
//                     <th>Name</th>
//                     <th>Project</th>
//                     <th>Description</th>
//                     <th>Assigned To</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredTasks.map((task) => (
//                     <tr key={task.id}>
//                       <td>{task.name}</td>
//                       <td>
//                         {projectLookup[task.project_id] || task.project_id}
//                       </td>
//                       <td>{task.description}</td>
//                       <td>{employeeLookup[task.assigned_to] || "N/A"}</td>
//                       <td>{task.status}</td>
//                       <td>
//                         <div className="d-flex justify-content-around">
//                           <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
//                             <Link
//                               to={`/tasks/detail/${task.id}`}
//                               className="btn btn-info btn-sm"
//                             >
//                               <Visibility />
//                             </Link>
//                           </OverlayTrigger>
//                           <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
//                             <Link
//                               to={`/tasks/update/${task.id}`}
//                               className="btn btn-warning btn-sm"
//                             >
//                               <Edit />
//                             </Link>
//                           </OverlayTrigger>
//                           <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
//                             <Button
//                               variant="danger"
//                               size="sm"
//                               onClick={() => confirmDelete(task.id)}
//                             >
//                               <Delete />
//                             </Button>
//                           </OverlayTrigger>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Delete Confirmation Modal */}
//           <Modal show={showModal} onHide={handleClose}>
//             <Modal.Header closeButton>
//               <Modal.Title>Delete Task</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={handleClose}>
//                 Cancel
//               </Button>
//               <Button variant="danger" onClick={handleDelete}>
//                 Delete
//               </Button>
//             </Modal.Footer>
//           </Modal>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskList;
