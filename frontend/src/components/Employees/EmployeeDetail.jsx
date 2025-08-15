// import React, { useEffect, useState } from "react";
// import {
//   useNavigate,
//   useParams,
//   Link,
//   useSearchParams,
// } from "react-router-dom";
// import { getAllProjects } from "../../services/projectService";
// import {
//   deleteEmployee,
//   getEmployeeById,
// } from "../../services/employeeService";
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
// // import "./EmployeeDetail.css"; // CSS file for animations and additional styling

// const EmployeeDetail = () => {
//   //strong style
//   // const customStyle = { color: "rgba(255, 199, 0, 1)" };

//   const [searchParms] = useSearchParams();
//   const { project_id } = Object.fromEntries([...searchParms]);
//   console.log(Object.fromEntries([...searchParms]));

//   const { id } = useParams();
//   const navigate = useNavigate();

//   // States
//   const [projects, setProjects] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   const fetchEmployeesbyId = () => {
//     getEmployeeById(id)
//       .then((res) => {
//         console.log("emplyee details=", res.data);
//         setEmployees(res.data);
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

//   const projectLookup = projects.reduce((acc, project) => {
//     acc[project.value] = project.label;
//     return acc;
//   }, {});

//   useEffect(() => {
//     fetchEmployeesbyId();
//     fetchProjects();
//   }, [id]);

//   const handleDelete = () => {
//     deleteEmployee(id)
//       .then(() => {
//         navigate("/employees");
//       })
//       .catch((err) => console.log(err));
//   };

//   if (employees.length === 0) {
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
//           {employees[0].first_name[0].toUpperCase() +
//             employees[0].first_name.substring(1) +
//             "  " +
//             employees[0].last_name[0].toUpperCase() +
//             employees[0].last_name.substring(1) +
//             "  / " +
//             employees[0].role[0].toUpperCase() +
//             employees[0].role.substring(1)}
//         </Card.Header>
//         <Card.Body>
//           <div className="details">
//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>First name:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 {employees[0].first_name[0].toUpperCase() +
//                   employees[0].first_name.substring(1)}
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>Last name:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 {employees[0].last_name[0].toUpperCase() +
//                   employees[0].last_name.substring(1)}
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>Role:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 <span style={{ color: "#ff8528" }}>
//                   {" "}
//                   {employees[0].role[0].toUpperCase() +
//                     employees[0].role.substring(1)}
//                 </span>
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>Phone:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 {employees[0].phone}
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>Email:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 {<span>{employees[0].email}</span>}
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>Salary:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 <span style={{ color: "#00c445" }}>PKR </span>
//                 {employees[0].salary}
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>Working project:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 <span style={{ color: "#00c445" }}>
//                   {" "}
//                   {projectLookup[employees[0].project_id] || "N/A"}
//                 </span>
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong> Hired date:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 {employees[0].date_hired}
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <strong>Address:</strong>
//               </Col>
//               <Col className="col-data" md={8}>
//                 {employees[0].address[0].toUpperCase() +
//                   employees[0].address.substring(1)}
//               </Col>
//             </Row>
//           </div>

//           {/* Action Buttons */}
//           <div className="d-flex justify-content-around mt-3 action-buttons">
//             {Object.fromEntries([...searchParms])?.project_id ? (
//               <OverlayTrigger
//                 placement="top"
//                 overlay={<Tooltip>Back to employees List</Tooltip>}
//               >
//                 <Link
//                   to={`/projects/detail/${
//                     Object.fromEntries([...searchParms])?.project_id
//                   }`}
//                 >
//                   <Button variant="secondary" className="responsive-button">
//                     <ArrowBack className="responsive-icon" />
//                   </Button>
//                 </Link>
//               </OverlayTrigger>
//             ) : (
//               <OverlayTrigger
//                 placement="top"
//                 overlay={<Tooltip>Back to employees List</Tooltip>}
//               >
//                 <Link to="/employees">
//                   <Button variant="secondary" className="responsive-button">
//                     <ArrowBack className="responsive-icon" />
//                   </Button>
//                 </Link>
//               </OverlayTrigger>
//             )}

//             <OverlayTrigger
//               placement="top"
//               overlay={<Tooltip>Edit employees</Tooltip>}
//             >
//               <Link to={`/employees/update/${id}`}>
//                 <Button variant="primary" className="responsive-button">
//                   <Edit className="responsive-icon" />
//                 </Button>
//               </Link>
//             </OverlayTrigger>

//             <OverlayTrigger
//               placement="top"
//               overlay={<Tooltip>Delete employees</Tooltip>}
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
//           Are you sure you want to delete this employees? This action cannot be
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

// export default EmployeeDetail;

import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  Link,
  useSearchParams,
} from "react-router-dom";
import { getAllProjects } from "../../services/projectService";
import {
  deleteEmployee,
  getEmployeeById,
} from "../../services/employeeService";
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

