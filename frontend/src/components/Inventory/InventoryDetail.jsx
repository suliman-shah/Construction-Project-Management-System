import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  Link,
  useSearchParams,
} from "react-router-dom";
import {
  deleteInventory,
  getInventoryById,
} from "../../services/inventoryServices";
import { getAllSuppliers } from "../../services/suppliersServices";
import {
  Button,
  Card,
  Spinner,
  OverlayTrigger,
  Tooltip,
  Modal,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { ArrowBack, Edit, Delete } from "@mui/icons-material"; // Material-UI icons

const InventoryDetail = () => {
  const [searchParms] = useSearchParams();
  const { project_id } = Object.fromEntries([...searchParms]);
  console.log("project_id=", project_id);

  const { id } = useParams();
  const navigate = useNavigate();

  // States
  const [inventory, setInventory] = useState([]);
  const [supplier, setsupplier] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchinventoryById = () => {
    getInventoryById(id)
      .then((res) => {
        setInventory(res.data);
      })
      .catch((err) => console.log(err));
  };

  const fetchsupplier = () => {
    getAllSuppliers()
      .then((res) => {
        const supplierOptions = res.data.map((supplier) => ({
          value: supplier.id,
          label: supplier.name,
        }));
        console.log("supplier option=", supplierOptions);
        setsupplier(supplierOptions);
      })
      .catch((err) => console.error("Error fetching supplier:", err));
  };

  const suppliersLookup = supplier.reduce((acc, supplier) => {
    acc[supplier.value] = supplier.label;
    return acc;
  }, {});

  useEffect(() => {
    fetchinventoryById();
    fetchsupplier();
  }, [id]);

  const handleDelete = () => {
    deleteInventory(id)
      .then(() => {
        navigate("/inventory");
      })
      .catch((err) => console.log(err));
  };

  if (!inventory.length) {
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
          {inventory[0].item_name[0].toUpperCase() +
            inventory[0].item_name.substring(1)}{" "}
          Details
        </Card.Header>
        <Card.Body>
          <div className="details">
            <Row className="mb-3">
              <Col md={4}>
                <strong>Status:</strong>
              </Col>
              <Col className="col-data" md={8}>
                <Badge
                  bg={
                    inventory[0].status === "available"
                      ? "success"
                      : inventory[0].status === "unavailable"
                      ? "danger"
                      : "secondary"
                  }
                >
                  {inventory[0].status}
                </Badge>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>item_name:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {inventory[0].item_name[0].toUpperCase() +
                  inventory[0].item_name.substring(1)}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <strong>suppliers:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {suppliersLookup[inventory[0].supplier_id] ||
                  inventory[0].supplier_id}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Qunatity:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {inventory[0].quantity}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>price Per Unit:</strong>
              </Col>
              <Col className="col-data" md={8}>
                <span style={{ color: "#0af05b", opacity: "0.6" }}> PKR </span>
                {inventory[0].pricePerUnit}
              </Col>
            </Row>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-around mt-3 action-buttons">
            {project_id ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Back to inventory List</Tooltip>}
              >
                <Link to={`/projects/detail/${project_id}`}>
                  <Button variant="secondary" className="responsive-button">
                    <ArrowBack className="responsive-icon" />
                  </Button>
                </Link>
              </OverlayTrigger>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Back to inventory List</Tooltip>}
              >
                <Link to="/inventory">
                  <Button variant="secondary" className="responsive-button">
                    <ArrowBack className="responsive-icon" />
                  </Button>
                </Link>
              </OverlayTrigger>
            )}

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Edit inventory</Tooltip>}
            >
              <Link to={`/inventory/update/${id}`}>
                <Button variant="primary" className="responsive-button">
                  <Edit className="responsive-icon" />
                </Button>
              </Link>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Delete inventory</Tooltip>}
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
          Are you sure you want to delete this inventory? This action cannot be
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

export default InventoryDetail;
