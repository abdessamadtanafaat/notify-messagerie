import React, { useState, useEffect } from 'react'
import { useAppDispatch } from '../hooks/reduxHooks'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import image from '../assets/image.jpg'
import { toast } from 'react-toastify'
import '../index.css'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import validatorsService from '../services/validatorsService'
import { DecodedToken } from '../interfaces/Auth'
import { register } from '../store/registerSlice'
import LoadingSpinner from '../components/common/LoadingPage'
import { Link } from 'react-router-dom'

const RegsiterPage: React.FC = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    repeatedPassword: '',
    EnteredphoneNumber: '',
    firstName: '',
    lastName: '',

  })
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    repeatedPassword: false,
    EnteredphoneNumber: false,
    firstName: false,
    lastName: false,
  })

  const [isLoadingButton, setIsLoadingButton] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const dispatch = useAppDispatch()


  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
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

  const handleRegister = async () => {

    const { email, password, repeatedPassword, EnteredphoneNumber, firstName, lastName } = formData

    if (!firstName.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, firstName: true }))
      return
    }

    if (!lastName.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, lastName: true }))
      return
    }

    if (!validatorsService.isValidEmail(email)) {
      setErrors((prevErrors) => ({ ...prevErrors, email: true }))
      return
    }

    const phoneNumber = validatorsService.transformPhone(EnteredphoneNumber)
    if (!validatorsService.isValidPhone(phoneNumber)) {
      setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: true }))
      return
    }

    if (!validatorsService.isValidPassword(password)) {
      toast.error('Invalid password :use at least one uppercase letter, lowercase letter, digit and special character.')
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
      const resultAction = await dispatch(register({ firstName, lastName, email, password, phoneNumber }))
      if (register.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload)
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('An unexpected error occurred during registration.')
    } finally {
      setIsLoadingButton(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log(credentialResponse)
    const decoded: DecodedToken = jwtDecode(credentialResponse.credential)
    console.log(decoded)

    const lastSpaceIndex = decoded.name.lastIndexOf(' ')
    const firstName = decoded.name.slice(0, lastSpaceIndex)
    const lastName = decoded.name.slice(lastSpaceIndex + 1)

    setFormData((prevFormData) => ({
      ...prevFormData,
      email: decoded.email,
      firstName,
      lastName,
    })
    )
  }

  if (isLoading) {
    return (
      <> <LoadingSpinner /> </>
    )
  }

  const { email, password, repeatedPassword, EnteredphoneNumber, firstName, lastName } = formData
  const { email: errorEmail, password: errorPassword, repeatedPassword: errorRepeatedPassword, EnteredphoneNumber: errorPhoneNumber, firstName: errorFirstName, lastName: errorLastName } = errors

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100  dark:bg-gray-800'>
      <div className='relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0  dark:bg-gray-900'>
        <div className='flex flex-col justify-center p-8 md:p-14'>
          <span className='mb-3 text-title font-articulatBold dark:text-white'>Sign Up</span>
          <div className=' text-gray-400 '>
            You already have an account?{' '}
            {/* <a href='/login' className='text-primary hover:text-blue-600'>
              Sign In
            </a> */}
            <Link
             to='/login'
             className='text-primary hover:text-blue-600'
             >
             Sign In
            </Link>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 py-4 pr-2">
              <label className="block text-sm font-medium text-black dark:text-white">First Name</label>
              <Input
                type='text'
                value={firstName}
                onChange={handleInputChange}
                placeholder='First Name'
                name='firstName'
                error={errorFirstName}

              />
            </div>
            <div className="w-full md:w-1/2 py-4 pl-2">
              <label className="block text-sm font-medium text-black dark:text-white">Last Name</label>
              <Input
                type='text'
                value={lastName}
                onChange={handleInputChange}
                placeholder='Last Name'
                name='lastName'
                error={errorLastName}

              />
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 px-2 py-4 pr-2">
              <label className="block text-sm font-medium text-black mb-1 dark:text-white">Email</label>
              <Input
                type='text'
                value={email}
                onChange={handleInputChange}
                placeholder='Email'
                name='email'
                error={errorEmail}

              />
            </div>
            <div className="w-full md:w-1/2 py-4 pl-2">
              <label className="block text-sm font-medium text-black mb-1 dark:text-white">Phone</label>
              <Input
                type='text'
                value={EnteredphoneNumber}
                name='EnteredphoneNumber'
                onChange={handleInputChange}
                placeholder='Phone number'
                error={errorPhoneNumber}

              />
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 py-4 pr-2">
              <label className="block text-sm font-medium text-black mb-1 dark:text-white">Password</label>
              <Input
                type='password'
                value={password}
                onChange={handleInputChange}
                placeholder='Password'
                name='password'
                error={errorPassword}
              />
            </div>
            <div className="w-full md:w-1/2 py-4 pl-2">
              <label className="block text-sm font-medium text-black mb-1 dark:text-white">Re-enter password</label>
              <Input
                type='password'
                value={repeatedPassword}
                onChange={handleInputChange}
                placeholder='Password'
                name='repeatedPassword'
                error={errorRepeatedPassword}
              />
            </div>
          </div>
          <Button
            text='Sign Up'
            onClick={handleRegister}
            className='bg-blue-400 font-articulatThin text-white hover:bg-blue-600 hover:text-black'
            loading={isLoadingButton}
          />
          <Button
            onClick={() => {
            }}
            text={
              <>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    console.log('Login Failed')
                  }}
                />
              </>
            }
          />
        </div>
        <div className='relative'>
          <img src={image} alt='image' className='w-[400px] h-full hidden rounded-r-2xl md:block object-cover' />
        </div>
      </div>
    </div>
  )
}


export default RegsiterPage

