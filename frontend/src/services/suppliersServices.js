import axios from "axios";
const API_BASE_URL = `/suppliers`;
export const getAllSuppliers = () => {
  console.log("get all suppliers are called !!");
  return axios.get(API_BASE_URL);
};
export const getSuppliersById = (id) => {
  console.log(`get suppliers by id is called ??`);
  return axios.get(`${API_BASE_URL}/${id}`);
};
export const updateSupplier = (id, suppliersData) => {
  console.log(`suppliers update are called ??`);
  return axios.put(`${API_BASE_URL}/${id}`, suppliersData);
};
export const deleteSuppliers = (id) => {
  return axios.delete(`${API_BASE_URL}/${id}`);
};
export const createSuppliers = (suppliersData) => {
  return axios.post(API_BASE_URL, suppliersData);
};
