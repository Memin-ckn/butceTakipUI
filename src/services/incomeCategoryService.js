import axios from 'axios';

const API_URL = 'http://localhost:5000/income-categories/';

const token = localStorage.getItem('token');
const config = token
  ? {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  : { headers: { 'Content-Type': 'application/json' } };

// Fetch a single category by ID
export const getCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}get?id=${categoryId}`, config);
    return response.data;
  } catch (error) {
    handleError('Kategori bilgisi alınırken bir hata meydana geldi!', error);
    return error.response.data;
  }
};

// Fetch all categories
export const getCategories = async () => {
  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    handleError('Kategorileri çekerken bir hata meydana geldi!', error);
    return error.response.data;
  }
};

// Create a new category
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(API_URL, categoryData, config);
    return response.data;
  } catch (error) {
    handleError('Kategori oluşturulurken bir hata meydana geldi!', error);
    return error.response.data;
  }
};

// Update an existing category
export const updateCategory = async (categoryData) => {
  try {
    const response = await axios.put(API_URL, categoryData, config);
    return response.data;
  } catch (error) {
    handleError('Kategori güncellenirken bir hata meydana geldi!', error);
    return error.response.data;
  }
};

// Delete an category
export const deleteCategory = async (categoryData) => {
  try {
    const response = await axios.delete(API_URL, {
      data: categoryData,
      ...config,
    });
    return response.data;
  } catch (error) {
    handleError('Kategori silinirken bir hata meydana geldi!', error);
    return error.response.data;
  }
};

// Centralized error handler
const handleError = (message, error) => {
  console.error(message, error.response?.data || error.message);
};
