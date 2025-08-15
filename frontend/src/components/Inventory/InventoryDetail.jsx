// import React, { useEffect, useState } from "react";
// import {
//   useNavigate,
//   useParams,
//   Link,
//   useSearchParams,
// } from "react-router-dom";
// import {
//   deleteInventory,
//   getInventoryById,
// } from "../../services/inventoryServices";
// import { getAllSuppliers } from "../../services/suppliersServices";
// import {
//   Button,
//   Card,
//   Spinner,
//   OverlayTrigger,
//   Tooltip,
//   Modal,
//   Row,
//   Col,
//   Badge,
// } from "react-bootstrap";
// import { ArrowBack, Edit, Delete } from "@mui/icons-material"; // Material-UI icons

// const InventoryDetail = () => {
//   const [searchParms] = useSearchParams();
//   const { project_id } = Object.fromEntries([...searchParms]);
//   console.log("project_id=", project_id);

//   const { id } = useParams();
//   const navigate = useNavigate();

//   // States
//   const [inventory, setInventory] = useState([]);
//   const [supplier, setsupplier] = useState([]);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   const fetchinventoryById = () => {
//     getInventoryById(id)
//       .then((res) => {
//         console.log("inventory >> API response ", res.data);
//         setInventory(res.data);
//       })
//       .catch((err) => console.log(err));
//   };

//   const fetchsupplier = () => {
//     getAllSuppliers()
//       .then((res) => {
//         const supplierOptions = res.data.map((supplier) => ({
//           value: supplier.id,
//           label: supplier.name,
//         }));
//         console.log("supplier option=", supplierOptions);
//         setsupplier(supplierOptions);
//       })
//       .catch((err) => console.error("Error fetching supplier:", err));
//   };

//   const suppliersLookup = supplier.reduce((acc, supplier) => {
//     acc[supplier.value] = supplier.label;
//     return acc;
//   }, {});

//   useEffect(() => {
//     fetchinventoryById();
//     fetchsupplier();
//   }, [id]);

//   const handleDelete = () => {
//     deleteInventory(id)
//       .then(() => {
//         navigate("/inventory");
//       })
//       .catch((err) => console.log(err));
//   };

