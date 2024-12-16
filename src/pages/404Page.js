import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">404 - Sayfa Bulunmadı</h2>
        <p className="text-center">Üzgünüz, ulaşmaya çalıştığınız yafayı bulamadık.</p>
        <button
          className="btn btn-primary w-100"
          onClick={() => navigate('/')}
        >
          Anasayfaya Dön
        </button>
      </div>
    </div>
  );
};

export default NotFound;