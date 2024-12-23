import axios from "axios";
const API_BASE_URL = "http://localhost:8080/projectResources";
export const getAllProjectResources = () => {
  console.log("get all projects Resources are called!!");
  return axios.get(API_BASE_URL);
};
export const getProjectResourcesById = (id) => {
  console.log(`get projects Resources by id is called ??`);
  return axios.get(`${API_BASE_URL}/${id}`);
};
export const updateProjectResources = (id, projectData) => {
  return axios.put(`${API_BASE_URL}/${id}`, projectData);
};
export const deleteProjectResources = (id) => {
  return axios.delete(`${API_BASE_URL}/${id}`);
};
export const createProjectResources = (Resourcesdata) => {
  return axios.post(API_BASE_URL, Resourcesdata);
};
