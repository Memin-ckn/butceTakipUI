import axios from 'axios';

const API_URL = 'http://localhost:5001/incomes/';
const CATEGORY_API_URL = 'http://localhost:5001/income-categories/';

const token = localStorage.getItem('token');
const config = token
  ? {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  : { headers: { 'Content-Type': 'application/json' } };

// Fetch all incomes
export const getIncomes = async () => {
  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    handleError('Gelirleri çekerken bir hata meydana geldi!', error);
    return error.response.data;
  }
};

// Fetch a single category by ID
export const getCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${CATEGORY_API_URL}get?id=${categoryId}`, config);
    return response.data;
  } catch (error) {
    handleError('Kategori bilgisi alınırken bir hata meydana geldi!', error);
    return error.response.data;
  }
};

// Fetch all categories
export const getCategories = async () => {
  try {
    const response = await axios.get(CATEGORY_API_URL, config);
    return response.data;
  } catch (error) {
    handleError('Kategorileri çekerken bir hata meydana geldi!', error);
    return error.response.data;
  }
};

// Create a new income
export const createIncome = async (incomeData) => {
  try {
    const response = await axios.post(API_URL, incomeData, config);
    return response.data;
  } catch (error) {
    handleError('Gelir oluşturulurken bir hata meydana geldi!', error);
    return error.response.data;
  }
};

// Update an existing income
export const updateIncome = async (incomeData) => {
  try {
    const response = await axios.put(API_URL, incomeData, config);
    return response.data;
  } catch (error) {
    handleError('Gelir güncellenirken bir hata meydana geldi!', error);
    return error.response.data;
  }
};

// Delete an income
export const deleteIncome = async (incomeData) => {
  try {
    const response = await axios.delete(API_URL, {
      data: incomeData,
      ...config,
    });
    return response.data;
  } catch (error) {
    handleError('Gelir silinirken bir hata meydana geldi!', error);
    return error.response.data;
  }
};

// Centralized error handler
const handleError = (message, error) => {
  console.error(message, error.response?.data || error.message);
};
