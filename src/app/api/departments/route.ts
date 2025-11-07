// src/api/departments.js
import axios from "axios";
import { Department } from "@/types/Department";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/departments`;

export const getDepartments = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const getDepartment = async (id: any) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};

export const createDepartment = async (
    data: Omit<Department, "id">
): Promise<Department> => {
    const res = await axios.post(API_URL, data);
    return res.data;
};

export const updateDepartment = async (id: any, data: any) => {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
};

export const deleteDepartment = async (id: any) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};
