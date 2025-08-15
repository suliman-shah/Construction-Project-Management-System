import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  Link,
  useSearchParams,
} from "react-router-dom";
import { deleteTask, getTaskById } from "../../services/taskService";
import { getAllProjects } from "../../services/projectService";
import { getAllEmployees } from "../../services/employeeService";
import {
  Button,
  Card,
  Spinner,
  OverlayTrigger,
  Tooltip,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import { ArrowBack, Edit, Delete } from "@mui/icons-material"; // Material-UI icons
// import "./TaskDetail.css"; // CSS file for animations and additional styling

const TaskDetail = () => {
  const [searchParms] = useSearchParams();
  const { project_id } = Object.fromEntries([...searchParms]);
  console.log("project_id=", project_id);
  console.log("searchParms=", searchParms.get("project_id"));
  console.log(Object.fromEntries([...searchParms]));
  console.log(` condtion ${Object.fromEntries([...searchParms])?.project_id}`);
  const { id } = useParams();
  const navigate = useNavigate();

  // States
  const [task, setTask] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchTaskById = () => {
    getTaskById(id)
      .then((res) => {
        setTask(res.data);
      })
      .catch((err) => console.log(err));
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

  const projectLookup = projects.reduce((acc, project) => {
    acc[project.value] = project.label;
    return acc;
  }, {});

  const employeeLookup = employees.reduce((acc, employee) => {
    acc[employee.value] = employee.label;
    return acc;
  }, {});

  useEffect(() => {
    fetchTaskById();
    fetchProjects();
    fetchEmployees();
  }, [id]);

  const handleDelete = () => {
    deleteTask(id)
      .then(() => {
        navigate("/tasks");
      })
      .catch((err) => console.log(err));
  };

  if (task.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <Card className="shadow-lg border-0 p-4 wide-card">
        <Card.Header className="text-center text-white card-header-custom">
          {task.name[0].toUpperCase() + task.name.substring(1)} Details
        </Card.Header>
        <Card.Body>
          <div className="details">
            <Row className="mb-3">
              <Col md={4}>
                <strong>Name:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {task.name[0].toUpperCase() + task.name.substring(1)}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Description:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {task.description[0].toUpperCase() +
                  task.description.substring(1)}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Project:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {projectLookup[task.project_id] || task.project_id}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Start Date:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {task.start_date}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>End Date:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {task.end_date}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Assigned To:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {employeeLookup[task.assigned_to] || "N/A"}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Priority:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {task.priority[0].toUpperCase() + task.priority.substring(1)}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Status:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {task.status == "Completed" ? (
                  <span style={{ color: "#00c445" }}>{task.status}</span>
                ) : (
                  ""
                )}
                {task.status == "In-Progress" ? (
                  <span style={{ color: "#ff8528" }}>{task.status}</span>
                ) : (
                  ""
                )}
                {task.status == "Not-Started" ? (
                  <span style={{ color: "#f20505" }}>{task.status}</span>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-around mt-3 action-buttons">
            {Object.fromEntries([...searchParms])?.project_id ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Back to Task List</Tooltip>}
              >
                <Link
                  to={`/projects/detail/${
                    Object.fromEntries([...searchParms])?.project_id
                  }`}
                >
                  <Button variant="secondary" className="responsive-button">
                    <ArrowBack className="responsive-icon" />
                  </Button>
                </Link>
              </OverlayTrigger>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Back to Task List</Tooltip>}
              >
                <Link to="/tasks">
                  <Button variant="secondary" className="responsive-button">
                    <ArrowBack className="responsive-icon" />
                  </Button>
                </Link>
              </OverlayTrigger>
            )}

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Edit Task</Tooltip>}
            >
              <Link to={`/tasks/update/${id}`}>
                <Button variant="primary" className="responsive-button">
                  <Edit className="responsive-icon" />
                </Button>
              </Link>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Delete Task</Tooltip>}
            >
              <Button
                variant="danger"
                className="responsive-button delete-button"
                onClick={() => setShowDeleteModal(true)}
              >
                <Delete className="responsive-icon" />
              </Button>
            </OverlayTrigger>
          </div>
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this task? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskDetail;

// import React, { useEffect } from "react";
// import { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { deleteTask, getTaskById } from "../../services/taskService";
// import { getAllProjects } from "../../services/projectService";
// import { getAllEmployees } from "../../services/employeeService";
// import { Link } from "react-router-dom";

// const TaskDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   console.log("id", id);
//   //states
//   const [task, setTask] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const fecthTaskById = () => {
//     getTaskById(id)
//       .then((res) => {
//         console.log(res.data);
//         // const task = res.data.find((task) => task.id == id);
//         // console.log("fecthed task:", task);
//         setTask(res.data);
//       })
//       .catch((err) => console.log(err));
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
//   const projectLookup = projects.reduce((acc, project) => {
//     acc[project.value] = project.label;
//     return acc;
//   }, {});
//   console.log("projectLookup", projectLookup);
//   const employeeLookup = employees.reduce((acc, employee) => {
//     acc[employee.value] = employee.label;
//     return acc;
//   }, {});

//   useEffect(() => {
//     fecthTaskById();
//     fetchProjects();
//     fetchEmployees();
//   }, [id]);
//   const handleDelete = () => {
//     deleteTask(id)
//       .then((res) => {
//         console.log(res);
//         navigate("/tasks");
//       })
//       .catch((err) => console.log(err));
//   };
//   if (task.length === 0) {
//     return (
//       <>
//         <p>loading....</p>
//       </>
//     );
//   }
//   return (
//     <div>
//       <Link to={"/tasks"}> Back</Link>
//       <p> ID: {task[0].id} </p>
//       <p>name:{task[0].name}</p>
//       <p>description:{task[0].description}</p>
//       <p>project name:{projectLookup[task[0].project_id] || task.project_id}</p>
//       <p>start_date:{task[0].start_date}</p>
//       <p>end_date:{task[0].end_date}</p>
//       <p>assigned_to:{employeeLookup[task[0].assigned_to] || "N/A"}</p>
//       <p>priority:{task[0].priority}</p>
//       <p>status:{task[0].status}</p>
//       <Link to={`/tasks/update/${id}`}>Edit</Link>
//       <button onClick={handleDelete}>delete</button>
//     </div>
//   );
// };

// export default TaskDetail;
