import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/expenseCategoryService';
import Swal from 'sweetalert2';

const ExpenseCategoryPage = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ id: '', name: '' });
    const [isEditing, setIsEditing] = useState(false);

    // Fetch categories
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [categoryResponse] = await Promise.all([getCategories()]);

                if (categoryResponse.status) {
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
        };

        fetchData();
    }, []);

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await createCategory(newCategory);
            console.log(response)
            if (response && response.status) {
                const updatedCategory = { ...newCategory, id: response.data.id };
                setCategories([...categories, updatedCategory]);
                setNewCategory({ id: '', name: '' });
                Swal.fire('Başarılı!', 'Kategori başarıyla oluşturuldu.', 'success');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Hata!',
                    text: response?.message || 'Kategori oluşturulurken bir hata oluştu.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Hata!',
                text: error.response?.message || 'Kategori oluşturulurken bir hata oluştu.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEditCategory = (category) => {
        setNewCategory({ id: category.id, name: category.name });
        setIsEditing(true);
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await updateCategory(newCategory);
            if (response.status) {
                const updatedCategories = categories.map((category) => {
                    if (category.id === newCategory.id) {
                        return { ...category, ...newCategory };
                    }
                    return category;
                });

                setCategories(updatedCategories);
                setNewCategory({ id: '', name: '' });
                setIsEditing(false);
                Swal.fire('Başarılı!', 'Kategori başarıyla güncellendi.', 'success');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Hata!',
                    text: response?.message || 'Kategori oluşturulurken bir hata oluştu.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Hata!',
                text: error.response?.message || 'Kategori güncellenirken bir hata oluştu.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (category) => {
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
                    const response = await deleteCategory({ id: category.id });
                    if (response.status) {
                        setCategories(categories.filter((inc) => inc.id !== category.id));
                        Swal.fire('Başarılı!', 'Kategori silindi.', 'success');
                    } else {
                        throw new Error('Kategori silinemedi.');
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hata!',
                        text: error.message || 'Kategori silinirken bir hata oluştu.',
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
            <h1>Gider Kategorileri</h1>

            {/* Category Form */}
            <form onSubmit={isEditing ? handleUpdateCategory : handleCreateCategory}>
                <div className="form-group">
                    <label htmlFor="name">İsim</label>
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-2">
                    {isEditing ? 'Güncelle' : 'Oluştur'}
                </button>
            </form>

            {/* Category List */}
            <h2 className="mt-4">Gider Kategorisi Listesi</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>İsim</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => {
                        return (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>
                                    <button
                                        className="btn btn-warning mr-2"
                                        onClick={() => handleEditCategory(category)}
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteCategory(category)}
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

export default ExpenseCategoryPage;
