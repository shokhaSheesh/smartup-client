import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import RegisterPage from './pages/RegisterPage'
import OtpPage from './pages/OtpPage'
import SetPasswordPage from './pages/SetPasswordPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import DocumentsListPage from './pages/DocumentsListPage'
import PlaceholderPage from './pages/PlaceholderPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/otp" element={<OtpPage />} />
        <Route path="/register/credentials" element={<SetPasswordPage />} />

        {/* App shell */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents/incoming" element={<DocumentsListPage direction="incoming" />} />
          <Route path="/documents/outgoing" element={<DocumentsListPage direction="outgoing" />} />
          <Route path="/documents/drafts" element={<PlaceholderPage title="Черновики" />} />
          <Route path="/documents/create" element={<PlaceholderPage title="Создать документ" />} />
          <Route path="/documents/import" element={<PlaceholderPage title="Импорт Excel" />} />
          <Route path="/tariffs" element={<PlaceholderPage title="Тарифы" />} />
          <Route path="/products" element={<PlaceholderPage title="Товар и услуги" />} />
          <Route path="/support" element={<PlaceholderPage title="Support" />} />
          <Route path="/profile" element={<PlaceholderPage title="Профиль" />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
