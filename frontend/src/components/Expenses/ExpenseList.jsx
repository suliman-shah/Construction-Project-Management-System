import React, { useEffect, useState } from "react";
import { deleteExpenses, getAllExpenses } from "../../services/expensesService";
import { Link, useNavigate } from "react-router-dom";
import { getAllProjects } from "../../services/projectService";
import ReactPaginate from "react-paginate"; // Import ReactPaginate

import Select from "react-select";
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
// import "./ExpenseList.css";

const ExpenseList = () => {
  //react select custom style

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
  const [expenses, setExpenses] = useState([]); //all expenses stored here
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expensesToDelete, setExpensesToDelete] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(location.state?.success || false);
  const [type, setType] = useState(location.state?.type || ""); // "add" or "update"
  const [ProjectId, setProjectId] = useState(location.state?.project_id || "");
  console.log("projetcID", ProjectId);
  const [currentPage, setCurrentPage] = useState(0); // Current page state
  const expensesPerPage = 3; // Number of expensess per page
  const offset = currentPage * expensesPerPage; // Calculate offset for pagination
  const pageCount = Math.ceil(filteredExpenses.length / expensesPerPage); // Total page count
  console.log("navigate=", location);
  //fetch projects and expenses
  useEffect(() => {
    fetchExpenses();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setType(""); // Clear type after alert is hidden
        navigate("/expenses", { replace: true }); // Clear the success state from history
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  //fetch all expenses
  const fetchExpenses = () => {
    setLoading(true);
    getAllExpenses()
      .then((res) => {
        console.log(res.data);
        setExpenses(res.data);
        setFilteredExpenses(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(`Error fetching expenses`, err));
  };

  const fetchProjects = () => {
    getAllProjects()
      .then((res) => {
        const projectOPtion = res.data.map((project) => {
          return {
            value: project.id,
            label: project.name,
          };
        });
        console.log(projectOPtion);
        setProjects(projectOPtion);
      })
      .catch((err) => console.log(err));
  };

  //event handlers
  const handleDelete = () => {
    deleteExpenses(expensesToDelete)
      .then(() => {
        fetchExpenses();
        setShowModal(false);
      })
      .catch((err) => console.error("Error deleting expenses:", err));
  };

  const confirmDelete = (id) => {
    setExpensesToDelete(id);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleFilterChange = () => {
    let filtered = [...expenses];

    if (selectedProject) {
      filtered = filtered.filter(
        (expenses) => expenses.project_id === selectedProject.value
      );
    }

    setFilteredExpenses(filtered);
    setCurrentPage(0); // Reset to the first page when filters are applied
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedProject]);

  const projectLookup = projects.reduce((acc, project) => {
    acc[project.value] = project.label;
    return acc;
  }, {});

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  //ui

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
          <span>
            Expense for project {projectLookup[expenses.project_id]} added
            successfully!
          </span>
        </Alert>
      )}

      {success && type === "update" && (
        <Alert
          variant="success"
          className="mt-4 d-flex align-items-center"
          style={{ backgroundColor: "#d4edda", color: "#155724" }}
        >
          <CheckCircleIcon style={{ marginRight: "10px", fontSize: "24px" }} />
          <span>
            Expense for project {projectLookup[ProjectId]} updated successfully!
          </span>
        </Alert>
      )}

      <div className="row">
        <div className="col-12">
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
          </div>

          <div className="mb-3">
            <OverlayTrigger
              overlay={<Tooltip className="tooltip">Add New expenses</Tooltip>}
            >
              <Link to="/expenses/new" className="add-icon">
                <Add />
              </Link>
            </OverlayTrigger>
          </div>
          {/* expenses Table */}
          {loading ? (
            <>
              <Spinner animation="border" />
              <p
                style={{ color: "white", backgroundColor: "rgba(0,0,0, 0.5)" }}
              >
                The database for the Construction Project Management System has
                not been uploaded yet, which is why the <b> Expenses </b> list
                is empty. Please be patient , it will be uploaded soon.
              </p>
            </>
          ) : (
            <>
              <div className="table-responsive ">
                <table className="table table-custom  ">
                  <thead>
                    <tr>
                      {/* <th>id</th> */}
                      <th>Project</th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses
                      .slice(offset, offset + expensesPerPage)
                      .map((expenses) => (
                        <tr
                          key={expenses.id}
                          onDoubleClick={() =>
                            navigate(`/expenses/detail/${expenses.id}`)
                          } // Navigate to expenses detail on row click
                          style={{ cursor: "pointer" }} // Add pointer to indicate it's clickable
                        >
                          {/* <td>{expenses.id}</td> */}
                          {/* <td>{expenses.project_id}</td> */}

                          <td>{projectLookup[expenses.project_id] || "N/A"}</td>
                          {/* <td>{expenses.description}</td> */}
                          <td>
                            <span style={{ color: "#00c445" }}>PKR </span>
                            {expenses.amount}
                          </td>
                          <td>{expenses.description.slice(0, 10) + "....."}</td>
                          <td>
                            <span style={{ color: "#ff8528" }}>
                              {expenses.date}
                            </span>
                          </td>
                          <td>
                            {/* replaced around by evenly */}
                            <div className="d-flex justify-content-around">
                              <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
                                <Link
                                  style={{ borderRadius: "50%" }}
                                  to={`/expenses/detail/${expenses.id}`}
                                  className="btn btn-info btn-sm  "
                                >
                                  <Visibility />
                                </Link>
                              </OverlayTrigger>
                              <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                                <Link
                                  style={{ borderRadius: "50%" }}
                                  to={`/expenses/update/${expenses.id}`}
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
                                  onClick={() => confirmDelete(expenses.id)}
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
            <Modal.Body>
              Are you sure you want to delete this expenses?
            </Modal.Body>
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

    // <div className="expenses-list">
    //   <h1>Expenses</h1>
    //   <Link to={"/expenses/new"} className="btn">
    //     {" "}
    //     add new expense
    //   </Link>
    //   <hr />
    //   <table>
    //     <thead>
    //       <tr>
    //         <th>id</th>
    //         <th>project_id</th>
    //         <th>amount </th>
    //         <th>description</th>
    //         <th>date</th>
    //         <th>actions</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {expenses.map((expense) => {
    //         return (
    //           <tr key={expense.id}>
    //             <td>{expense.id}</td>
    //             <td>{expense.project_id}</td>
    //             <td>{expense.amount}</td>
    //             <td>{expense.description}</td>
    //             <td>{expense.date}</td>
    //             <td>
    //               <Link to={`/expenses/detail/${expense.id}`} className="btn">
    //                 {" "}
    //                 veiw
    //               </Link>
    //               <button
    //                 onClick={() => {
    //                   handleDelete(expense.id);
    //                 }}
    //                 className="btn"
    //               >
    //                 delete
    //               </button>
    //               <Link to={`/expenses/update/${expense.id}`} className="btn">
    //                 update
    //               </Link>
    //             </td>
    //           </tr>
    //         );
    //       })}
    //     </tbody>
    //   </table>
    // </div>
  );
};

export default ExpenseList;
