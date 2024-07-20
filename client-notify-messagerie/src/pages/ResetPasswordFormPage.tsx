import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import '../index.css'
import LoadingSpinner from '../components/common/LoadingPage'
import validatorsService from '../services/validatorsService'
import { resetPassword } from '../store/resetPasswordByPhoneSlice'
import { resetPasswordByEmail } from '../store/resetPasswordByEmailSlice'

const ResetPasswordByPhoneNumberPage: React.FC = () => {

  const [formData, setFormData] = useState({
    password: '',
    repeatedPassword: '',
  })
  const [errors, setErrors] = useState({
    password: false,
    repeatedPassword: false,
  })
  
  const { tokenEmail } = useParams<{ tokenEmail: string }>()

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { isLoading: isLoading } = useAppSelector((state) => state.resetPasswordByEmail)
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true)

  useEffect(() => {
    console.log('Reset Password component mounted')
    const timeout = setTimeout(() => {
      setIsLoadingPage(false)
    }, 150)
    return () => clearTimeout(timeout)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }


  const handleResetPassword = async () => {

    const { password, repeatedPassword } = formData

    if (!validatorsService.isValidPassword(password)) {
      toast.error('Use at least one uppercase letter, lowercase letter, digit and special character')
      setErrors((prevErrors) => ({ ...prevErrors, password: true }))
      return
    }

    if (password !== repeatedPassword) {
      toast.error('Passwords do not match')
      setErrors((prevErrors) => ({ ...prevErrors, repeatedPassword: true }))
      return
    }

    if (!tokenEmail) {
      toast.error('Invalid token')
      return
    }
    try {
      const resultAction = await dispatch(resetPasswordByEmail({ tokenEmail, password }))
      console.log(tokenEmail, password)
      if (resetPassword.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload)
        navigate('/login')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('An unexpected error occurred.')
    }

  }

  if (isLoadingPage) {
    return (
      <> <LoadingSpinner /> </>
    )
  }

  const { password, repeatedPassword } = formData
  const { password: errorPassword, repeatedPassword: errorRepeatedPassword } = errors


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md dark:bg-gray-900">
        <h2 className="text-2xl font-bold mb-4">Reset password</h2>
        <div className="mt-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">Password</label>
            <Input
              type='password'
              value={password}
              name='password'
              onChange={handleInputChange}
              placeholder='Password'
              error={errorPassword}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-1">Re-enter password</label>
            <Input
              type='password'
              name='repeatedPassword'
              value={repeatedPassword}
              onChange={handleInputChange}
              placeholder='Password'
              error={errorRepeatedPassword}
            />
          </div>
          <div className="flex justify-center">
            <Button
              text='Reset Password'
              onClick={handleResetPassword}
              className='bg-blue-400 font-articulatThin text-white hover:bg-blue-600 hover:text-black'
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default ResetPasswordByPhoneNumberPage
