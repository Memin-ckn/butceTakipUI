import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Login = () => {
  const [username, setUsename] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/login', {
        username,
        password,
      });

      console.log(response)

      if (response.data.status === true && response.data.token) {
        localStorage.setItem('token', response.data.token);

        Swal.fire({
          icon: 'success',
          title: 'Giriş başarılı!',
          text: 'Gelir yönetim paneline yönlendirileceksiniz.',
        });

        navigate('/');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Giriş başarısız!',
          text: response.data.message || 'Kullanıcı adı veya şifre hatalı!',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.response?.data?.message || 'Beklenmedik bir hata meydana geldi!',
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '350px' }}>
        <h2 className="text-center mb-4">Giriş Yap</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn btn-primary w-100">Giriş</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
