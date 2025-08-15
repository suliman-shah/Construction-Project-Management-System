// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import {
//   Button,
//   Card,
//   Spinner,
//   OverlayTrigger,
//   Tooltip,
//   Modal,
//   Row,
//   Col,
// } from "react-bootstrap";
// import { ArrowBack, Edit, Delete } from "@mui/icons-material"; // Material-UI icons
// import {
//   deleteSuppliers,
//   getSuppliersById,
// } from "../../services/suppliersServices";

// const SuppliersDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   deleteSuppliers;

//   // States
//   const [suppliers, setsuppliers] = useState([]);

//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   const fetchsupplierById = () => {
//     getSuppliersById(id)
//       .then((res) => {
//         setsuppliers(res.data);
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

//   useEffect(() => {
//     fetchsupplierById();
//   }, [id]);

//   const handleDelete = () => {
//     deleteSuppliers(id)
//       .then(() => {
//         navigate("/suppliers");
//       })
//       .catch((err) => console.log(err));
//   };

//   if (!suppliers.length) {
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
//           {suppliers[0].name[0].toUpperCase() + suppliers[0].name.substring(1)}
//           {" / "}
//           Details
//         </Card.Header>
//         <Card.Body>
//           <div className="details">
//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>Name:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 {suppliers[0].name[0].toUpperCase() +
//                   suppliers[0].name.substring(1)}
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>Phone:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 {suppliers[0].phone[0].toUpperCase() +
//                   suppliers[0].phone.substring(1)}
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>Email:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 <span style={{ color: "#00c445" }}>{suppliers[0].email}</span>
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>Address:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 {suppliers[0].address}
//               </Col>
//             </Row>
//           </div>

//           {/* Action Buttons */}
//           <div className="d-flex justify-content-around mt-3 action-buttons">
//             <OverlayTrigger
//               placement="top"
//               overlay={<Tooltip>Back to suppliers List</Tooltip>}
//             >
//               <Link to="/suppliers">
//                 <Button variant="secondary" className="responsive-button">
//                   <ArrowBack className="responsive-icon" />
//                 </Button>
//               </Link>
//             </OverlayTrigger>

//             <OverlayTrigger
//               placement="top"
//               overlay={<Tooltip>Edit suppliers</Tooltip>}
//             >
//               <Link to={`/suppliers/update/${id}`}>
//                 <Button variant="primary" className="responsive-button">
//                   <Edit className="responsive-icon" />
//                 </Button>
//               </Link>
//             </OverlayTrigger>

//             <OverlayTrigger
//               placement="top"
//               overlay={<Tooltip>Delete suppliers</Tooltip>}
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
//           Are you sure you want to delete this suppliers? This action cannot be
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

// export default SuppliersDetail;
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
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import {
  deleteSuppliers,
  getSuppliersById,
} from "../../services/suppliersServices";

const SuppliersDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // States
  const [supplier, setSupplier] = useState(null); // Changed from array to single object/null
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchSupplierById = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSuppliersById(id);
      setSupplier(response.data); // Assuming this returns a single object
    } catch (err) {
      console.error("Error fetching supplier:", err);
      setError("Failed to load supplier details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierById();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteSuppliers(id);
      navigate("/suppliers");
    } catch (err) {
      console.error("Error deleting supplier:", err);
      alert("Failed to delete supplier. Please try again.");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
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
        <Button variant="primary" onClick={fetchSupplierById}>
          Retry
        </Button>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <h4 className="mb-3">Supplier not found</h4>
        <Link to="/suppliers" className="btn btn-primary">
          Back to Suppliers
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <Card className="shadow-lg border-0 p-4 wide-card">
        <Card.Header className="text-center text-white card-header-custom">
          {supplier.name?.charAt(0).toUpperCase() + supplier.name?.slice(1)}
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
                {supplier.name?.charAt(0).toUpperCase() +
                  supplier.name?.slice(1)}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Phone:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {supplier.phone}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Email:</strong>
              </Col>
              <Col className="col-data" md={8}>
                <span style={{ color: "#00c445" }}>{supplier.email}</span>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Address:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {supplier.address}
              </Col>
            </Row>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-around mt-3 action-buttons">
            <OverlayTrigger overlay={<Tooltip>Back to Suppliers List</Tooltip>}>
              <Link to="/suppliers">
                <Button variant="secondary" className="responsive-button">
                  <ArrowBack className="responsive-icon" />
                </Button>
              </Link>
            </OverlayTrigger>

            <OverlayTrigger overlay={<Tooltip>Edit Supplier</Tooltip>}>
              <Link to={`/suppliers/update/${id}`}>
                <Button variant="primary" className="responsive-button">
                  <Edit className="responsive-icon" />
                </Button>
              </Link>
            </OverlayTrigger>

            <OverlayTrigger overlay={<Tooltip>Delete Supplier</Tooltip>}>
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
          Are you sure you want to delete this supplier? This action cannot be
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
