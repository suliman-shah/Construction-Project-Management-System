import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  Link,
  useSearchParams,
} from "react-router-dom";

import { getAllProjects } from "../../services/projectService";

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
import {
  deleteExpenses,
  getExpensesById,
} from "../../services/expensesService";

const ExpenseDetails = () => {
  const [searchParms] = useSearchParams();
  const { project_id } = Object.fromEntries([...searchParms]);
  console.log(Object.fromEntries([...searchParms]));

  const { id } = useParams();
  const navigate = useNavigate();

  // States
  const [expenses, setexpenses] = useState([]);
  const [projects, setProjects] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchexpensesById = () => {
    getExpensesById(id)
      .then((res) => {
        setexpenses(res.data);
      })
      .catch((err) => console.log("Error fetching expenses:", err));
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

  const projectLookup = projects.reduce((acc, project) => {
    acc[project.value] = project.label;
    return acc;
  }, {});

  useEffect(() => {
    fetchexpensesById();
    fetchProjects();
  }, [id]);

  const handleDelete = () => {
    deleteExpenses(id)
      .then(() => {
        navigate("/expenses");
      })
      .catch((err) => console.log(err));
  };

  if (expenses.length === 0) {
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
          {projectLookup[expenses[0].project_id] || expenses[0].project_id}
          {" / "}
          expenses Details
        </Card.Header>
        <Card.Body>
          <div className="details">
            <Row className="mb-3">
              <Col md={4}>
                <strong>Expenses Incurred by project:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {projectLookup[expenses[0].project_id] ||
                  expenses[0].project_id}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Amount:</strong>
              </Col>
              <Col className="col-data" md={8}>
                <span style={{ color: "#00c445" }}>PKR </span>
                {expenses[0].amount}{" "}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <strong>Expense Date:</strong>
              </Col>
              <Col className="col-data" md={8}>
                <span style={{ color: "#ff8528" }}>{expenses[0].date}</span>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Description:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {expenses[0].description[0].toUpperCase() +
                  expenses[0].description.substring(1)}
              </Col>
            </Row>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-around mt-3 action-buttons">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Back to expenses List</Tooltip>}
            >
              <Link to="/expenses">
                <Button variant="secondary" className="responsive-button">
                  <ArrowBack className="responsive-icon" />
                </Button>
              </Link>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Edit expenses</Tooltip>}
            >
              <Link to={`/expenses/update/${id}`}>
                <Button variant="primary" className="responsive-button">
                  <Edit className="responsive-icon" />
                </Button>
              </Link>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Delete expenses</Tooltip>}
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
          Are you sure you want to delete this expenses? This action cannot be
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

export default ExpenseDetails;
