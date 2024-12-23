import axios from "axios";
const API_BASE_URL = "http://localhost:8080/projects";
export const getAllProjects = () => {
  console.log("get all projects are called!!");
  return axios.get(API_BASE_URL);
};
export const getProjectsById = (id) => {
  console.log(`get project by id is called ??`);
  return axios.get(`${API_BASE_URL}/${id}`);
};
export const updateProjects = (id, projectData) => {
  return axios.put(`${API_BASE_URL}/${id}`, projectData);
};
export const deleteProjects = (id) => {
  return axios.delete(`${API_BASE_URL}/${id}`);
};
export const createProjects = (projectData) => {
  return axios.post(API_BASE_URL, projectData);
};
export const getProjectsExpenses = (projectId) => {
  console.log("get project expenses are called:");
  return axios.get(`http://localhost:8080/projects/${projectId}/expenses`);
};
export const countProjects = () => {
  console.log("count projects are called:");
  return axios.get("http://localhost:8080/count/projects");
};
export const completedProjects = () => {
  console.log("completed are called:");
  return axios.get("http://localhost:8080/completed/projects");
};
export const ongoingProjects = () => {
  console.log("ongoing are called:");
  return axios.get("http://localhost:8080/ongoing/projects");
};

export const pendingProjects = () => {
  console.log("pending are called:");
  return axios.get("http://localhost:8080/pending/projects");
};
