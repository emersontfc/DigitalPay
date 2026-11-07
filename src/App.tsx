import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { HomePage } from './pages/public/HomePage';
import { SalesPage } from './pages/public/SalesPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { LoginPage } from './pages/auth/LoginPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Vitrine pública geral */}
          <Route path="/" element={<HomePage />} />

          {/* Autenticação: Login e Cadastro */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />

          {/* Painel Administrativo Protegido (Requer Login) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Páginas de vendas públicas com URLs amigáveis */}
          <Route path="/p/:slug" element={<SalesPage />} />

          {/* Redirecionamentos de conveniência */}
          <Route path="/painel" element={<Navigate to="/admin" replace />} />
          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/ai-builder/*" element={<Navigate to="/admin" replace />} />
          <Route path="/ai-builder" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
