// // src/components/DocumentUploadModal.jsx
// import React, { useState, useRef } from "react";
// import { Modal, Button, Form, ProgressBar, Alert } from "react-bootstrap";

// import { uploadDocument } from "../../services/documentService";

// const DocumentUploadModal = ({
//   show,
//   handleClose,
//   projectId,
//   refreshDocuments,
// }) => {
//   const [file, setFile] = useState(null);
//   const [description, setDescription] = useState("");
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [error, setError] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setError("Please select a file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("description", description);

//     try {
//       setIsUploading(true);
//       setError(null);

//       await uploadDocument(projectId, formData, {
//         onUploadProgress: (progressEvent) => {
//           const progress = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setUploadProgress(progress);
//         },
//       });

//       refreshDocuments();
//       handleClose();
//       resetForm();
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to upload file");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const resetForm = () => {
//     setFile(null);
//     setDescription("");
//     setUploadProgress(0);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   return (
//     <Modal show={show} onHide={handleClose}>
//       <Modal.Header closeButton>
//         <Modal.Title>Upload Document</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {error && <Alert variant="danger">{error}</Alert>}

//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>File</Form.Label>
//             <Form.Control
//               type="file"
//               onChange={handleFileChange}
//               ref={fileInputRef}
//               disabled={isUploading}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Description (Optional)</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               disabled={isUploading}
//             />
//           </Form.Group>

//           {isUploading && (
//             <ProgressBar
//               now={uploadProgress}
//               label={`${uploadProgress}%`}
//               animated
//               className="mb-3"
//             />
//           )}

//           <div className="d-flex justify-content-end">
//             <Button
//               variant="secondary"
//               onClick={handleClose}
//               disabled={isUploading}
//               className="me-2"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="primary"
//               type="submit"
//               disabled={isUploading || !file}
//             >
//               {isUploading ? "Uploading..." : "Upload"}
//             </Button>
//           </div>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default DocumentUploadModal;
/////////////////////////////////////////////////
//////////////////////////////////////////// the upper is always true

// // src/components/DocumentUploadModal/DocumentUploadModal.jsx
// src/components/DocumentUploadModal/DocumentUploadModal.jsx

import React, { useState, useRef } from "react";
import { Modal, Button, Form, ProgressBar, Alert } from "react-bootstrap";
import { uploadDocument } from "../../services/documentService";

const DocumentUploadModal = ({
  show,
  handleClose,
  projectId,
  refreshDocuments,
}) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null); // Added success message state
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Validate file size (e.g., 10MB limit)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (e.target.files[0].size > MAX_FILE_SIZE) {
        setError("File size must be less than 10MB");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
      ];

      if (!allowedTypes.includes(e.target.files[0].type)) {
        setError("Only PDF, DOC, DOCX, JPEG, and PNG files are allowed");
        return;
      }

      setFile(e.target.files[0]);
      setError(null); // Clear any previous errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError(null);
    setSuccessMessage(null);

    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (description) {
      formData.append("description", description);
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      await uploadDocument(projectId, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      // Show success message
      setSuccessMessage("Document uploaded successfully!");

      // Refresh documents list
      if (refreshDocuments) {
        await refreshDocuments();
      }

      // Close modal after short delay to show success message
      setTimeout(() => {
        handleClose();
        resetForm();
      }, 1500);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to upload document. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setDescription("");
    setUploadProgress(0);
    setError(null);
    setSuccessMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Upload Document</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>File *</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={isUploading}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              required
            />
            <Form.Text className="text-muted">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
              placeholder="Enter a description for this document..."
            />
          </Form.Group>

          {isUploading && (
            <ProgressBar
              now={uploadProgress}
              label={`${uploadProgress}%`}
              animated
              className="mb-3"
              variant={uploadProgress === 100 ? "success" : "primary"}
            />
          )}

          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={handleModalClose}
              disabled={isUploading}
              className="me-2"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isUploading || !file}
            >
              {isUploading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DocumentUploadModal;
