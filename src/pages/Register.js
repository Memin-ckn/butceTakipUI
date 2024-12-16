import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
  const [username, setUsename] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:5001/auth/register', {
        username,
        password,
      });

      console.log(response)

      if (response.data.status === true) {

        Swal.fire({
          icon: 'success',
          title: 'Kayıt başarılı!',
          text: 'Giriş ektanına yönlendirileceksiniz.',
        });

        navigate('/');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Kayıt başarısız!',
          text: response.data.message || 'Veri hatası',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Beklenmedik bir hata meydana geldi!',
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '350px' }}>
        <h2 className="text-center mb-4">Kayıt Ol</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Kullanıcı adı</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsename(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Şifre</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">Kayıt</button>
        </form>
        <div className="text-center">
          <p className="mb-0">Zaten bir hesabınız var mı?</p>
          <a href="/login" className="btn btn-link text-decoration-none">
            Giriş Yapın
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
