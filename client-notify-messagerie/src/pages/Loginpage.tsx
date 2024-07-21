import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { login } from '../store/authSlice'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import image from '../assets/image.jpg'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import '../index.css'
import LoadingSpinner from '../components/common/LoadingPage'

/**
 * LoginPage component handles user login functionality.
 * Displays a login form, validates user input, and manages authentication state.
 */
const LoginPage: React.FC = () => {
  // Component state
  const [formData, setFormData] = useState({
    emailOrPhoneNumber: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    email: false,
    password: false
  })
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Redux state
  const { isLoading: isAuthLoading } = useAppSelector((state) => state.auth)

  // Component local state
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true)


  // Effects
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoadingPage(false)
    }, 150)
    return () => clearTimeout(timeout) // Cleanup on unmount
  },)


  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleLogin = async () => {
    const { emailOrPhoneNumber, password } = formData

    try {
      const resultAction = await dispatch(login({ emailOrPhoneNumber, password }))

      if (login.fulfilled.match(resultAction)) {
        localStorage.setItem('token', resultAction.payload.token)
        console.log(resultAction.payload)
        if (resultAction.payload.isFirstTimeLogin) {
          navigate('/complete-profile')
        } else {
          navigate('/messages')
        }
      } else {
        if (resultAction.payload) {
          const { error } = resultAction.payload

          toast.error(error)

          if (error.includes('Invalid Password')) {
            setErrors((prevErrors) => ({ ...prevErrors, password: true }))
          }

          if (error.includes('Invalid Email') || error.includes('Invalid phone number')) {
            setErrors((prevErrors) => ({ ...prevErrors, email: true }))
          }
        } else {
          console.error('Login failed:', resultAction.error.message)
          toast.error('Wrong credentials')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An unexpected error occurred during login.')
    }
  }

  // Render loading spinner until page is loaded
  if (isLoadingPage) {
    return (
      <> <LoadingSpinner /> </>
    )
  }

  // Destructure form data and errors for easier usage
  const { emailOrPhoneNumber, password } = formData
  const { email: errorEmail, password: errorPassword } = errors

  // Render login form
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800' >
      <div className='relative flex flex-col m-6 space-y-8 bg-white  dark:bg-gray-900 shadow-2xl rounded-2xl md:flex-row md:space-y-0'>
        <div className='flex flex-col justify-center p-8 md:p-14'>
          <span className='mb-3 text-title font-articulatBold dark:text-white'>Sign in</span>
          <div className='text-center text-gray-400'>
            Don't have an account ?{' '}
            <Link
             to='/register'
             className='text-primary  hover:text-blue-600'>
              Sign up
            </Link>
          </div>
          <div className='py-4'>
            <Input
              type='text'
              name='emailOrPhoneNumber'
              value={emailOrPhoneNumber}
              onChange={handleInputChange}
              placeholder='Email or phone number'
              error={errorEmail}
            />
          </div>
          <div className='py-4'>
            <Input
              type='password'
              name='password'
              value={password}
              onChange={handleInputChange}
              placeholder='Password'
              onEnterPress={handleLogin}
              error={errorPassword}
            />
          </div>
          <div className='flex justify-between w-full py-4'>
            <Link
            to='/reset-password-byPhoneNumber'
            className='text-primary hover:text-blue-600'
            >
            Forgotten password ?
            </Link>
          </div>
          <Button
            text='Sign in'
            onClick={handleLogin}
            className='bg-blue-400 font-articulatThin text-white hover:bg-blue-600 hover:text-black'
            loading={isAuthLoading}
          />
        </div>
        <div className='relative'>
          <img src={image} alt='image' className='w-[400px] h-full hidden rounded-r-2xl md:block object-cover' />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
