import React, { useState, useEffect } from 'react';
import { getExpenses, createExpense, updateExpense, deleteExpense, getCategory, getCategories } from '../services/expenseService';
import Swal from 'sweetalert2';

const ExpensePage = () => {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newExpense, setNewExpense] = useState({ id: '', category_id: '', amount: '' });
  const [isEditing, setIsEditing] = useState(false);

  const [token, setToken] = useState('');
  const [config, setConfig] = useState({ headers: { 'Content-Type': 'application/json' } });

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      setToken(t);
    }
  }, []);

  useEffect(() => {
    if (token) {
      setConfig({
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  }, [token]);

  // Fetch expenses and categories
  useEffect(() => {
    const fetchData = async () => {
      if (config?.headers?.Authorization) {
        setLoading(true);
        try {
          const [expenseResponse, categoryResponse] = await Promise.all([getExpenses(config), getCategories(config)]);

          if (expenseResponse.status && categoryResponse.status) {
            const expensesWithCategories = await Promise.all(
              expenseResponse.data.map(async (expense) => {
                const category = await getCategory(expense.category_id, config);
                const categoryName = category.data ? category.data.name : "?";
                return { ...expense, category: categoryName };
              })
            );
            setExpenses(expensesWithCategories);
            setCategories(categoryResponse.data);
          } else {
            throw new Error('Veriler alınamadı.');
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Hata!',
            text: 'Veriler alınırken bir hata oluştu!',
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [config]);

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createExpense(newExpense, config);
      if (response.status) {
        const categoryName = categories.find((cat) => cat.id === Number(newExpense.category_id))?.name || 'Belirtilmedi';
        const updatedExpense = { ...newExpense, id: response.data.id, category: categoryName };
        setExpenses([...expenses, updatedExpense]);
        setNewExpense({ id: '', category_id: '', amount: '' });
        Swal.fire('Başarılı!', 'Gider başarıyla oluşturuldu.', 'success');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.message || 'Gider oluşturulurken bir hata oluştu.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpense = (expense) => {
    setNewExpense({ id: expense.id, category_id: expense.category_id, amount: expense.amount });
    setIsEditing(true);
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateExpense(newExpense, config);
      if (response.status) {

        const categoryName = categories.find((cat) => cat.id === Number(newExpense.category_id))?.name || 'Belirtilmedi';
        const updatedExpense = { ...newExpense, id: newExpense.id, category: categoryName };
        const updatedExpenses = expenses.map((expense) => {
          if (expense.id === updatedExpense.id) {
            return { ...expense, ...updatedExpense };
          }
          return expense;
        });

        setExpenses(updatedExpenses);
        setNewExpense({ id: '', category_id: '', amount: '' });
        setIsEditing(false);
        Swal.fire('Başarılı!', 'Gider başarıyla güncellendi.', 'success');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.message || 'Gider güncellenirken bir hata oluştu.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (expense) => {
    Swal.fire({
      title: 'Emin misiniz?',
      text: 'Bu işlem geri alınamaz!',
      showCancelButton: true,
      confirmButtonText: 'Evet',
      cancelButtonText: 'Vazgeç',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const response = await deleteExpense({ id: expense.id }, config);
          if (response.status) {
            setExpenses(expenses.filter((inc) => inc.id !== expense.id));
            Swal.fire('Başarılı!', 'Gider silindi.', 'success');
          } else {
            throw new Error('Gider silinemedi.');
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Hata!',
            text: error.message || 'Gider silinirken bir hata oluştu.',
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="container">
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
          style={{ zIndex: 1050 }}
        >
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <h1>Giderler</h1>

      {/* Expense Form */}
      <form onSubmit={isEditing ? handleUpdateExpense : handleCreateExpense}>
        <div className="form-group">
          <label htmlFor="category_id">Kategori</label>
          <select
            id="category_id"
            className="form-control"
            value={newExpense.category_id}
            onChange={(e) => setNewExpense({ ...newExpense, category_id: e.target.value })}
            required
          >
            <option value="">Kategori Seçin</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Miktar</label>
          <input
            type="number"
            id="amount"
            className="form-control"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          {isEditing ? 'Güncelle' : 'Oluştur'}
        </button>
      </form>

      {/* Expense List */}
      <h2 className="mt-4">Gider Listesi</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Kategori</th>
            <th>Miktar</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => {
            console.log(expense); // Log the expense object to the console
            return (
              <tr key={expense.id}>
                <td>{expense.id}</td>
                <td>{expense.category}</td>
                <td>{expense.amount} ₺</td>
                <td>
                  <button
                    className="btn btn-warning mr-2"
                    onClick={() => handleEditExpense(expense)}
                  >
                    Düzenle
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteExpense(expense)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensePage;