//   if (!inventory.length) {
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ height: "100vh" }}
//       >
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-3">
//       <Card className="shadow-lg border-0 p-4 wide-card">
//         <Card.Header className="text-center text-white card-header-custom">
//           {inventory[0].item_name[0].toUpperCase() +
//             inventory[0].item_name.substring(1)}{" "}
//           Details
//         </Card.Header>
//         <Card.Body>
//           <div className="details">
//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>Status:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 <Badge
//                   bg={
//                     inventory[0].status === "available"
//                       ? "success"
//                       : inventory[0].status === "unavailable"
//                       ? "danger"
//                       : "secondary"
//                   }
//                 >
//                   {inventory[0].status}
//                 </Badge>
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>item_name:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 {inventory[0].item_name[0].toUpperCase() +
//                   inventory[0].item_name.substring(1)}
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>suppliers:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 {suppliersLookup[inventory[0].supplier_id] ||
//                   inventory[0].supplier_id}
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>Qunatity:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 {inventory[0].quantity}
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>price Per Unit:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 <span style={{ color: "#0af05b", opacity: "0.6" }}> PKR </span>
//                 {inventory[0].pricePerUnit}
//               </Col>
//             </Row>
//           </div>

//           {/* Action Buttons */}
//           <div className="d-flex justify-content-around mt-3 action-buttons">
//             {project_id ? (
//               <OverlayTrigger
//                 placement="top"
//                 overlay={<Tooltip>Back to inventory List</Tooltip>}
//               >
//                 <Link to={`/projects/detail/${project_id}`}>
//                   <Button variant="secondary" className="responsive-button">
//                     <ArrowBack className="responsive-icon" />
//                   </Button>
//                 </Link>
//               </OverlayTrigger>
//             ) : (
//               <OverlayTrigger
//                 placement="top"
//                 overlay={<Tooltip>Back to inventory List</Tooltip>}
//               >
//                 <Link to="/inventory">
//                   <Button variant="secondary" className="responsive-button">
//                     <ArrowBack className="responsive-icon" />
//                   </Button>
//                 </Link>
//               </OverlayTrigger>
//             )}

//             <OverlayTrigger
//               placement="top"
//               overlay={<Tooltip>Edit inventory</Tooltip>}
//             >
//               <Link to={`/inventory/update/${id}`}>
//                 <Button variant="primary" className="responsive-button">
//                   <Edit className="responsive-icon" />
//                 </Button>
//               </Link>
//             </OverlayTrigger>

//             <OverlayTrigger
//               placement="top"
//               overlay={<Tooltip>Delete inventory</Tooltip>}
//             >
//               <Button
//                 variant="danger"
//                 className="responsive-button delete-button"
//                 onClick={() => setShowDeleteModal(true)}
//               >
//                 <Delete className="responsive-icon" />
//               </Button>
//             </OverlayTrigger>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         show={showDeleteModal}
//         onHide={() => setShowDeleteModal(false)}
//         centered
//         backdrop="static"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Delete</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to delete this inventory? This action cannot be
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

// export default InventoryDetail;
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
import { ArrowBack, Edit, Delete } from "@mui/icons-material";

const InventoryDetail = () => {
  const [searchParams] = useSearchParams();
  const { project_id } = Object.fromEntries([...searchParams]);
  const { id } = useParams();
  const navigate = useNavigate();

  // States
  const [inventory, setInventory] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventoryById = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getInventoryById(id);
      setInventory(response.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to load inventory details");
      setInventory(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await getAllSuppliers();
      const supplierOptions = response.data.map((supplier) => ({
        value: supplier.id,
        label: supplier.name,
      }));
      setSuppliers(supplierOptions);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setSuppliers([]);
    }
  };

  const suppliersLookup = suppliers.reduce((acc, supplier) => {
    acc[supplier.value] = supplier.label;
    return acc;
  }, {});

  useEffect(() => {
    fetchInventoryById();
    fetchSuppliers();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteInventory(id);
      navigate(project_id ? `/projects/detail/${project_id}` : "/inventory");
    } catch (err) {
      console.error("Error deleting inventory:", err);
      setShowDeleteModal(false);
      alert("Failed to delete inventory. Please try again.");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading inventory details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <h4 className="text-danger mb-3">{error}</h4>
        <Button variant="primary" onClick={fetchInventoryById}>
          Retry
        </Button>
      </div>
    );
  }

  if (!inventory) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <h4 className="mb-3">Inventory item not found</h4>
        <Link
          to={project_id ? `/projects/detail/${project_id}` : "/inventory"}
          className="btn btn-primary"
        >
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <Card className="shadow-lg border-0 p-4 wide-card">
        <Card.Header className="text-center text-white card-header-custom">
          {inventory.item_name?.charAt(0).toUpperCase() +
            inventory.item_name?.slice(1)}{" "}
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
                    inventory.status === "available"
                      ? "success"
                      : inventory.status === "unavailable"
                      ? "danger"
                      : "secondary"
                  }
                  className="text-capitalize"
                >
                  {inventory.status}
                </Badge>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <strong>Item Name:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {inventory.item_name?.charAt(0).toUpperCase() +
                  inventory.item_name?.slice(1)}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <strong>Supplier:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {suppliersLookup[inventory.supplier_id] ||
                  inventory.supplier_id}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <strong>Quantity:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {inventory.quantity}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <strong>Price Per Unit:</strong>
              </Col>
              <Col className="col-data" md={8}>
                <span className="text-success">
                  PKR {inventory.pricePerUnit}
                </span>
              </Col>
            </Row>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-around mt-4 action-buttons">
            <OverlayTrigger
              overlay={
                <Tooltip>
                  Back to {project_id ? "Project" : "Inventory"}
                </Tooltip>
              }
            >
              <Link
                to={
                  project_id ? `/projects/detail/${project_id}` : "/inventory"
                }
              >
                <Button variant="secondary" className="responsive-button">
                  <ArrowBack className="responsive-icon" />
                </Button>
              </Link>
            </OverlayTrigger>

            <OverlayTrigger overlay={<Tooltip>Edit Inventory</Tooltip>}>
              <Link
                to={`/inventory/update/${id}${
                  project_id ? `?project_id=${project_id}` : ""
                }`}
              >
                <Button variant="primary" className="responsive-button">
                  <Edit className="responsive-icon" />
                </Button>
              </Link>
            </OverlayTrigger>

            <OverlayTrigger overlay={<Tooltip>Delete Inventory</Tooltip>}>
              <Button
                variant="danger"
                className="responsive-button"
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
          Are you sure you want to delete this inventory item? This action
          cannot be undone.
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
