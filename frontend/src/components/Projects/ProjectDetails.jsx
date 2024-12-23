// src/components/ProjectDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import RangeInputWithBubble from "./RangeInputWithBubble";
import BudgetExpenseComparison from "./BudgetExpenseComparison";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Table,
  Button,
  Badge,
  Spinner,
  Modal,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { getAllEmployees } from "../../services/employeeService";

import {
  AddCircle,
  Visibility,
  Delete,
  Edit,
  Add,
  Search,
} from "@mui/icons-material";

import { deleteTask } from "../../services/taskService";

function ProjectDetails() {
  const [searchParms] = useSearchParams();
  const { project_id } = Object.fromEntries([...searchParms]);
  console.log("project_id=", project_id);

  const { id } = useParams(); // Get project ID from URL
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filteredTask, setFilteredTask] = useState([]);
  const [searchTask, setSerachTask] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchEmployee, setsearchEmployee] = useState(null);
  const [searchInventory, setSearchInventory] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteExpense, setShowDeleteExpense] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [employeesOption, setEmployeesOption] = useState([]);
  const [projectResources, setprojectResources] = useState([]); // project resources stored here
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [rangeValue, setRangeValue] = useState(50); // Set initial range value
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);

  useEffect(() => {
    // Fetch all necessary data concurrently
    const fetchData = async () => {
      try {
        const projectResponse = await axios.get(
          `http://localhost:8080/projects/${id}`
        );
        const tasksResponse = await axios.get(
          `http://localhost:8080/task?project_id=${id}`
        );
        const employeesResponse = await axios.get(
          `http://localhost:8080/employees?project_id=${id}`
        );
        const expensesResponse = await axios.get(
          `http://localhost:8080/expenses?project_id=${id}`
        );
        const projectResourceResponse = await axios.get(
          `http://localhost:8080/projectResources?project_id=${id}`
        );
        getAllEmployees()
          .then((res) => {
            const employeeOptions = res.data.map((employee) => ({
              value: employee.id,
              label: `${employee.first_name} ${employee.last_name}`,
            }));
            setEmployeesOption(employeeOptions);
          })
          .catch((err) => console.error("Error fetching employees:", err));

        console.log("projectResponse", projectResponse);
        console.log("tasksRespons", tasksResponse);
        console.log("employeesResponse", employeesResponse);
        console.log("expensesResponse", expensesResponse);
        console.log("projectResourceResponse", projectResourceResponse);

        setProject(projectResponse.data[0]);
        setTasks(tasksResponse.data);
        setEmployees(employeesResponse.data);
        setExpenses(expensesResponse.data);

        setprojectResources(projectResourceResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  // Handle range input change
  const handleRangeChange = (e) => {
    const value = e.target.value;
    setRangeValue(value);
    // Filter expenses based on the current range value
    const filtered = expenses.filter((exp) => exp.amount <= value);
    setFilteredExpenses(filtered);
  };
  const fetchTasks = async () => {
    const res = await axios.get(`http://localhost:8080/task?project_id=${id}`);
    return res;
  };

  const employeeLookup = employeesOption.reduce((acc, employee) => {
    acc[employee.value] = employee.label;
    return acc;
  }, {});
  console.log("employeeLookup", employeeLookup);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container className="text-center mt-5">
        <h3>Project not found.</h3>
      </Container>
    );
  }

  // Calculate Key Metrics
  const progress = project.budget
    ? Math.min(((project.expenses / project.budget) * 100).toFixed(2), 100)
    : 0;

  const numberOfTasks = tasks.length;
  const numberOfEmployees = employees.length;

  // Handle Expense Deletion
  const handleDeleteExpense = (expense) => {
    setExpenseToDelete(expense);
    setShowDeleteExpense(true);
  };

  const confirmDeleteExpense = () => {
    axios
      .delete(`http://localhost:8080/expenses/${expenseToDelete.id}`)
      .then((response) => {
        alert(response.data);
        setExpenses(expenses.filter((exp) => exp.id !== expenseToDelete.id));
        setShowDeleteExpense(false);
        setExpenseToDelete(null);
        updateProjectExpenses();
      })
      .catch((error) => {
        console.error("Error deleting expense:", error);
        alert("Failed to delete expense.");
      });
  };

  const cancelDeleteExpense = () => {
    setShowDeleteExpense(false);
    setExpenseToDelete(null);
  };

  // Function to update project expenses after deletion or addition
  const updateProjectExpenses = () => {
    axios
      .put(`http://localhost:8080/projects/${id}/calculate-expenses`)
      .then((response) => {
        // Update the project expenses in state
        setProject({ ...project, expenses: response.data.totalExpenses });
      })
      .catch((error) => {
        console.error("Error updating project expenses:", error);
      });
  };
  const handleUploadDocument = () => {};
  ///////// delete task
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

  //serching funtions
  const handleTaskSerach = async (e) => {
    const { name, value } = e.target;
    console.log("searching for task=", value);
    const SearchResult = await axios.get(
      `http://localhost:8080/task?project_id=${id}&search=${value}`
    );
    setSerachTask(value);
    setTasks(SearchResult.data);
  };

  const handleEmployeeSerach = async (e) => {
    const { name, value } = e.target;
    console.log("searching for employee=", value);

    const SearchResult = await axios.get(
      `http://localhost:8080/employees?project_id=${id}&search=${value}`
    );
    setsearchEmployee(value);
    setEmployees(SearchResult.data);
  };

  const handleInventorySerach = async (e) => {
    const { name, value } = e.target;
    console.log("searching for employee=", value);

    const SearchResult = await axios.get(
      `http://localhost:8080/projectResources?project_id=${id}&search=${value}`
    );
    setSearchInventory(value);
    setSearchInventory(SearchResult.data);
  };
  return (
    <Container fluid className="mt-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col xs={12} md={8}>
          <h2 style={{ color: "#faffaf" }}>
            {project.name} &nbsp;
            <span>
              <Badge
                bg={
                  project.status === "Completed"
                    ? "success"
                    : project.status === "Ongoing"
                    ? "warning"
                    : "secondary"
                }
              >
                {project.status}
              </Badge>
            </span>
          </h2>
        </Col>
        <Col xs={12} md={4} className="text-md-end mt-3 mt-md-0">
          <OverlayTrigger overlay={<Tooltip>Edit Project</Tooltip>}>
            <Link
              style={{ borderRadius: "50%" }}
              to={`/projects/update/${id}`}
              className="btn btn-warning   "
            >
              <Edit />
            </Link>
          </OverlayTrigger>

          {/* <Link to={`/projects/update/${id}`} className="btn btn-warning">
            Edit Project
          </Link> */}
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs
        defaultActiveKey="overview"
        id="project-details-tabs"
        className="mb-3"
        fill
      >
        {/* Overview Tab */}
        <Tab eventKey="overview" title="Overview">
          <Row>
            {/* Basic Details */}
            <Col xs={12} md={6} className="mb-4">
              <h5 style={{ color: "" }}>Basic Details</h5>
              <Table hover responsive className="table-custom">
                <tbody>
                  <tr>
                    <th>Start Date</th>
                    <td>{project.start_date}</td>
                  </tr>
                  <tr>
                    <th>End Date</th>
                    <td>{project.end_date}</td>
                  </tr>
                  <tr>
                    <th>Budget</th>
                    <td>PKR {project.budget}</td>
                  </tr>
                  <tr>
                    <th> Net Expenses</th>
                    <td>PKR {project.expenses}</td>
                  </tr>
                  <tr>
                    <th>Description</th>
                    <td>{project.description}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>

            {/* Key Metrics */}
            <Col xs={12} md={6} className="mb-4">
              <h5>Key Metrics</h5>
              <Table hover responsive className="table-custom">
                <tbody>
                  <tr>
                    <th>Progress</th>
                    <td>
                      <Badge
                        bg={
                          progress < 50
                            ? "danger"
                            : progress < 80
                            ? "warning"
                            : "success"
                        }
                        className="fs-6"
                      >
                        {progress}%
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <th>Number of Tasks</th>
                    <td>{numberOfTasks}</td>
                  </tr>
                  <tr>
                    <th>Assigned Employees</th>
                    <td>{numberOfEmployees}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <BudgetExpenseComparison projectId={project.id} />
        </Tab>

        {/* Tasks Tab */}
        <Tab eventKey="tasks" title="Tasks">
          <Row className="mb-3">
            <Col>
              <form class="d-flex" role="search">
                <div class="input-group enhanced-search-bar">
                  <span class="input-group-text search-icon " id="search-addon">
                    <i class="bi bi-search "></i>
                  </span>
                  <input
                    type="search"
                    class="form-control search-input"
                    placeholder="Search Task.."
                    aria-label="Search"
                    aria-describedby="search-addon"
                    onChange={handleTaskSerach}
                    value={searchTask}
                  />
                </div>
              </form>
            </Col>
            <Col className="text-end">
              <OverlayTrigger
                overlay={<Tooltip className="tooltip">Add New Task</Tooltip>}
              >
                <Link
                  to={`/tasks/new?project_id=${project.id}`}
                  className="add-icon"
                >
                  <Add />
                </Link>
              </OverlayTrigger>
              {/* <Link
                to={`/tasks/new?project_id=${id}`}
                className="btn btn-primary"
              >
                Add New Task
              </Link> */}
            </Col>
          </Row>
          {tasks.length === 0 ? (
            <p>No tasks available for this project.</p>
          ) : (
            <Table bordered hover responsive className="table-custom">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.name}</td>
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
                    <td> {employeeLookup[task.assigned_to]}</td>
                    <td>
                      <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
                        <Link
                          style={{ borderRadius: "50%" }}
                          to={`/tasks/detail/${task.id}?project_id=${project.id}`}
                          className="btn btn-info btn-sm  "
                        >
                          <Visibility />
                        </Link>
                      </OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                        <Link
                          style={{ borderRadius: "50%" }}
                          to={`/tasks/update/${task.id}?project_id=${project.id}`}
                          className="btn btn-warning btn-sm  "
                        >
                          <Edit />
                        </Link>
                      </OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                        <Button
                          style={{ borderRadius: "50%" }}
                          variant="danger"
                          size="sm"
                          onClick={() => confirmDelete(task.id)}
                        >
                          <Delete />
                        </Button>
                      </OverlayTrigger>
                      {/* <Link
                        to={`/tasks/detail/${task.id}`}
                        className="btn btn-info btn-sm me-2"
                      >
                        View
                      </Link> */}
                      {/* <Link
                        to={`/tasks/update/${task.id}`}
                        className="btn btn-warning btn-sm"
                      >
                        Edit
                      </Link> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        {/* Employees Tab */}
        <Tab eventKey="employees" title="Employees">
          <Row className="mb-3">
            <Col>
              <form class="d-flex" role="search">
                <div class="input-group enhanced-search-bar">
                  <span class="input-group-text search-icon" id="search-addon">
                    <i class="bi bi-search"></i>
                  </span>
                  <input
                    type="search"
                    class="form-control search-input"
                    placeholder="Search Employee.."
                    aria-label="Search"
                    aria-describedby="search-addon"
                    onChange={handleEmployeeSerach}
                    value={searchEmployee}
                  />
                </div>
              </form>
            </Col>
            <Col className="text-end">
              <Link
                to={`/employees/new?project_id=${id}`}
                className="btn btn-primary"
              >
                Assign New Employee
              </Link>
            </Col>
          </Row>
          {employees.length === 0 ? (
            <p>No employees assigned to this project.</p>
          ) : (
            <Table bordered hover responsive className="table-custom">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{`${emp.first_name} ${emp.last_name}`}</td>
                    <td>{emp.role}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.email}</td>
                    <td>
                      <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
                        <Link
                          style={{ borderRadius: "50%" }}
                          to={`/employees/detail/${emp.id}?project_id=${project.id}`}
                          className="btn btn-info btn-sm  "
                        >
                          <Visibility />
                        </Link>
                      </OverlayTrigger>

                      <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                        <Link
                          style={{ borderRadius: "50%" }}
                          to={`/employees/update/${emp.id}?project_id=${project.id}`}
                          className="btn btn-warning btn-sm"
                        >
                          <Edit />
                        </Link>
                      </OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                        <Button
                          style={{ borderRadius: "50%" }}
                          variant="danger"
                          size="sm"
                          onClick={() => confirmDelete(emp.id)}
                        >
                          <Delete />
                        </Button>
                      </OverlayTrigger>
                      {/* <Link
                        to={`/employees/detail/${emp.id}`}
                        className="btn btn-info btn-sm"
                      >
                        View
                      </Link> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        {/* Expenses Tab */}
        {/* <Tab eventKey="expenses" title="Expenses">
          <Row className="mb-3">
            <Col>
              <h5>Expenses</h5>
              <form class="d-flex" role="search">
                <div class="input-group enhanced-search-bar">
                  <span class="input-group-text search-icon" id="search-addon">
                    <i class="bi bi-search"></i>
                  </span>
                  <input
                    type="search"
                    class="form-control search-input"
                    placeholder="expenses.."
                    aria-label="Search"
                    aria-describedby="search-addon"
                    onChange={handleTaskSerach}
                    value={searchTask}
                  />
                </div>
              </form>
            </Col>
            <Col className="text-end">
              <Link
                to={`/expenses/new?project_id=${id}`}
                className="btn btn-primary"
              >
                Add New Expense
              </Link>
            </Col>
          </Row>
          {expenses.length === 0 ? (
            <p>No expenses recorded for this project.</p>
          ) : (
            <Table bordered hover responsive className="table-custom">
              <thead className="table-light">
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>{exp.description}</td>
                    <td>${exp.amount}</td>
                    <td>{exp.date}</td>
                    <td>
                      <Link
                        to={`/expenses/update/${exp.id}`}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Edit
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteExpense(exp)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab> */}
        <Tab eventKey="expenses" title="Expenses">
          <Row className="mb-3">
            <Col>
              <h5>Expenses</h5>
              <div className="input-group range-input-wrapper mb-3">
                <label htmlFor="expenseRange" className="form-label">
                  Filter by Amount
                </label>
                <input
                  type="range"
                  className="form-range"
                  id="expenseRange"
                  min="0"
                  max="100000000" // Adjust the max value as needed
                  value={rangeValue}
                  onChange={handleRangeChange}
                />
                <div className="bubble">{rangeValue}</div>
              </div>
              {/* <RangeInputWithBubble /> */}
            </Col>
            <Col className="text-end">
              <Link
                to={`/expenses/new?project_id=${id}`}
                className="btn btn-primary"
              >
                Add New Expense
              </Link>
            </Col>
          </Row>
          {filteredExpenses.length === 0 ? (
            <p>No expenses recorded for this project.</p>
          ) : (
            <Table bordered hover responsive className="table-custom">
              <thead className="table-light">
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>{exp.description}</td>
                    <td> PKR {exp.amount}</td>
                    <td>{exp.date}</td>
                    <td>
                      <Link
                        to={`/expenses/update/${exp.id}`}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Edit
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteExpense(exp)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
        {/*Inventory Tab */}
        <Tab eventKey="inventory" title="Inventory">
          <Row className="mb-3">
            <Col>
              <form class="d-flex" role="search">
                <div class="input-group enhanced-search-bar">
                  <span class="input-group-text search-icon " id="search-addon">
                    <i class="bi bi-search "></i>
                  </span>
                  <input
                    type="search"
                    class="form-control search-input"
                    placeholder="Search Task.."
                    aria-label="Search"
                    aria-describedby="search-addon"
                    onChange={handleInventorySerach}
                    value={searchInventory}
                  />
                </div>
              </form>
            </Col>
            <Col className="text-end">
              <Link
                to={`/ProjectResources/new?project_id=${id}`}
                className="btn btn-primary"
              >
                Add New inventory
              </Link>
            </Col>
          </Row>
          {!projectResources.length ? (
            <p>No Inventory assigned to this project.</p>
          ) : (
            <Table bordered hover responsive className="table-custom">
              <thead className="table-light">
                <tr>
                  <th>Item</th>
                  <th>Quantity used </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projectResources.map((ProjectResources) => (
                  <tr key={ProjectResources.id}>
                    <td>{ProjectResources.item_name}</td>
                    <td>{ProjectResources.quantity_used}</td>

                    <td>
                      {/* <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
                        <Link
                          style={{ borderRadius: "50%" }}
                          to={`/inventory/detail/${inventory.id}`}
                          className="btn btn-info btn-sm  "
                        >
                          <Visibility />
                        </Link>
                      </OverlayTrigger> */}

                      <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                        <Link
                          style={{ borderRadius: "50%" }}
                          to={`/ProjectResources/update/${ProjectResources.id}?project_id=${project.id}`}
                          className="btn btn-warning btn-sm  "
                        >
                          <Edit />
                        </Link>
                      </OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                        <Button
                          style={{ borderRadius: "50%" }}
                          variant="danger"
                          size="sm"
                          onClick={() => confirmDelete(ProjectResources.id)}
                        >
                          <Delete />
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
        {/* Documents Tab (Optional) */}
        <Tab eventKey="documents" title="Documents">
          <Row className="mb-3">
            <Col>
              <h5>Project Documents</h5>
            </Col>
            <Col className="text-end">
              <Button variant="primary" onClick={handleUploadDocument}>
                Upload Document
              </Button>
            </Col>
          </Row>
          {/* Implement document upload and management here  */}
          <p style={{ color: "yellow" }}>
            Feature to upload and manage project-related documents will be
            implemented here in upcoming updates.
          </p>
        </Tab>
      </Tabs>

      {/* Delete Expense Confirmation Modal */}
      <Modal show={showDeleteExpense} onHide={cancelDeleteExpense}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this expense? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteExpense}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteExpense}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Task Confirmation Modal */}
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
    </Container>
  );
}

export default ProjectDetails;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import BudgetExpenseComparison from "./BudgetExpenseComparison";
// const ProjectDetails = () => {
//   const [expenses, setExpenses] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { id } = useParams();
//   console.log(id);
//   useEffect(() => {
//     const fetchExpenses = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/projects/${id}/expenses`
//         );
//         console.log(response.data);
//         setExpenses(response.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExpenses();
//   }, [id]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div>
//       <h2>Project Expenses</h2>
//       <p>Project ID: {expenses.project_id}</p>
//       <p>Project Name: {expenses.project_name}</p>
//       <p>Total Expenses: PKR {expenses.total_expenses}</p>
//       <hr />
//       <BudgetExpenseComparison projectId={id} />
//     </div>
//   );
// };

// export default ProjectDetails;
