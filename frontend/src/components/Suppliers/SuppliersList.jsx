import React, { useEffect, useState } from "react";
import {
  deleteSuppliers,
  getAllSuppliers,
} from "../../services/suppliersServices";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Select from "react-select";
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
import { Alert } from "react-bootstrap"; // Import Alert for success message
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Import success icon from Material UI

const SuppliersList = () => {
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
  const [suppliers, setSuppliers] = useState([]);
  const [suppliersOptions, setSuppliersOption] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [suppliersToDelete, setSuppliersToDelete] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(location.state?.success || false);
  const [type, setType] = useState(location.state?.type || ""); // "add" or "update"

  const [currentPage, setCurrentPage] = useState(0); // Current page state
  const suppliersPerPage = 3; // Number of suppliers per page
  const offset = currentPage * suppliersPerPage; // Calculate offset for pagination
  const pageCount = Math.ceil(filteredSuppliers.length / suppliersPerPage); // Total page count

  useEffect(() => {
    FetchSuppliers();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setType(""); // Clear type after alert is hidden
        navigate("/suppliers", { replace: true }); // Clear the success state from history
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  function FetchSuppliers() {
    setLoading(true);
    getAllSuppliers()
      .then((res) => {
        const supplierOptions = res.data.map((suppliers) => ({
          value: suppliers.id,
          label: suppliers.name,
        }));
        console.log("supplierOptions", supplierOptions);

        setSuppliers(res.data);
        setSuppliersOption(supplierOptions);
        setFilteredSuppliers(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }

  const handleDelete = () => {
    deleteSuppliers(suppliersToDelete)
      .then(() => {
        FetchSuppliers();
        setShowModal(false);
      })
      .catch((err) => console.error("Error deleting Suppliers:", err));
  };

  const confirmDelete = (id) => {
    setSuppliersToDelete(id);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleFilterChange = () => {
    let filtered = [...suppliers];

    if (selectedSuppliers) {
      filtered = filtered.filter(
        (suppliers) => suppliers.id === selectedSuppliers.value
      );
    }

    setFilteredSuppliers(filtered);
    setCurrentPage(0); // Reset to the first page when filters are applied
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedSuppliers]);

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
          <span>Suppliers added successfully!</span>
        </Alert>
      )}

      {success && type === "update" && (
        <Alert
          variant="success"
          className="mt-4 d-flex align-items-center"
          style={{ backgroundColor: "#d4edda", color: "#155724" }}
        >
          <CheckCircleIcon style={{ marginRight: "10px", fontSize: "24px" }} />
          <span>Suppliers updated successfully!</span>
        </Alert>
      )}

      <div className="row">
        <div className="col-12">
          {/* <h1 className="mt-3">Suppliers List</h1> */}

          {/* Filters Section */}
          <div className="row mb-3">
            <div className="col-md-6 col-sm-12">
              <OverlayTrigger overlay={<Tooltip>Filter by Suppliers</Tooltip>}>
                <div className="filter-select">
                  <Select
                    styles={customSelectStyles}
                    // components={{
                    //   DropdownIndicator: () => (
                    //     <Search className="search-icon" />
                    //   ),
                    // }}
                    placeholder="Filter by Supplier"
                    options={suppliersOptions}
                    value={selectedSuppliers}
                    onChange={(selectedOption) =>
                      setSelectedSuppliers(selectedOption)
                    }
                    isClearable
                    isSearchable
                  />
                </div>
              </OverlayTrigger>
            </div>
          </div>

          <div className="mb-3">
            <OverlayTrigger
              overlay={<Tooltip className="tooltip">Add New Suppliers</Tooltip>}
            >
              <Link to="/Suppliers/new" className="add-icon">
                <Add />
              </Link>
            </OverlayTrigger>
          </div>
          {/* Suppliers Table */}
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <>
              <div className="table-responsive ">
                <table className="table table-custom  ">
                  <thead>
                    <tr>
                      {/* <th>id</th> */}
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers
                      .slice(offset, offset + suppliersPerPage)
                      .map((Suppliers) => (
                        <tr
                          key={Suppliers.id}
                          onDoubleClick={() =>
                            navigate(`/Suppliers/detail/${Suppliers.id}`)
                          } // Navigate to Suppliers detail on row click
                          style={{ cursor: "pointer" }} // Add pointer to indicate it's clickable
                        >
                          {/* <td>{Suppliers.id}</td> */}
                          <td>{Suppliers.name}</td>

                          <td>{Suppliers.phone}</td>
                          <td>
                            <span style={{ color: "#00c445" }}>
                              {Suppliers.email}
                            </span>
                          </td>
                          <td>{Suppliers.address}</td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
                                <Link
                                  style={{ borderRadius: "50%" }}
                                  to={`/Suppliers/detail/${Suppliers.id}`}
                                  className="btn btn-info btn-sm  "
                                >
                                  <Visibility />
                                </Link>
                              </OverlayTrigger>
                              <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                                <Link
                                  style={{ borderRadius: "50%" }}
                                  to={`/Suppliers/update/${Suppliers.id}`}
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
                                  onClick={() => confirmDelete(Suppliers.id)}
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
              Are you sure you want to delete this Suppliers?
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
  );
};

export default SuppliersList;