const EmployeeDetail = () => {
  const [searchParms] = useSearchParams();
  const { project_id } = Object.fromEntries([...searchParms]);
  const { id } = useParams();
  const navigate = useNavigate();

  // States
  const [projects, setProjects] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchEmployeeById = async () => {
    try {
      setIsLoading(true);
      const res = await getEmployeeById(id);
      console.log("Employee details:", res.data);

      // Handle both array and object responses
      const employeeData = Array.isArray(res.data) ? res.data[0] : res.data;

      if (!employeeData) {
        throw new Error("Employee data not found");
      }

      setEmployee(employeeData);
      setError(null);
    } catch (err) {
      console.error("Error fetching employee:", err);
      setError(err.message || "Failed to load employee data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await getAllProjects();
      const projectsOptions = res.data.map((project) => ({
        value: project.id,
        label: project.name,
      }));
      setProjects(projectsOptions);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const projectLookup = projects.reduce((acc, project) => {
    acc[project.value] = project.label;
    return acc;
  }, {});

  useEffect(() => {
    fetchEmployeeById();
    fetchProjects();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteEmployee(id);
      navigate("/employees");
    } catch (err) {
      console.error("Error deleting employee:", err);
      setError("Failed to delete employee");
    }
  };

  if (isLoading) {
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
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div>No employee data found</div>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <Card className="shadow-lg border-0 p-4 wide-card">
        <Card.Header className="text-center text-white card-header-custom">
          {employee.first_name?.[0]?.toUpperCase() +
            employee.first_name?.substring(1) +
            "  " +
            employee.last_name?.[0]?.toUpperCase() +
            employee.last_name?.substring(1) +
            "  / " +
            employee.role?.[0]?.toUpperCase() +
            employee.role?.substring(1)}
        </Card.Header>
        <Card.Body>
          <div className="details">
            <Row className="mb-3">
              <Col md={4}>
                <strong>First name:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {employee.first_name?.[0]?.toUpperCase() +
                  employee.first_name?.substring(1)}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Last name:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {employee.last_name?.[0]?.toUpperCase() +
                  employee.last_name?.substring(1)}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Role:</strong>
              </Col>
              <Col className="col-data" md={8}>
                <span style={{ color: "#ff8528" }}>
                  {employee.role?.[0]?.toUpperCase() +
                    employee.role?.substring(1)}
                </span>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Phone:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {employee.phone || "N/A"}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Email:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {employee.email || "N/A"}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Salary:</strong>
              </Col>
              <Col className="col-data" md={8}>
                <span style={{ color: "#00c445" }}>PKR </span>
                {employee.salary || "N/A"}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Working project:</strong>
              </Col>
              <Col className="col-data" md={8}>
                <span style={{ color: "#00c445" }}>
                  {projectLookup[employee.project_id] || "N/A"}
                </span>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Hired date:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {employee.date_hired || "N/A"}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Address:</strong>
              </Col>
              <Col className="col-data" md={8}>
                {employee.address?.[0]?.toUpperCase() +
                  employee.address?.substring(1) || "N/A"}
              </Col>
            </Row>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-around mt-3 action-buttons">
            {project_id ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Back to employees List</Tooltip>}
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
                overlay={<Tooltip>Back to employees List</Tooltip>}
              >
                <Link to="/employees">
                  <Button variant="secondary" className="responsive-button">
                    <ArrowBack className="responsive-icon" />
                  </Button>
                </Link>
              </OverlayTrigger>
            )}

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Edit employee</Tooltip>}
            >
              <Link to={`/employees/update/${id}`}>
                <Button variant="primary" className="responsive-button">
                  <Edit className="responsive-icon" />
                </Button>
              </Link>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Delete employee</Tooltip>}
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
          Are you sure you want to delete this employee? This action cannot be
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

export default EmployeeDetail;
