import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { toast } from 'react-toastify'
import '../index.css'
import LoadingSpinner from '../components/common/LoadingPage'
import { sendTokenEmail } from '../store/sendVerificationEmailSlice'
import check from '../assets/check.png'
import { Link } from 'react-router-dom'

const ResetPasswordByEmailPage: React.FC = () => {

  const [formData, setFormData] = useState({
    email: '',
    step: 1,
  })

  const [errors, setErrors] = useState({
    error: false,
  })

  const dispatch = useAppDispatch()
  const { isLoading: isLoading } = useAppSelector((state) => state.sendTokenEmail)

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

  const handleSendTokenEmail = async () => {

    const { email, step } = formData
    const resultAction = await dispatch(sendTokenEmail(email))

    if (sendTokenEmail.fulfilled.match(resultAction) && step === 1) {
      toast.success('Token verification sent successfully')
      setFormData({
        ...formData, step: 2
      })

      console.log(resultAction.payload)
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, error: true }))
    }
  }

  const handleBack = () => {
    setFormData({
      ...formData, step: 1
    })
  }

  if (isLoadingPage) {
    return (
      <> <LoadingSpinner /> </>
    )
  }

  const { email, step } = formData
  const { error: errorEmail } = errors

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md dark:bg-gray-900">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Reset password</h2>
        {step === 1 && (
          <>
            <div className='py-4'>
              <Input
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={handleInputChange}
                error={errorEmail}
                onEnterPress={handleSendTokenEmail}
              />
            </div>
            <div className="flex justify-between gap-4">
              <Button
                text="Back"
                onClick={handleBack}
                className='bg-gray-400 font-articulatThin text-white hover:bg-gray-600 hover:text-black'
              />
              <Button
                text="Next"
                onClick={handleSendTokenEmail}
                className='bg-blue-400 font-articulatThin text-white hover:bg-blue-600 hover:text-black'
                loading={isLoading}
              />
            </div>
            <Link
            to='/reset-password-byPhoneNumber'
            className='text-primary hover:text-blue-600'
            >
            Reset via phone Number
            </Link>
          </>
        )}

        {step === 2 && (
          <>
            <div className='py-4'>
              <div className='flex justify-center items-center'>
                <img src={check} alt='image' className='w-[60px]' />
              </div>
              <div className='mt-4 text-lg text-center font-articulatMedium'>
                Token sent successfully.
              </div>
              <div className='mt-2 text-center text-black'>
                <span className='text-sm font-articulatThin'>
                  Please check your email.
                </span>
              </div>
            </div>
          </>

        )}
      </div>
    </div>
  )
}
export default ResetPasswordByEmailPage
