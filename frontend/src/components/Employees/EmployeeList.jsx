import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  deleteEmployee,
  getAllEmployees,
} from "../../services/employeeService";

import ReactPaginate from "react-paginate"; // Import ReactPaginate
import {
  Spinner,
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Search } from "@mui/icons-material";
import { AddCircle, Visibility, Delete, Edit, Add } from "@mui/icons-material";

import { useLocation } from "react-router-dom"; // Import useLocation
import { Alert } from "react-bootstrap"; // Import Alert for success message
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Import success icon from Material UI
import { getAllProjects } from "../../services/projectService";

const EmployeeList = () => {
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
  const [employees, setEmployees] = useState([]); //all employees stored here
  const [filteredEmployees, setFilteredEmployees] = useState([]); // filtered employees stored here
  const [projects, setProjects] = useState([]); // projects options stored here
  const [employeeOptions, setEmployeesOptions] = useState([]); //employees options stored here
  const [selectedProject, setSelectedProject] = useState(null); //searched project
  const [selectedEmployee, setSelectedEmployee] = useState(null); //searched employee
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [employeesToDelete, setEmployeesToDelete] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(location.state?.success || false);
  const [type, setType] = useState(location.state?.type || ""); // "add" or "update"

  const [currentPage, setCurrentPage] = useState(0); // Current page state
  const employeePerPage = 3; // Number of tasks per page
  const offset = currentPage * employeePerPage; // Calculate offset for pagination
  const pageCount = Math.ceil(filteredEmployees.length / employeePerPage); // Total page count

  const fetchEmployees = () => {
    setLoading(true);
    getAllEmployees()
      .then((res) => {
        const employeeOptions = res.data.map((employee) => ({
          value: employee.id,
          label: `${employee.first_name} ${employee.last_name}`,
        }));
        setEmployeesOptions(employeeOptions);
        setEmployees(res.data);
        setFilteredEmployees(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
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
  useEffect(() => {
    fetchEmployees();
    fetchProjects();
  }, []);
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setType(""); // Clear type after alert is hidden
        navigate("/employees", { replace: true }); // Clear the success state from history
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleDelete = () => {
    deleteEmployee(employeesToDelete)
      .then(() => {
        fetchEmployees();
        setShowModal(false);
      })
      .catch((err) => console.error("Error deleting task:", err));
  };

  const confirmDelete = (id) => {
    setEmployeesToDelete(id);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleFilterChange = () => {
    let filtered = [...employees];

    if (selectedProject) {
      filtered = filtered.filter(
        (employees) => employees.project_id === selectedProject.value
      );
    }

    if (selectedEmployee) {
      filtered = filtered.filter(
        (employees) => employees.id === selectedEmployee.value
      );
    }

    setFilteredEmployees(filtered);
    setCurrentPage(0); // Reset to the first page when filters are applied
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedProject, selectedEmployee]);

  const projectLookup = projects.reduce((acc, project) => {
    acc[project.value] = project.label;
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
          <span>Employee added successfully!</span>
        </Alert>
      )}

      {success && type === "update" && (
        <Alert
          variant="success"
          className="mt-4 d-flex align-items-center"
          style={{ backgroundColor: "#d4edda", color: "#155724" }}
        >
          <CheckCircleIcon style={{ marginRight: "10px", fontSize: "24px" }} />
          <span>Employee updated successfully!</span>
        </Alert>
      )}

      <div className="row">
        <div className="col-12">
          {/* <h1 className="mt-3">Employess List</h1> */}

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
                    options={employeeOptions}
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

          {/* Add Task Button */}
          {/* <div className="mb-3">
            <OverlayTrigger overlay={<Tooltip>Add New Employee</Tooltip>}>
              <Link to={"/employees/new"} className="btn btn-primary">
                <AddCircle className="mr-1" /> &nbsp; &nbsp; &nbsp; &nbsp;
                &nbsp;Employee
              </Link>
            </OverlayTrigger>
          </div> */}
          <div className="mb-3">
            <OverlayTrigger
              overlay={<Tooltip className="tooltip">Add New Employee</Tooltip>}
            >
              <Link to="/employees/new" className="add-icon ">
                <Add />
              </Link>
            </OverlayTrigger>
          </div>
          {/* Task Table */}
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-custom">
                  <thead>
                    <tr>
                      {/* <th>id</th> */}
                      <th>First name</th>
                      <th>Last Name</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Email</th>
                      {/* <th>Address</th>
                      <th>Salary</th> */}
                      <th>Working Project</th>
                      {/* <th>Hired Date</th> */}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees
                      .slice(offset, offset + employeePerPage)
                      .map((employee) => (
                        <tr
                          key={employee.id}
                          onDoubleClick={() =>
                            navigate(`/employees/detail/${employee.id}`)
                          } // Navigate to task detail on row click
                          style={{ cursor: "pointer" }} // Add pointer to indicate it's clickable
                        >
                          {/* <td>{employee.id}</td> */}
                          <td>
                            {employee.first_name[0].toUpperCase() +
                              employee.first_name.substring(1)}
                          </td>
                          <td>
                            {employee.last_name[0].toUpperCase() +
                              employee.last_name.substring(1)}
                          </td>
                          <td>
                            <span style={{ color: "#00c445" }}>
                              {employee.role}
                            </span>
                          </td>
                          <td>{employee.phone}</td>
                          <td>{employee.email}</td>
                          {/* <td>{employee.address}</td>
                          <td>{employee.salary}</td> */}
                          <td>
                            <span style={{ color: "#ff8528" }}>
                              {projectLookup[employee.project_id] || "N/A"}
                            </span>
                          </td>
                          {/* <td>{employee.date_hired}</td> */}

                          <td>
                            <div className="d-flex justify-content-around">
                              <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
                                <Link
                                  style={{ borderRadius: "50%" }}
                                  to={`/employees/detail/${employee.id}`}
                                  className="btn btn-info btn-sm"
                                >
                                  <Visibility />
                                </Link>
                              </OverlayTrigger>
                              <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                                <Link
                                  style={{ borderRadius: "50%" }}
                                  to={`/employees/update/${employee.id}`}
                                  className="btn btn-warning btn-sm"
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
                                  onClick={() => confirmDelete(employee.id)}
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

              {/* Pagination */}
              {/* <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center"}
                previousLinkClassName={"page-link"}
                nextLinkClassName={"page-link"}
                disabledClassName={"disabled"}
                activeClassName={"active"}
                pageLinkClassName={"page-link"}
                breakLabel={"..."}
              /> */}

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
  // return (
  //   <div className="employees-list">
  //     <h1> employee</h1>
  //     <Link to={"/employees/new"} className="btn">
  //       {" "}
  //       add new employees
  //     </Link>
  //     <br />
  //     <hr />

  //     <table>
  //       <thead>
  //         <tr>
  //           <th>id</th>
  //           <th>fist name</th>
  //           <th>last name</th>
  //           <th>role</th>
  //           <th>phone</th>
  //           <th>email</th>
  //           <th>address</th>
  //           <th>salary</th>
  //           <th>project--id</th>
  //           <th>date hired</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {employees.map((e) => {
  //           return (
  //             <tr key={e.id}>
  //               <td>{e.id}</td>
  //               <td>{e.first_name}</td>
  //               <td>{e.last_name}</td>
  //               <td>{e.role}</td>
  //               <td>{e.phone}</td>
  //               <td>{e.email}</td>
  //               <td>{e.address}</td>
  //               <td>{e.salary}</td>
  //               <td>
  //                 {e.project_id != null ? (
  //                   e.project_id
  //                 ) : (
  //                   <span>add project</span>
  //                 )}
  //               </td>
  //               <td>{e.date_hired}</td>
  //               <td>
  //                 <Link to="/employees/detail/:id" className="btn">
  //                   view
  //                 </Link>
  //                 <button
  //                   className="btn"
  //                   onClick={() => {
  //                     handleDelete(e.id);
  //                   }}
  //                 >
  //                   delete
  //                 </button>
  //                 <Link to={`/employees/update/${e.id}`} className="btn">
  //                   update
  //                 </Link>
  //               </td>
  //             </tr>
  //           );
  //         })}
  //       </tbody>
  //     </table>
  //   </div>
  // );
};

export default EmployeeList;
