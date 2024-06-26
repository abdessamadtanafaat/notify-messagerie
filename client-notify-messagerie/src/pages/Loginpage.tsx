import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import image from '../assets/image.jpg'
import googleIcon from '../assets/google.svg'
import { toast } from 'react-toastify'
import '../index.css' 
//import { typography } from './styles/typography' // Import your typography object


const LoginPage: React.FC = () => {
  const [emailOrPhoneNumber, setEmailOrPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async () => {    

    setIsLoading(true)
    try{
      const authResponse = await authService.login({emailOrPhoneNumber, password}) 
      localStorage.setItem('token', authResponse.token)
      toast.success('Welcome')
      navigate ('/messages')
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(err: any){
      const error = err.response.data.error
      console.log(error)
      toast.error('Wrong credentials')
      setPassword('')
      setError(true)
    }finally{
      setIsLoading(false)
    }
  }

  // const handleGoogleSignIn = async () => {
  //   setLoading(true); // Set loading state to true
  //   try {
  //     // Handle Google sign in logic here
  //   } catch (err) {
  //     console.error('Failed to sign in with Google:', err);
  //   } finally {
  //     setLoading(false); // Reset loading state
  //   }
  // };

  return (
    
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
          <div className="font-mono text-base text-gray-800">
    </div>
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        {/* Left Side */}
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className='mb-3 text-title font-articulatBold'>Sign in</span>
          <div className='text-center text-gray-400'>
            Don't have an account ?{' '}
            <a href="/register" className="text-primary hover:text-blue-600">
            Sign up
            </a>
          </div>
          <div className='py-4'>
            <Input
              type='text'
              value={emailOrPhoneNumber}
              onChange={(e) => setEmailOrPhoneNumber(e.target.value)}
              placeholder='Email or phone number'
              error = {error}
            />
          </div>
          <div className="py-4">
            <Input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              onEnterPress={handleLogin}
              />
          </div>
          <div className='flex justify-between w-full py-4'>
            <a href= '/reset-password' className='text-primary hover:text-blue-600'>Forgotten password?</a>
          </div>
          <Button
            text='Sign in'
            onClick={handleLogin}
            className='bg-blue-400 font-articulatThin text-white  p-2 rounded-lg border hover:bg-blue-600 hover:text-black hover:border hover:border-gray-300'
            loading={isLoading}          
          />

            <Button
            className='border border-gray-300 text-md hover:bg-black hover:text-white'
            onClick={() => {
              // handle Login Google ici .
            }}
            text={
              <>
                <img src={googleIcon} alt='Google icon' className='w-6 h-6 inline mr-2' />
                Sign in with Google
              </>
            }
          />
        </div>
        {/* Right Side */}
        <div className='relative'>
          <img
            src={image}
            alt='image'
            className='w-[400px] h-full hidden rounded-r-2xl md:block object-cover'
          />
        </div>
      </div>
    </div>
  
)

}

export default LoginPage