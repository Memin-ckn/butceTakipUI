import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');

        navigate('/login');
    };

    console.log({
        token: localStorage.getItem('token'),
    })
    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Bütçe Takip</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Anasayfa</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/income">Gelirler</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/expense">Giderler</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/income-category">Gelir Kategorileri</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/expense-category">Gider Kategorileri</Link>
                            </li>
                        </ul>
                    </div>
                    <button
                        className="btn btn-outline-danger ms-auto"
                        onClick={handleLogout}
                    >
                        Çıkış Yap
                    </button>
                </div>
            </nav>

            {/* Page content */}
            <div className="container mt-4">
                {children}
            </div>
        </div>
    );
};

export default Layout;
