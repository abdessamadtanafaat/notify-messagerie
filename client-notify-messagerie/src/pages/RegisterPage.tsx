
import React from 'react'
import RegisterHandler from './RegisterHandler'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { Link } from 'react-router-dom'
import image from '../assets/image.jpg'
import { GoogleLogin } from '@react-oauth/google'

const RegisterPage: React.FC = () => {

  return (
    <RegisterHandler
      render={(formData, errors, handleChange, handleSubmit, isLoadingButton,handleGoogleSuccess,handleGoogleError) => (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
          <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0 dark:bg-gray-900">
            <div className="flex flex-col justify-center p-8 md:p-14">
              <span className="mb-3 text-title font-articulatBold dark:text-white">Sign Up</span>
              <div className="text-gray-400">
                You already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-blue-600">
                  Sign In
                </Link>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap">
                  <div className="w-full md:w-1/2 py-4 pr-2">
                    <label className="block text-sm font-medium text-black dark:text-white">First Name</label>
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      name="firstName"
                      error={errors.firstName}
                      autoFocus={true}
                    />
                  </div>
                  <div className="w-full md:w-1/2 py-4 pl-2">
                    <label className="block text-sm font-medium text-black dark:text-white">Last Name</label>
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      name="lastName"
                      error={errors.lastName}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap">
                  <div className="w-full md:w-1/2 px-2 py-4 pr-2">
                    <label className="block text-sm font-medium text-black mb-1 dark:text-white">Email</label>
                    <Input
                      type="text"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      name="email"
                      error={errors.email}
                    />
                  </div>
                  <div className="w-full md:w-1/2 py-4 pl-2">
                    <label className="block text-sm font-medium text-black mb-1 dark:text-white">Phone</label>
                    <Input
                      type="text"
                      value={formData.EnteredphoneNumber}
                      name="EnteredphoneNumber"
                      onChange={handleChange}
                      placeholder="Phone number"
                      error={errors.EnteredphoneNumber}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap">
                  <div className="w-full md:w-1/2 py-4 pr-2">
                    <label className="block text-sm font-medium text-black mb-1 dark:text-white">Password</label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      name="password"
                      error={errors.password}
                    />
                  </div>
                  <div className="w-full md:w-1/2 py-4 pl-2">
                    <label className="block text-sm font-medium text-black mb-1 dark:text-white">Re-enter password</label>
                    <Input
                      type="password"
                      value={formData.repeatedPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      name="repeatedPassword"
                      error={errors.repeatedPassword}
                    />
                  </div>
                </div>
                <Button text="Sign Up"
                  onClick={() => { }}
                  className="bg-blue-400 font-articulatThin text-white hover:bg-blue-600 hover:text-black"
                  loading={isLoadingButton}>
                </Button>

              </form>
              <div className="flex items-center justify-center my-6">
                <Button
                  onClick={() => {
                  }}
                  text={
                    <>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                      />
                    </>
                  }
                />
              </div>
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

export default RegisterPage
