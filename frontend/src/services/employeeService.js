import axios from "../api/axios";

const API_BASE_URL = `/employees`;

export const getAllEmployees = () => {
  console.log(" getAllEmployees are called !!");
  return axios.get(API_BASE_URL);
};

export const getEmployeeById = (id) => {
  return axios.get(`${API_BASE_URL}/${id}`);
};

export const createEmployee = (employeeData) => {
  console.log("create employees has called!!");
  return axios.post(API_BASE_URL, employeeData);
};

export const updateEmployee = (id, employeeData) => {
  return axios.put(`${API_BASE_URL}/${id}`, employeeData);
};

export const deleteEmployee = (id) => {
  return axios.delete(`${API_BASE_URL}/${id}`);
};
