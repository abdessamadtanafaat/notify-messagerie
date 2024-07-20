import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import '../index.css'
import check from '../assets/check.png'
import LoadingSpinner from '../components/common/LoadingPage'
import { sendSms, verifyPhone } from '../store/sendSmsSlice'
import validatorsService from '../services/validatorsService'

  const CompleteProfilePage: React.FC = () => {
    
    const [formData, setFormData] = useState({
      enteredPhoneNumber: '',
      phoneNumber: '',
      step: 1,
      tokenPhoneNumber: '',
      password: '',
      repeatedPassword: '',
      isPhoneNumberVerified: false,
    })
    const [errors, setErrors] = useState({
      enteredPhoneNumber: false,
      tokenPhoneNumber: false,
      password: false,
      repeatedPassword: false,
    })
    
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const {isLoading: isLoading } = useAppSelector((state) => state.sendSms)


    const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true)
    useEffect(() => {
      console.log('CompleteProfilePage component mounted')
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

    
    const handleCompleteProfile  = async () => {

    const { enteredPhoneNumber } = formData

    const phoneNumber = validatePhoneNumber(enteredPhoneNumber)
    if (!phoneNumber) return

      const resultAction = await dispatch(sendSms(phoneNumber))
        
      if (sendSms.fulfilled.match(resultAction)) {
          toast.success('SMS sent successfully')
          setFormData({
            ...formData, step: 2
          })
      } else {
          toast.error('Invalid phone Number')
          setErrors((prevErrors) => ({ ...prevErrors, enteredPhoneNumber: true }))
      }
    }

    const handleVerifyPhone = async () => {

      const { tokenPhoneNumber } = formData

      setErrors((prevErrors) => ({ ...prevErrors, tokenPhoneNumber: true }))

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

    const { enteredPhoneNumber, step, tokenPhoneNumber } = formData
    const { tokenPhoneNumber: errorPhoneNumberToken, enteredPhoneNumber: errorEnteredPhoneNumber } = errors


    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
          {step === 1 && (
            <>
              <p className="mb-6">It's your first time logging in. Please complete your profile by providing your phone number.</p>
              <div className='py-4'>
                <Input
                  type="text"
                  name="enteredPhoneNumber"
                  placeholder="Phone Number"
                  value={enteredPhoneNumber}
                  onChange={handleInputChange}
                  error={errorEnteredPhoneNumber}
                  onEnterPress={handleCompleteProfile}
                />
              </div>
              <Button
                text="Next"
                onClick={handleCompleteProfile}
                className='bg-blue-400 font-articulatThin text-white p-2 rounded-lg border hover:bg-blue-600 hover:text-black hover:border hover:border-gray-300'
                loading={isLoading}
              />
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
                  error={errorPhoneNumberToken}
                  onEnterPress={handleVerifyPhone}
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
          <div className="flex justify-center items-center">
                <img src={check} alt="image" className="w-[60px]" />
              </div>
                <span className="mt-4 mb-2 text-lg text-center font-articulatMeduim block">Phone Number Verified</span>
              <div className="text-center text-black">
                <span className="mt-4 mb-6 text-sm font-articulatThin block">Your phone number was verified.</span>
              </div>
            <div className="flex justify-center mt-4">
              <Button
                text="Back to login"
                onClick={() => navigate('/login')}
                className="bg-gray-400 font-articulatThin text-white p-2 rounded-lg border hover:bg-gray-600 hover:text-black hover:border hover:border-gray-300"
              />
          </div>
          </>

          )}
        </div>
      </div>
    )
  }
export default CompleteProfilePage
