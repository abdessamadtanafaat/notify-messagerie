import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import '../index.css'
import LoadingSpinner from '../components/common/LoadingPage'
import { resetPasswordBySms, verifyPhone } from '../store/sendSmsSlice'
import validatorsService from '../services/validatorsService'
import { resetPassword } from '../store/resetPasswordByPhoneSlice'

const ResetPasswordByPhoneNumberPage: React.FC = () => {

  const [formData, setFormData] = useState({
    enteredphoneNumber: '',
    phoneNumber: '',
    step: 1,
    tokenPhoneNumber: '',
    password: '',
    repeatedPassword: '',
  })
  const [errors, setErrors] = useState({
    enteredphoneNumber: false,
    token: false,
    password: false,
    repeatedPassword: false,
  })

  const [isLoadingButton, setIsLoadingButton] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isLoading: isLoading } = useAppSelector((state) => state.sendSms)


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

  const validatePhoneNumber = (phoneNumber: string) => {
    const transformedPhoneNumber = validatorsService.transformPhone(phoneNumber)
    return transformedPhoneNumber
  }


  const handleSendSMSToken = async () => {

    const { enteredphoneNumber } = formData

    const phoneNumber = validatePhoneNumber(enteredphoneNumber)
    if (!phoneNumber) return

    setFormData({
      ...formData, phoneNumber: phoneNumber
    })

    const resultAction = await dispatch(resetPasswordBySms(phoneNumber))

    if (resetPasswordBySms.fulfilled.match(resultAction)) {
      toast.success('SMS sent successfully')
      setFormData({
        ...formData, step: 2
      })
      console.log(resultAction.payload)
      console.log(phoneNumber)
    } else {
      toast.error('Invalid phone Number')
      setErrors((prevErrors) => ({ ...prevErrors, enteredphoneNumber: true }))

    }
  }

  const handleVerifyPhone = async () => {

    const { tokenPhoneNumber } = formData


    const resultAction = await dispatch(verifyPhone(tokenPhoneNumber))
    if (verifyPhone.fulfilled.match(resultAction)) {
      toast.success('Token verified successfully')
      setFormData({
        ...formData,
        step: 3,
      })
    } else {
      toast.error('Invalid token')
      setErrors((prevErrors) => ({ ...prevErrors, token: true }))
    }
  }

  const handleResetPassword = async () => {

    const { password, repeatedPassword, tokenPhoneNumber } = formData

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
    setIsLoadingButton(true)

    try {
      const resultAction = await dispatch(resetPassword({ tokenPhoneNumber, password }))
      console.log(tokenPhoneNumber, password)
      if (resetPassword.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload)
        navigate('/login')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('An unexpected error occurred during registration.')
    } finally {
      setIsLoadingButton(false)
    }

  }

  const handleBack = () => {
    setFormData({
      ...formData,
      step: 1,
    })
    setErrors((prevErrors) => ({ ...prevErrors, token: true }))
  }

  if (isLoadingPage) {
    return (
      <> <LoadingSpinner /> </>
    )
  }

  const { enteredphoneNumber, step, tokenPhoneNumber, password, repeatedPassword } = formData
  const { token: errorToken, password: errorPassword, repeatedPassword: errorRepeatedPassword, enteredphoneNumber: errorPhoneNumber } = errors

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md dark:bg-gray-900">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Reset password</h2>
        {step === 1 && (
          <>
            <div className='py-4'>
              <Input
                type="text"
                name="enteredphoneNumber"
                placeholder="Phone Number"
                value={enteredphoneNumber}
                onChange={handleInputChange}
                error={errorPhoneNumber}
                onEnterPress={handleSendSMSToken}
                autoFocus={true}
              />
            </div>
            <Button
              text="Next"
              onClick={handleSendSMSToken}
              className='bg-blue-400 font-articulatThin text-white hover:bg-blue-600 hover:text-black'
              loading={isLoading}
            />
            <Link
            to='/reset-password-by-email'
            className='text-primary hover:text-blue-600'
            >
            Reset via email
            </Link>

          </>
        )}
        {step === 2 && (
          <>
            <p className="mb-6">Please enter the verification token sent to your phone number.</p>
            <div className='py-4'>
              <Input
                type="text"
                name="tokenPhoneNumber"
                placeholder="Verification Token"
                value={tokenPhoneNumber}
                onChange={handleInputChange}
                error={errorToken}
                onEnterPress={handleVerifyPhone}
                autoFocus={true}
              />
            </div>
            <div className="flex justify-between">
              <Button
                text="Back"
                onClick={handleBack}
                className='bg-gray-400 font-articulatThin text-white p-2 rounded-lg border hover:bg-gray-600 hover:text-black hover:border hover:border-gray-300'
              />
              <Button
                text="Verify"
                onClick={handleVerifyPhone}
                className='bg-blue-400 font-articulatThin text-white p-2 rounded-lg border hover:bg-blue-600 hover:text-black hover:border hover:border-gray-300'
                loading={isLoading}
              />
            </div>

          </>
        )}
        {step === 3 && (
          <>
            <div className="mt-8">
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-1">Password</label>
                <Input
                  type='password'
                  name='password'
                  value={password}
                  onChange={handleInputChange}
                  placeholder='Password'
                  error={errorPassword}
                  autoFocus={true}
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
                  className='bg-blue-400 font-articulatThin text-white p-2 rounded-lg border hover:bg-blue-600 hover:text-black hover:border hover:border-gray-300'
                  loading={isLoadingButton}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
export default ResetPasswordByPhoneNumberPage
