// // src/services/documentService.js

// import axios from "../api/axios";
// const API_BASE_URL = "/documents";

// export const uploadDocument = (projectId, formData) => {
//   return axios.post(
//     `${API_BASE_URL}/projects/${projectId}/documents`,
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );
// };

// export const getProjectDocuments = (projectId) => {
//   return axios.get(`${API_BASE_URL}/projects/${projectId}/documents`);
// };

// export const downloadDocument = (documentId) => {
//   return axios.get(`${API_BASE_URL}/${documentId}/download`, {
//     responseType: "blob",
//   });
// };

// export const deleteDocument = (documentId) => {
//   return axios.delete(`${API_BASE_URL}/${documentId}`);
// };
// src/services/documentService.js

import axios from "../api/axios";
const API_BASE_URL = ""; // Remove "/documents" from here since backend routes don't have this prefix

export const uploadDocument = (projectId, formData) => {
  return axios.post(
    `/projects/${projectId}/documents`, // Changed to match backend
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getProjectDocuments = (projectId) => {
  return axios.get(`/projects/${projectId}/documents`); // Changed to match backend
};

export const downloadDocument = (documentId) => {
  return axios.get(`/documents/${documentId}/download`, {
    // This matches backend
    responseType: "blob",
  });
};

export const deleteDocument = (documentId) => {
  return axios.delete(`/documents/${documentId}`); // This matches backend
};
