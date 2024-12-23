import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
  deleteSuppliers,
  getSuppliersById,
} from "../../services/suppliersServices";

const SuppliersDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  deleteSuppliers;

  // States
  const [suppliers, setsuppliers] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchsupplierById = () => {
    getSuppliersById(id)
      .then((res) => {
        setsuppliers(res.data);
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

  useEffect(() => {
    fetchsupplierById();
  }, [id]);

  const handleDelete = () => {
    deleteSuppliers(id)
      .then(() => {
        navigate("/suppliers");
      })
      .catch((err) => console.log(err));
  };

  if (!suppliers.length) {
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
          {suppliers[0].name[0].toUpperCase() + suppliers[0].name.substring(1)}
          {" / "}
          Details
        </Card.Header>
        <Card.Body>
          <div className="details">
            <Row className="mb-3">
              <Col md={4}>
                <strong>Name:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {suppliers[0].name[0].toUpperCase() +
                  suppliers[0].name.substring(1)}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Phone:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {suppliers[0].phone[0].toUpperCase() +
                  suppliers[0].phone.substring(1)}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Email:</strong>
              </Col>
              <Col className="col-data" md={8}>
                <span style={{ color: "#00c445" }}>{suppliers[0].email}</span>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Address:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {suppliers[0].address}
              </Col>
            </Row>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-around mt-3 action-buttons">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Back to suppliers List</Tooltip>}
            >
              <Link to="/suppliers">
                <Button variant="secondary" className="responsive-button">
                  <ArrowBack className="responsive-icon" />
                </Button>
              </Link>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Edit suppliers</Tooltip>}
            >
              <Link to={`/suppliers/update/${id}`}>
                <Button variant="primary" className="responsive-button">
                  <Edit className="responsive-icon" />
                </Button>
              </Link>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Delete suppliers</Tooltip>}
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
          Are you sure you want to delete this suppliers? This action cannot be
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

export default SuppliersDetail;
