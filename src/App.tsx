import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import RegisterPage from './pages/RegisterPage'
import OtpPage from './pages/OtpPage'
import SetPasswordPage from './pages/SetPasswordPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import DocumentsListPage from './pages/DocumentsListPage'
import DocumentDetailPage from './pages/DocumentDetailPage'
import CreateDocumentPage from './pages/CreateDocumentPage'
import DraftsPage from './pages/DraftsPage'
import ImportExcelPage from './pages/ImportExcelPage'
import BillingPage from './pages/BillingPage'
import ProductsPage from './pages/ProductsPage'
import AddCardPage from './pages/AddCardPage'
import TopUpBalancePage from './pages/TopUpBalancePage'
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
          <Route path="/documents/view/:id" element={<DocumentDetailPage />} />
          <Route path="/documents/drafts" element={<DraftsPage />} />
          <Route path="/documents/create" element={<CreateDocumentPage />} />
          <Route path="/documents/import" element={<ImportExcelPage />} />
          <Route path="/tariffs" element={<BillingPage />} />
          <Route path="/tariffs/add-card" element={<AddCardPage />} />
          <Route path="/tariffs/topup" element={<TopUpBalancePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/support" element={<PlaceholderPage title="Support" />} />
          <Route path="/profile" element={<PlaceholderPage title="Профиль" />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
