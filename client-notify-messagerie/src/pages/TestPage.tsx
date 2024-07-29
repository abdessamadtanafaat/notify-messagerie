import { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { User } from '../interfaces'
import UploadFileComponent from '../components/common/UploadFileComponent'
import { useAuth } from '../contexte/AuthContext'


const TestPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  // const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)


  const { isAuthenticated, user, loading } = useAuth()
  
  useEffect(() => {
    console.log('AuthTest values:', { isAuthenticated, user, loading })
  }, [isAuthenticated, user, loading])
  

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/User')
        console.log(response.data)
        setUsers(response.data)
      } catch (error) {
        setError('Failed to fetch users')
      }
    }

    fetchUsers()
  }, [])

  return (
    <div>
      <h1>Users</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.firstName}</li>
        ))}
      </ul>
      <UploadFileComponent/>
    </div>
  )
}

export default TestPage
