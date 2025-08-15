import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import ReactPaginate from "react-paginate"; // Import ReactPaginate
import {
  Spinner,
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
  Badge,
} from "react-bootstrap";
import { Search } from "@mui/icons-material";
import { AddCircle, Visibility, Delete, Edit, Add } from "@mui/icons-material";
import {
  deleteInventory,
  getAllInventory,
} from "../../services/inventoryServices";
import { getAllSuppliers } from "../../services/suppliersServices";
// import SuppliersList from "../Suppliers/SuppliersList";
import { Alert } from "react-bootstrap"; // Import Alert for success message
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Import success icon from Material UI

const InventoryList = () => {
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
      padding: "5px", // Padding to match other inputs
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

  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedItem, setselectedItem] = useState(null);
  const [selectedStatus, setselectedStatus] = useState(null);
  const [selectedSuppliers, setselectedSuppliers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(location.state?.success || false);
  const [type, setType] = useState(location.state?.type || ""); // "add" or "update"

  const [currentPage, setCurrentPage] = useState(0); // Current page state
  const inventoryPerPage = 3; // Number of tasks per page
  const offset = currentPage * inventoryPerPage; // Calculate offset for pagination
  const pageCount = Math.ceil(filteredInventory.length / inventoryPerPage); // Total page count

  const statusOptions = [
    {
      value: "available",
      label: "available",
    },
    {
      value: "unavailable",
      label: "unavailable",
    },
  ];

  useEffect(() => {
    fetchInventory();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setType(""); // Clear type after alert is hidden
        navigate("/inventory", { replace: true }); // Clear the success state from history
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  let fetchInventory = () => {
    setLoading(true);
    getAllInventory()
      .then((res) => {
        setInventory(res.data);
        setFilteredInventory(res.data);
        console.log(res.data);
        const itemOptions = res.data.map((inventory) => ({
          value: inventory.item_name,
          label: inventory.item_name,
        }));
        console.log("itemOptions=", itemOptions);
        setItems(itemOptions);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const fetchSuppliers = () => {
    getAllSuppliers()
      .then((res) => {
        console.log("suppliers", res.data);
        const SupplierOptions = res.data.map((suppliers) => ({
          value: suppliers.id,
          label: suppliers.name,
        }));
        setSuppliers(SupplierOptions);
      })
      .catch((err) => console.log("err fetching suppliers", err));
  };

  const SuppliersLookup = suppliers.reduce((acc, suppliers) => {
    acc[suppliers.value] = suppliers.label;
    return acc;
  }, {});
  console.log("SuppliersLookup", SuppliersLookup);

  const handleDelete = () => {
    deleteInventory(inventoryToDelete)
      .then(() => {
        fetchInventory();
        setShowModal(false);
      })
      .catch((err) => console.error("Error deleting inventory:", err));
  };

  const confirmDelete = (id) => {
    setInventoryToDelete(id);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleFilterChange = () => {
    let filtered = [...inventory];

    if (selectedSuppliers) {
      filtered = filtered.filter(
        (inventory) => inventory.supplier_id === selectedSuppliers.value
      );
    }

    if (selectedItem) {
      filtered = filtered.filter(
        (inventory) => inventory.item_name === selectedItem.value
      );
    }
    if (selectedStatus) {
      filtered = filtered.filter(
        (inventory) => inventory.status === selectedStatus.value
      );
    }

    setFilteredInventory(filtered);
    setCurrentPage(0); // Reset to the first page when filters are applied
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedItem, selectedStatus, selectedSuppliers]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  //event handlers

  /////////////////////////// UI   //////////////////////
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
          <span>Inventory added successfully!</span>
        </Alert>
      )}

      {success && type === "update" && (
        <Alert
          variant="success"
          className="mt-4 d-flex align-items-center"
          style={{ backgroundColor: "#d4edda", color: "#155724" }}
        >
          <CheckCircleIcon style={{ marginRight: "10px", fontSize: "24px" }} />
          <span>Inventory updated successfully!</span>
        </Alert>
      )}

      <div className="row">
        <div className="col-12">
          {/* Filters Section */}
          <div className="row" style={{ alignItems: "space-evenly" }}>
            <div className="col-4">
              <OverlayTrigger overlay={<Tooltip>Filter by Supplier</Tooltip>}>
                <div className="filter-select">
                  <Select
                    styles={customSelectStyles}
                    // components={{
                    //   DropdownIndicator: () => (
                    //     <Search className="search-icon" />
                    //   ),
                    // }}
                    placeholder="Filter by Supplier"
                    options={suppliers}
                    value={selectedSuppliers}
                    onChange={(selectedOption) =>
                      setselectedSuppliers(selectedOption)
                    }
                    isClearable
                  />
                </div>
              </OverlayTrigger>
            </div>
            <div className="col-4">
              <OverlayTrigger overlay={<Tooltip>Filter by Status</Tooltip>}>
                <div className="filter-select">
                  <Select
                    styles={customSelectStyles}
                    // components={{
                    //   DropdownIndicator: () => (
                    //     <Search className="search-icon" />
                    //   ),
                    // }}
                    placeholder="Filter by Status"
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={(selectedOption) =>
                      setselectedStatus(selectedOption)
                    }
                    isClearable
                  />
                </div>
              </OverlayTrigger>
            </div>

            <div className="col-4">
              <OverlayTrigger overlay={<Tooltip>Filter by Item</Tooltip>}>
                <div className="filter-select">
                  <Select
                    styles={customSelectStyles}
                    // components={{
                    //   DropdownIndicator: () => (
                    //     <Search className="search-icon" />
                    //   ),
                    // }}
                    placeholder="Filter by Item"
                    options={items}
                    value={selectedItem}
                    onChange={(selectedOption) =>
                      setselectedItem(selectedOption)
                    }
                    isClearable
                  />
                </div>
              </OverlayTrigger>
            </div>
          </div>

          <div className="mb-3">
            <OverlayTrigger
              overlay={<Tooltip className="tooltip">Add New Inventory</Tooltip>}
            >
              <Link to="/inventory/new" className="add-icon">
                <Add />
              </Link>
            </OverlayTrigger>
          </div>
          {/* Task Table */}
          {loading ? (
            <div className="d-flex justify-content-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            // <>
            //   <Spinner animation="border" />
            // </>
            <>
              <div className="table-responsive ">
                <table className="table table-custom  ">
                  <thead>
                    <tr>
                      {/* <th>id</th> */}
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Price Per Unit</th>
                      <th>Status</th>
                      <th>Supplier</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory
                      .slice(offset, offset + inventoryPerPage)
                      .map((inventory) => (
                        <tr
                          key={inventory.id}
                          onDoubleClick={() =>
                            navigate(`/inventory/detail/${inventory.id}`)
                          } // Navigate to task detail on row click
                          style={{ cursor: "pointer" }} // Add pointer to indicate it's clickable
                        >
                          {/* <td>{inventory.id}</td> */}
                          <td>{inventory.item_name}</td>
                          <td> {inventory.quantity}</td>
                          <td>
                            <span style={{ color: "#00c445", opacity: "0.6" }}>
                              {" "}
                              PKR{" "}
                            </span>
                            {inventory.pricePerUnit}{" "}
                          </td>

                          <td>
                            <Badge
                              bg={
                                inventory.status === "available"
                                  ? "success"
                                  : inventory.status === "unavailable"
                                  ? "danger"
                                  : "secondary"
                              }
                            >
                              {inventory.status}
                            </Badge>
                          </td>

                          <td>
                            {SuppliersLookup[inventory.supplier_id] ||
                              inventory.supplier_id}
                          </td>

                          <td>
                            <div className="d-flex justify-content-around">
                              <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
                                <Link
                                  style={{ borderRadius: "50%" }}
                                  to={`/inventory/detail/${inventory.id}`}
                                  className="btn btn-info btn-sm  "
                                >
                                  <Visibility />
                                </Link>
                              </OverlayTrigger>
                              <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                                <Link
                                  style={{ borderRadius: "50%" }}
                                  to={`/inventory/update/${inventory.id}`}
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
                                  onClick={() => confirmDelete(inventory.id)}
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
              Are you sure you want to delete this inventory?
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

export default InventoryList;
