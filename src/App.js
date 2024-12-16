import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import IncomePage from './pages/IncomePage'
import IncomeCategoryPage from './pages/IncomeCategoryPage';
import ExpensePage from './pages/ExpensePage';
import ExpenseCategoryPage from './pages/ExpenseCategoryPage';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/404Page';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Home />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/income" element={
        <ProtectedRoute>
          <Layout>
            <IncomePage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/income-category" element={
        <ProtectedRoute>
          <Layout>
            <IncomeCategoryPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/expense" element={
        <ProtectedRoute>
          <Layout>
            <ExpensePage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/expense-category" element={
        <ProtectedRoute>
          <Layout>
            <ExpenseCategoryPage />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Tanımlanmamış sayfaları yakalama */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
