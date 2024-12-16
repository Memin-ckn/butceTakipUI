import axios from 'axios';

const API_URL = 'http://localhost:5000/expenses/';
const CATEGORY_API_URL = 'http://localhost:5000/expense-categories/';

const token = localStorage.getItem('token');
const config = token
  ? {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  : { headers: { 'Content-Type': 'application/json' } };

// Fetch all expenses
export const getExpenses = async () => {
  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    handleError('Giderleri çekerken bir hata meydana geldi!', error);
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

// Create a new expense
export const createExpense = async (expenseData) => {
  try {
    const response = await axios.post(API_URL, expenseData, config);
    return response.data;
  } catch (error) {
    handleError('Gider oluşturulurken bir hata meydana geldi!', error);
    return error.response.data;
  }
};

// Update an existing expense
export const updateExpense = async (expenseData) => {
  try {
    const response = await axios.put(API_URL, expenseData, config);
    return response.data;
  } catch (error) {
    handleError('Gider güncellenirken bir hata meydana geldi!', error);
    return error.response.data;
  }
};

// Delete an expense
export const deleteExpense = async (expenseData) => {
  try {
    const response = await axios.delete(API_URL, {
      data: expenseData,
      ...config,
    });
    return response.data;
  } catch (error) {
    handleError('Gider silinirken bir hata meydana geldi!', error);
    return error.response.data;
  }
};

// Centralized error handler
const handleError = (message, error) => {
  console.error(message, error.response?.data || error.message);
};
