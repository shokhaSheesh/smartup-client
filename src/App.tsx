import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import OtpPage from './pages/OtpPage'
import SetPasswordPage from './pages/SetPasswordPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/otp" element={<OtpPage />} />
        <Route path="/register/credentials" element={<SetPasswordPage />} />
        {/* Upcoming auth routes: /login */}
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
