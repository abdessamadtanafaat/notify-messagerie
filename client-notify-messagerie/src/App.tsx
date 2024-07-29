import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Loginpage'
import RegisterPage from './pages/RegisterPage'
import 'react-toastify/dist/ReactToastify.css'
import './index.css' // Your global styles
import VerifyEmailPage from './pages/VerifyEmailPage'
import CompleteProfilePage from './pages/CompleteProfilePage'
import ResetPasswordByEmail from './pages/ResetPasswordByEmailPage'
import ResetPasswordFormPage from './pages/ResetPasswordFormPage'
import ResetPasswordByPhoneNumberPage from './pages/ResetPasswordByPhoneNumberPage'
import Layout from './components/layout/layout'
import Messages from './pages/Messages'
import TestPage from './pages/TestPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import NotFoundPage from './pages/NotFoundPage'
// import { useAppDispatch } from './hooks/reduxHooks'
// import { getUserInfo } from './store/userSlice'

const App: React.FC = () => {

  return (

    <Router>
     <Layout>
      <Routes>
      <Route path="/" element={<ProtectedRoute element={<Messages />} redirectPath="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password-byPhoneNumber" element={<ResetPasswordByPhoneNumberPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/test" element={<ProtectedRoute element={<TestPage />} redirectPath="/login" />}  />
          <Route path="/verify-identity/:tokenEmail" element={<VerifyEmailPage />} />
          <Route path="/reset-password/:tokenEmail" element={<ResetPasswordFormPage />} />
          <Route path="/complete-profile" element={<ProtectedRoute element={<CompleteProfilePage />} redirectPath="/login" />} />
          <Route path="/reset-password-by-email" element={<ResetPasswordByEmail />} />
          <Route path="/messages" element={<ProtectedRoute element={<Messages />} redirectPath="/login" />} />
          <Route path="*" element={<NotFoundPage />} />
      </Routes>
     </Layout> 
    </Router>
)
}

export default App
