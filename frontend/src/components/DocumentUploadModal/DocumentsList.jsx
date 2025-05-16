// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Button,
//   Spinner,
//   Alert,
//   OverlayTrigger,
//   Tooltip,
//   Badge,
//   Modal,
// } from "react-bootstrap";

// import {
//   getProjectDocuments,
//   downloadDocument,
//   deleteDocument,
// } from "../../services/documentService";
// import { formatFileSize, formatDate } from "../../utils/formatUtils";
// import DocumentUploadModal from "./DocumentUploadModal";

// const DocumentsList = ({ projectId, searchTerm }) => {
//   // Added searchTerm prop
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [documentToDelete, setDocumentToDelete] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   useEffect(() => {
//     fetchDocuments();
//   }, [projectId, searchTerm]); // Added searchTerm to dependencies

//   const fetchDocuments = async () => {
//     try {
//       setLoading(true);
//       const response = await getProjectDocuments(projectId);
//       // Filter documents based on search term if provided
//       const filteredDocs = searchTerm
//         ? response.data.filter(
//             (doc) =>
//               doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//               (doc.description &&
//                 doc.description
//                   .toLowerCase()
//                   .includes(searchTerm.toLowerCase()))
//           )
//         : response.data;
//       setDocuments(filteredDocs);
//       setError(null);
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to fetch documents");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async (documentId, fileName) => {
//     try {
//       const response = await downloadDocument(documentId);
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", fileName);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       setDocuments((docs) =>
//         docs.map((doc) =>
//           doc.id === documentId
//             ? { ...doc, download_count: doc.download_count + 1 }
//             : doc
//         )
//       );
//     } catch (err) {
//       setError("Failed to download file");
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteDocument(documentToDelete);
//       setDocuments((docs) => docs.filter((doc) => doc.id !== documentToDelete));
//       setShowDeleteModal(false);
//     } catch (err) {
//       setError("Failed to delete document");
//     }
//   };

//   const getFileTypeBadge = (fileType) => {
//     const typeMap = {
//       "application/pdf": { color: "danger", text: "PDF" },
//       "application/msword": { color: "primary", text: "DOC" },
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
//         { color: "primary", text: "DOCX" },
//       "image/jpeg": { color: "info", text: "JPEG" },
//       "image/png": { color: "info", text: "PNG" },
//     };

//     const typeInfo = typeMap[fileType] || {
//       color: "secondary",
//       text: fileType.split("/")[1]?.toUpperCase() || "FILE",
//     };

//     return <Badge bg={typeInfo.color}>{typeInfo.text}</Badge>;
//   };

//   if (loading) {
//     return (
//       <div className="text-center my-5">
//         <Spinner animation="border" />
//       </div>
//     );
//   }

//   if (error) {
//     return <Alert variant="danger">{error}</Alert>;
//   }

//   return (
//     <div>
//       <Table striped bordered hover responsive>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Type</th>
//             <th>Description</th> {/* Fixed header */}
//             <th>Uploaded</th>
//             <th>Downloads</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {documents.length === 0 ? (
//             <tr>
//               <td colSpan="6" className="text-center">
//                 No documents found
//               </td>
//             </tr>
//           ) : (
//             documents.map((doc) => (
//               <tr key={doc.id}>
//                 <td>{doc.name}</td>
//                 <td>{getFileTypeBadge(doc.file_type)}</td>
//                 <td>{doc.description || "-"}</td>{" "}
//                 {/* Fixed description display */}
//                 <td>{formatDate(doc.upload_date)}</td>
//                 <td>{doc.download_count}</td>
//                 <td>
//                   <div className="d-flex gap-2">
//                     <OverlayTrigger overlay={<Tooltip>Download</Tooltip>}>
//                       <Button
//                         variant="success"
//                         size="sm"
//                         onClick={() => handleDownload(doc.id, doc.name)}
//                       >
//                         <i className="bi bi-download"></i>
//                       </Button>
//                     </OverlayTrigger>

//                     <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
//                       <Button
//                         variant="danger"
//                         size="sm"
//                         onClick={() => {
//                           setDocumentToDelete(doc.id);
//                           setShowDeleteModal(true);
//                         }}
//                       >
//                         <i className="bi bi-trash"></i>
//                       </Button>
//                     </OverlayTrigger>
//                   </div>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </Table>

//       <DocumentUploadModal
//         show={showUploadModal}
//         handleClose={() => setShowUploadModal(false)}
//         projectId={projectId}
//         refreshDocuments={fetchDocuments} // This will refresh the list after upload
//       />

//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Delete</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to delete this document? This action cannot be
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

// export default DocumentsList;

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Spinner,
  Alert,
  OverlayTrigger,
  Tooltip,
  Badge,
  Modal,
} from "react-bootstrap";
import {
  getProjectDocuments,
  downloadDocument,
  deleteDocument,
} from "../../services/documentService";
import { formatDate } from "../../utils/formatUtils";
import DocumentUploadModal from "./DocumentUploadModal";
import "./DocumentsList.css";

const DocumentsList = ({ projectId, searchTerm }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [projectId, searchTerm]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await getProjectDocuments(projectId);
      // Filter documents based on search term if provided
      const filteredDocs = searchTerm
        ? response.data.filter(
            (doc) =>
              doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (doc.description &&
                doc.description
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()))
          )
        : response.data;
      setDocuments(filteredDocs);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const response = await downloadDocument(documentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setDocuments((docs) =>
        docs.map((doc) =>
          doc.id === documentId
            ? { ...doc, download_count: doc.download_count + 1 }
            : doc
        )
      );
    } catch (err) {
      setError("Failed to download file");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDocument(documentToDelete);
      setDocuments((docs) => docs.filter((doc) => doc.id !== documentToDelete));
      setShowDeleteModal(false);
    } catch (err) {
      setError("Failed to delete document");
    }
  };

  const getFileTypeBadge = (fileType) => {
    const typeMap = {
      "application/pdf": { color: "danger", text: "PDF" },
      "application/msword": { color: "primary", text: "DOC" },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        { color: "primary", text: "DOCX" },
      "image/jpeg": { color: "info", text: "JPEG" },
      "image/png": { color: "info", text: "PNG" },
    };

    const typeInfo = typeMap[fileType] || {
      color: "secondary",
      text: fileType.split("/")[1]?.toUpperCase() || "FILE",
    };

    return <Badge bg={typeInfo.color}>{typeInfo.text}</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="documents-list-container">
      <Table bordered hover responsive className="documents-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Uploaded</th>
            <th>Downloads</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-documents">
                No documents found
              </td>
            </tr>
          ) : (
            documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>{getFileTypeBadge(doc.file_type)}</td>
                <td>{doc.description || "-"}</td>
                <td>{formatDate(doc.upload_date)}</td>
                <td>{doc.download_count}</td>
                <td>
                  <div className="action-buttons">
                    <OverlayTrigger overlay={<Tooltip>Download</Tooltip>}>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleDownload(doc.id, doc.name)}
                        className="action-btn"
                      >
                        <i className="bi bi-download"></i>
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setDocumentToDelete(doc.id);
                          setShowDeleteModal(true);
                        }}
                        className="action-btn"
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </OverlayTrigger>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <DocumentUploadModal
        show={showUploadModal}
        handleClose={() => setShowUploadModal(false)}
        projectId={projectId}
        refreshDocuments={fetchDocuments}
      />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this document? This action cannot be
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

export default DocumentsList;
