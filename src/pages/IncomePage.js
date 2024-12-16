import React, { useState, useEffect } from 'react';
import { getIncomes, createIncome, updateIncome, deleteIncome, getCategory, getCategories } from '../services/incomeService';
import Swal from 'sweetalert2';

const IncomePage = () => {
  const [loading, setLoading] = useState(true);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newIncome, setNewIncome] = useState({ id: '', category_id: '', amount: '' });
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

  // Fetch incomes and categories
  useEffect(() => {
    const fetchData = async () => {
      if (config?.headers?.Authorization) {
        setLoading(true);
        try {
          const [incomeResponse, categoryResponse] = await Promise.all([getIncomes(config), getCategories(config)]);

          if (incomeResponse.status && categoryResponse.status) {
            const incomesWithCategories = await Promise.all(
              incomeResponse.data.map(async (income) => {
                const category = await getCategory(income.category_id, config);
                const categoryName = category.data ? category.data.name : "?";
                return { ...income, category: categoryName };
              })
            );
            setIncomes(incomesWithCategories);
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

  const handleCreateIncome = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createIncome(newIncome, config);
      if (response.status) {
        const categoryName = categories.find((cat) => cat.id === Number(newIncome.category_id))?.name || 'Belirtilmedi';
        const updatedIncome = { ...newIncome, id: response.data.id, category: categoryName };
        setIncomes([...incomes, updatedIncome]);
        setNewIncome({ id: '', category_id: '', amount: '' });
        Swal.fire('Başarılı!', 'Gelir başarıyla oluşturuldu.', 'success');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.message || 'Gelir oluşturulurken bir hata oluştu.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditIncome = (income) => {
    setNewIncome({ id: income.id, category_id: income.category_id, amount: income.amount });
    setIsEditing(true);
  };

  const handleUpdateIncome = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateIncome(newIncome, config);
      if (response.status) {

        const categoryName = categories.find((cat) => cat.id === Number(newIncome.category_id))?.name || 'Belirtilmedi';
        const updatedIncome = { ...newIncome, id: newIncome.id, category: categoryName };
        const updatedIncomes = incomes.map((income) => {
          if (income.id === updatedIncome.id) {
            return { ...income, ...updatedIncome };
          }
          return income;
        });

        setIncomes(updatedIncomes);
        setNewIncome({ id: '', category_id: '', amount: '' });
        setIsEditing(false);
        Swal.fire('Başarılı!', 'Gelir başarıyla güncellendi.', 'success');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.message || 'Gelir güncellenirken bir hata oluştu.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIncome = async (income) => {
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
          const response = await deleteIncome({ id: income.id }, config);
          if (response.status) {
            setIncomes(incomes.filter((inc) => inc.id !== income.id));
            Swal.fire('Başarılı!', 'Gelir silindi.', 'success');
          } else {
            throw new Error('Gelir silinemedi.');
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Hata!',
            text: error.message || 'Gelir silinirken bir hata oluştu.',
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
      <h1>Gelirler</h1>

      {/* Income Form */}
      <form onSubmit={isEditing ? handleUpdateIncome : handleCreateIncome}>
        <div className="form-group">
          <label htmlFor="category_id">Kategori</label>
          <select
            id="category_id"
            className="form-control"
            value={newIncome.category_id}
            onChange={(e) => setNewIncome({ ...newIncome, category_id: e.target.value })}
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
            value={newIncome.amount}
            onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          {isEditing ? 'Güncelle' : 'Oluştur'}
        </button>
      </form>

      {/* Income List */}
      <h2 className="mt-4">Gelir Listesi</h2>
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
          {incomes.map((income) => {
            console.log(income); // Log the income object to the console
            return (
              <tr key={income.id}>
                <td>{income.id}</td>
                <td>{income.category}</td>
                <td>{income.amount} ₺</td>
                <td>
                  <button
                    className="btn btn-warning mr-2"
                    onClick={() => handleEditIncome(income)}
                  >
                    Düzenle
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteIncome(income)}
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

export default IncomePage;
