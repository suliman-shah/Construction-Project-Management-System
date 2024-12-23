import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { getAllSuppliers } from "../../services/suppliersServices";
import {
  getInventoryById,
  updateInventory,
} from "../../services/inventoryServices";
import { Spinner } from "react-bootstrap";

const UpdateInventory = () => {
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
  const [inventory, setInventory] = useState({
    supplier_id: null, // This is where the selected supplier ID is stored
    item_name: "",
    quantity: "",
    pricePerUnit: "",
    // status: "", // This is where the selected status is stored
  }); // Set initial state to null to handle conditional rendering
  const [suppliers, setSuppliers] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // const statusOption = [
  //   { value: "available", label: "Available" },
  //   { value: "unavailable", label: "Unavailable" },
  // ];
  // Fetch suppliers and inventory data on component mount
  useEffect(() => {
    // Fetch suppliers
    getAllSuppliers()
      .then((res) => {
        const supplierOptions = res.data.map((supplier) => ({
          value: supplier.id,
          label: supplier.name,
        }));
        console.log("supplierOption", supplierOptions);
        setSuppliers(supplierOptions);
      })
      .catch((err) => console.log(err));

    // Fetch inventory data
    getInventoryById(id)
      .then((res) => {
        const fetchedData = res.data;
        setInventory({
          ...inventory,
          item_name: fetchedData[0].item_name,
          quantity: fetchedData[0].quantity,
          pricePerUnit: fetchedData[0].pricePerUnit,
          status: fetchedData[0].status,
          supplier_id: fetchedData[0].supplier_id,
        });
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
      error = "Supplier is required.";
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
      updateInventory(id, inventory)
        .then(() => {
          setSuccess(true);
          setTimeout(() => {
            navigate("/inventory", {
              state: { success: true, type: "update" },
            });
          }, 1000);
        })
        .catch((err) => console.log(err));
    }
  };

  // Conditionally render the form only when the inventory data has been fetched
  if (!inventory) {
    return <Spinner animation="border" size="sm" />;
  }

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="task-form-wrapper shadow p-4 rounded">
        <h3 className="text-center mb-4">Edit Inventory</h3>
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

          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={success}
          >
            {success ? (
              <>
                <Spinner animation="border" size="sm" /> Updating...
              </>
            ) : (
              <>update Inventory</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateInventory;

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Select from "react-select";
// import { colors } from "@mui/material";
// import { getAllSuppliers } from "../../services/suppliersServices";
// import {
//   getInventoryById,
//   updateInventory,
// } from "../../services/inventoryServices";

// const UpdateInventory = () => {
//   const customizeStyle = {};
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [inventory, setInventory] = useState({
//     supplier_id: null, // This is where the selected supplier ID is stored
//     item_name: "",
//     quantity: "",
//     pricePerUnit: "",
//     status: "", // This is where the selected status is stored
//   }); // Set initial state to null to handle conditional rendering
//   const [suppliers, setSuppliers] = useState([]);

//   const [statusOptions, setStatusOptions] = useState([
//     { value: "available", label: "Available" },
//     { value: "unavailable", label: "Unavailable" },
//   ]);

//   // Fetch suppliers and inventory data on component mount
//   useEffect(() => {
//     // Fetch suppliers
//     getAllSuppliers()
//       .then((res) => {
//         const supplierOptions = res.data.map((supplier) => ({
//           value: supplier.id,
//           label: supplier.name,
//         }));
//         console.log("supplierOption", supplierOptions);
//         setSuppliers(supplierOptions);
//       })
//       .catch((err) => console.log(err));

//     // Fetch inventory data
//     getInventoryById(id)
//       .then((res) => {
//         const fetchedData = res.data;
//         setInventory({
//           ...inventory,
//           item_name: fetchedData[0].item_name,
//           quantity: fetchedData[0].quantity,
//           pricePerUnit: fetchedData[0].pricePerUnit,
//           status: fetchedData[0].status,
//           supplier_id: fetchedData[0].supplier_id,
//         });
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   const handleInputChange = (e) => {
//     setInventory({
//       ...inventory,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSupplierChange = (selectedOption) => {
//     setInventory({
//       ...inventory,
//       supplier_id: selectedOption.value,
//     });
//   };

//   const handleStatusChange = (selectedOption) => {
//     console.log(selectedOption);

//     setInventory({
//       ...inventory,
//       status: selectedOption.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     updateInventory(id, inventory)
//       .then((res) => navigate("/inventory"))
//       .catch((err) => console.log(err));
//   };

//   // Conditionally render the form only when the inventory data has been fetched
//   if (!inventory) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>
//           Item Name:
//           <input
//             type="text"
//             name="item_name"
//             value={inventory.item_name}
//             onChange={handleInputChange}
//             required
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           Quantity:
//           <input
//             type="number"
//             name="quantity"
//             value={inventory.quantity}
//             onChange={handleInputChange}
//             required
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           Price Per Unit:
//           <input
//             type="number"
//             name="pricePerUnit"
//             value={inventory.pricePerUnit}
//             onChange={handleInputChange}
//             required
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           Status:
//           <Select
//             styles={customizeStyle}
//             value={statusOptions.find(
//               (option) => option.value === inventory.status
//             )}
//             onChange={handleStatusChange}
//             options={statusOptions}
//             isSearchable
//             required
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           Supplier:
//           <Select
//             styles={customizeStyle}
//             value={suppliers.find(
//               (option) => option.value === inventory.supplier_id
//             )}
//             onChange={handleSupplierChange}
//             options={suppliers}
//             isSearchable
//           />
//         </label>
//       </div>
//       <button type="submit" className="btn">
//         Update
//       </button>
//     </form>
//   );
// };

// export default UpdateInventory;
