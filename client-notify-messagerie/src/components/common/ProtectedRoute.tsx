import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexte/AuthContext'
import LoadingSpinner from './LoadingPage'

interface ProtectedRouteProps {
  element: React.ReactElement;
  redirectPath: string; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, redirectPath }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <> <LoadingSpinner /> </>
    )
  }

  return isAuthenticated ? element : <Navigate to={redirectPath} />
}

export default ProtectedRoute
