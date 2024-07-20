import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
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
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import Messages from './pages/Messages'

const App: React.FC = () => {

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  return (

    <Router>
     <Layout>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? '/messages' : '/login'}/>}/>
        <Route path="/login" element={isAuthenticated ? <Navigate to='/messages'/> : <LoginPage />} />
        <Route path="/reset-password-byPhoneNumber" element={<ResetPasswordByPhoneNumberPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-identity/:tokenEmail" element={<VerifyEmailPage />} />
        <Route path="/reset-password/:tokenEmail" element={<ResetPasswordFormPage />} />
        <Route path="/complete-profile/" element={<CompleteProfilePage />} />
        <Route path="/reset-password-by-email/" element={<ResetPasswordByEmail />} />
        <Route path="/messages" element={isAuthenticated ? <Messages/> : <Navigate to="/login"/>} />
      </Routes>
     </Layout> 
    </Router>
)
}

export default App
