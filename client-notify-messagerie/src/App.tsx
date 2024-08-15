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
import TestPage from './pages/TestPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import NotFoundPage from './pages/NotFoundPage'
import Personnes from './components/personnes/Personnes'
import Layout from './components/layout/Layout'
import Archive from './components/archive/Archive'
import Settings from './components/settings/Settings'
import Home from './pages/Home'
import Demandes from './components/demandes/Demandes'
import Friends from './components/friends/Friends'
import UpdateProfile from './components/profile/Profile'
import DiscussionList from './components/discussion/DiscussionList'


const App: React.FC = () => {

  return (
<Router>
     <Layout>
      <Routes>
      <Route path="/" element={<Navigate to="/login"/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password-byPhoneNumber" element={<ResetPasswordByPhoneNumberPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/test" element={<ProtectedRoute element={<TestPage />} redirectPath="/login" />}  />
          <Route path="/verify-identity/:tokenEmail" element={<VerifyEmailPage />} />
          <Route path="/reset-password/:tokenEmail" element={<ResetPasswordFormPage />} />
          <Route path="/complete-profile" element={<ProtectedRoute element={<CompleteProfilePage />} redirectPath="/login" />} />
          <Route path="/reset-password-by-email" element={<ResetPasswordByEmail />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} redirectPath="/login" />} />
          <Route path="/personnes" element={<ProtectedRoute element={<Personnes />} redirectPath="/login" />} />
          <Route path="/discussions" element={<ProtectedRoute element={<DiscussionList />} redirectPath="/login" />} />
          <Route path="/archive" element={<ProtectedRoute element={<Archive />} redirectPath="/login" />} />
          <Route path="/settings" element={<ProtectedRoute element={<Settings />} redirectPath="/login" />} />
          <Route path="/demandes" element={<ProtectedRoute element={<Demandes />} redirectPath="/login" />} />
          <Route path="/friends" element={<ProtectedRoute element={<Friends />} redirectPath="/login" />} />
          <Route path="/profile" element={<ProtectedRoute element={<UpdateProfile />} redirectPath="/login" />} />
          <Route path="*" element={<NotFoundPage />} />
      </Routes>
     </Layout> 
    </Router>
)
}

export default App
