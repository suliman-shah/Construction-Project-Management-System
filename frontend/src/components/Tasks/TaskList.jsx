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
  // console.log("location=", location);
  // console.log("navigate=", navigate);
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
        console.log("project-Options", projectsOptions);
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
        console.log("employee-Options", employeeOptions);
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
            <>
              <Spinner animation="border" />
              <p
                style={{ color: "white", backgroundColor: "rgba(0,0,0, 0.5)" }}
              >
                The database for the Construction Project Management System has
                not been uploaded yet, which is why the <b>Task</b> list is
                empty. Please be patient , it will be uploaded soon.
              </p>
            </>
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
