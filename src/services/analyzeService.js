import axios from 'axios';

const API_URL = 'http://localhost:5000/analyze/';

const token = localStorage.getItem('token');
const config = token
    ? {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }
    : { headers: { 'Content-Type': 'application/json' } };

export const getTotal = async () => {
    try {
        const response = await axios.get(API_URL, config);
        return response.data;
    } catch (error) {
        handleError('Toplamları çekerken bir hata meydana geldi!', error);
        return error.response.data;
    }
};

export const getTotalWithCategory = async () => {
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