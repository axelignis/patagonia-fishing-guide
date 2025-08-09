import axios from 'axios';
import { Guide, Service } from '../types';

const API_BASE_URL = 'https://api.patagoniafishing.com';

export const fetchGuides = async (): Promise<Guide[]> => {
    const response = await axios.get(`${API_BASE_URL}/guides`);
    return response.data;
};

export const fetchServices = async (): Promise<Service[]> => {
    const response = await axios.get(`${API_BASE_URL}/services`);
    return response.data;
};