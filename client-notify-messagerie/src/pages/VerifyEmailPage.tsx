import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import check from '../assets/check.png'
import errorImage from '../assets/errorImage.png'
import LoadingSpinner from '../components/common/LoadingPage'
import Button from '../components/common/Button'
import { verifyEmail, selectVerifyEmailState } from '../store/verifyEmailSlice'
import { useAppDispatch } from '../hooks/reduxHooks'
import { useSelector } from 'react-redux'

const VerifyEmailPage: React.FC = () => {
  const { tokenEmail } = useParams<{ tokenEmail: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { isLoading, isVerified, error } = useSelector(selectVerifyEmailState)

  useEffect(() => {

    if (tokenEmail) {
      dispatch(verifyEmail(tokenEmail))
    } else {
      toast.error('Invalid token.')
    }
  }, [tokenEmail, dispatch])

  const handleBackToLogin = () => {
    navigate('/login')
  }

  if (isLoading) {
    return (
      <> <LoadingSpinner /> </>
    )
  }

  if (isVerified) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800'>
        <div className='relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0 dark:bg-gray-900'>
          <div className='flex flex-col justify-center p-8 md:p-14'>
            <div className='flex justify-center items-center'>
              <img src={check} alt='image' className='w-[60px]' />
            </div>
            <span className='mt-4 mb-2 text-lg text-center font-articulatMeduim'>Email Verified</span>
            <div className='text-center text-black dark:text-white'>
              <span className='mt-4 mb-6 text-sm font-articulatThin'>Your email address was verified.</span>
            </div>
            <Button
              text='Back to Login'
              onClick={handleBackToLogin}
              className='mt-4 bg-blue-400 font-articulatThin text-white hover:bg-blue-600 hover:text-black'
            />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0'>
        <div className='flex flex-col justify-center p-8 md:p-14'>
          <div className='flex justify-center items-center'>
            <img src={errorImage} alt='image' className='w-[60px]' />
          </div>
          <span className='mt-4 mb-2 text-lg text-center font-articulatMeduim'>Email Verification Failed</span>
          <div className='text-center text-black'>
            <span className='mt-4 mb-6 text-sm font-articulatThin'>{error}</span>
          </div>
          <Button
            text='Back to Login'
            onClick={handleBackToLogin}
            className='mt-4 bg-red-400 font-articulatThin text-white p-2 rounded-lg border hover:bg-red-600 hover:text-black hover:border hover:border-gray-300'
          />
        </div>
      </div>
    </div>
  )

}

export default VerifyEmailPage



