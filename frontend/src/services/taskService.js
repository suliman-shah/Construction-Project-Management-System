import axios from "axios";
const API_BASE_URL = "http://localhost:8080/task";
export const getAllTask = () => {
  return axios.get(API_BASE_URL);
};
export const getTaskById = (id) => {
  console.log(`get task by id ${id} : triggered??`);
  return axios.get(`${API_BASE_URL}/${id}`);
};
export const updateTask = (id, taskData) => {
  return axios.put(`${API_BASE_URL}/${id}`, taskData);
};
export const deleteTask = (id) => {
  console.log("delete services is triggered??");
  return axios.delete(`${API_BASE_URL}/${id}`);
};
export const createTask = (taskdata) => {
  return axios.post(API_BASE_URL, taskdata);
};
