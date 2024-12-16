import axios from 'axios';
import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5001/analyze/';

export const getTotal = async (config) => {
    try {
        const response = await axios.get(API_URL, config);
        return response.data;
    } catch (error) {
        handleError('Toplamları çekerken bir hata meydana geldi!', error);
        return error.response.data;
    }
};

export const getTotalWithCategory = async (config) => {
    try {
        const response = await axios.get(`${API_URL}total-with-category`, config);
        return response.data;
    } catch (error) {
        handleError('Toplamları çekerken bir hata meydana geldi!', error);
        return error.response.data;
    }
};

// Centralized error handler
const handleError = (message, error) => {
  console.error(message, error.response?.data || error.message);
};