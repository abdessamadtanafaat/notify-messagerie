import React from 'react'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { Link } from 'react-router-dom'
import image from '../assets/image.jpg'
import LoginHandler from './LoginHandler'

const LoginPage: React.FC = () => {

  return (
    <LoginHandler
      render={(formData, errors, handleChange, handleLogin, isAuthLoading) => (
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
              <form onSubmit={handleLogin}>
                <div className='py-4'>
                  <Input
                    type='text'
                    name='emailOrPhoneNumber'
                    value={formData.emailOrPhoneNumber}
                    onChange={handleChange}
                    placeholder='Email or phone number'
                    error={errors.email}
                    autoFocus={true}
                  />
                </div>
                <div className='py-4'>
                  <Input
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='Password'
                    onEnterPress={() => { }}
                    error={errors.password}
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
                  onClick={() => { }}
                  className='bg-blue-400 font-articulatThin text-white hover:bg-blue-600 hover:text-black'
                  loading={isAuthLoading}>
                </Button>
              </form>
            </div>
            <div className='relative'>
              <img src={image} alt='image' className='w-[400px] h-full hidden rounded-r-2xl md:block object-cover' />
            </div>
          </div>
        </div>
      )}
    />
  )
}

export default LoginPage
