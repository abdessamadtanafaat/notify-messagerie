import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { login } from '../store/authSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import '../index.css'
import LoadingSpinner from '../components/common/LoadingPage'
import { FormDataLogin, FormErrors } from '../interfaces'


type RenderProps = {
    render: (
        formData: FormDataLogin,
        errors: FormErrors,
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        handleLogin: (e: React.FormEvent<HTMLFormElement>) => void,

        isLoadingButton: boolean,
    ) => React.ReactNode;
};


const LoginPage: React.FC<RenderProps> = ({ render }) => {
    // Component state
    const [formData, setFormData] = useState<FormDataLogin>({
        emailOrPhoneNumber: '',
        password: '',
    })
    const [errors, setErrors] = useState<FormErrors>({
        email: false,
        password: false
    })
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    // Redux state
    const { isLoading: isAuthLoading, isAuthenticated } = useAppSelector((state) => state.auth)

    // Component local state
    const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true)

    // Effects
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoadingPage(false)
        }, 150)
        return () => clearTimeout(timeout) // Cleanup on unmount
    },)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/messages')
        }
    }, [isAuthenticated, navigate])


    // Event handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        const { emailOrPhoneNumber, password } = formData

        if (!emailOrPhoneNumber.trim()) {
            setErrors((prevErrors) => ({ ...prevErrors, email: true }))
            return
        }

        if (!password.trim()) {
            setErrors((prevErrors) => ({ ...prevErrors, password: true }))
            return
        }

        try {
            const resultAction = await dispatch(login({ emailOrPhoneNumber, password }))

            if (login.fulfilled.match(resultAction)) {
                if (resultAction.payload.isFirstTimeLogin) {
                    navigate('/complete-profile')
                } else {
                    navigate('/test')
                }

            } else {
                if (resultAction.payload) {
                    const { error } = resultAction.payload

                    toast.error(error)

                    setErrors({ email: false, password: false })


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

    // Render login form
    return render(formData, errors, handleChange, handleLogin, isAuthLoading)
}

export default LoginPage
