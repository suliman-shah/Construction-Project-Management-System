import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getAllSuppliers } from "../../services/suppliersServices";
import { createInventory } from "../../services/inventoryServices";
import { Spinner } from "react-bootstrap";
import SaveIcon from "@mui/icons-material/Save";

const InventoryForm = () => {
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "white",
      borderRadius: "15px",
      border: "none",
      boxShadow: state.isFocused ? "0 0 8px rgba(255, 255, 255, 0.8);" : "none",
      transition: "all 0.3s ease-in-out",
      backdropFilter: "blur(20px)",
      padding: "15px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(255, 255, 255, 0.6)",
      fontStyle: "italic",
      fontSize: "16px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(20px)",
      borderRadius: "10px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "rgba(41, 49, 255, 0.9)"
        : "transparent",
      color: state.isFocused ? "white" : "#000",
      padding: "10px",
      borderRadius: "5px",
    }),
  };
  console.log("i am called ");
  // inventory states
  const [inventory, setInventory] = useState({
    supplier_id: null,
    item_name: "",
    quantity: "",
    pricePerUnit: "",
    // status: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // const statusOption = [
  //   { value: "available", label: "Available" },
  //   { value: "unavailable", label: "Unavailable" },
  // ];

  useEffect(() => {
    getAllSuppliers()
      .then((res) => {
        const supplierOptions = res.data.map((supplier) => ({
          value: supplier.id,
          label: supplier.name,
        }));
        setSuppliers(supplierOptions);
      })
      .catch((err) => console.log(err));
  }, []);

  const validateField = (name, value) => {
    let error = "";
    if (name === "item_name") {
      if (!value.trim()) {
        error = "Item name is required.";
      } else if (/\d/.test(value)) {
        error = "Item name must not contain numbers.";
      }
    } else if (name === "quantity" && !value) {
      error = "Quantity is required.";
    } else if (name === "pricePerUnit" && !value) {
      error = "Price per unit is required.";
    }
    // else if (name === "status" && !value) {
    //   error = "Status is required.";
    // }
    else if (name === "supplier_id" && !value) {
      error = "Supplier is required. first upload the supplier details";
    }
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(inventory).forEach((field) => {
      const error = validateField(field, inventory[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setInventory({ ...inventory, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  const handleSelectChange = (name, option) => {
    const value = option ? option.value : null;
    const error = validateField(name, value);
    setInventory({ ...inventory, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      createInventory(inventory)
        .then(() => {
          setSuccess(true);
          setTimeout(() => {
            navigate("/inventory", { state: { success: true, type: "add" } });
          }, 1000);
        })
        .catch((err) => console.log(err));
    }
  };

  // if (!suppliers.length) {
  //   return <Spinner animation="border" />;
  // }

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="task-form-wrapper shadow p-4 rounded">
        <h3 className="text-center mb-4">New Inventory</h3>
        <form onSubmit={handleSubmit}>
          <h6 style={{ color: "#ff8528" }}>
            The fields followed by asterisk (<span>*</span>) are required.
          </h6>

          <div className="mb-3">
            <label className="form-label">
              Item Name <span>*</span>
            </label>
            <input
              type="text"
              name="item_name"
              onChange={handleInputChange}
              value={inventory.item_name}
              placeholder="Cement"
              className={`form-control ${errors.item_name ? "is-invalid" : ""}`}
            />
            {errors.item_name && (
              <div className="text-danger">{errors.item_name}</div>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Quantity <span>*</span>
              </label>
              <input
                type="number"
                name="quantity"
                onChange={handleInputChange}
                value={inventory.quantity}
                placeholder="100"
                className={`form-control ${
                  errors.quantity ? "is-invalid" : ""
                }`}
              />
              {errors.quantity && (
                <div className="text-danger">{errors.quantity}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Price Per Unit <span>*</span>
              </label>
              <input
                type="number"
                name="pricePerUnit"
                onChange={handleInputChange}
                value={inventory.pricePerUnit}
                placeholder="50"
                className={`form-control ${
                  errors.pricePerUnit ? "is-invalid" : ""
                }`}
              />
              {errors.pricePerUnit && (
                <div className="text-danger">{errors.pricePerUnit}</div>
              )}
            </div>
          </div>

          {/* <div className="col-md-6 mb-3">
              <label className="form-label">
                Status <span>*</span>
              </label>
              <Select
                styles={customSelectStyles}
                value={statusOption.find(
                  (option) => option.value === inventory.status
                )}
                onChange={(option) => handleSelectChange("status", option)}
                options={statusOption}
                isSearchable
                isClearable
                placeholder="Select status"
                className={errors.status ? "is-invalid" : ""}
              />
              {errors.status && (
                <div className="text-danger">{errors.status}</div>
              )}
            </div> */}

          <div className="mb-3">
            <label className="form-label">
              Supplier <span>*</span>
            </label>
            <Select
              styles={customSelectStyles}
              value={suppliers.find(
                (option) => option.value === inventory.supplier_id
              )}
              onChange={(option) => handleSelectChange("supplier_id", option)}
              options={suppliers}
              isSearchable
              isClearable
              placeholder="Select supplier"
              className={errors.supplier_id ? "is-invalid" : ""}
            />
            {errors.supplier_id && (
              <div className="text-danger">{errors.supplier_id}</div>
            )}
          </div>

          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={success}
            >
              {success ? (
                <>
                  <Spinner animation="border" size="sm" /> Adding...
                </>
              ) : (
                <>
                  <SaveIcon /> Add Inventory
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
