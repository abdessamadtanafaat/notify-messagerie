import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import validatorsService from '../services/validatorsService'
import { register } from '../store/registerSlice'
import LoadingSpinner from '../components/common/LoadingPage'
import strapiService from '../services/strapiService'
import { FormDataRegistration, FormErrors, UserDataRegistration } from '../interfaces/User'
import { useAppDispatch } from '../hooks/reduxHooks'
import { DecodedToken } from '../interfaces'
import { CredentialResponse } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

type RenderProps = {
    render: (
        formData: FormDataRegistration,
        errors: FormErrors,
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
        isLoadingButton: boolean,
        handleGoogleSuccess: (CredentialResponse: CredentialResponse) => void,
        handleGoogleError: () => void
    ) => React.ReactNode;
};

const RegisterHanlder: React.FC<RenderProps> = ({ render }) => {

    const dispatch = useAppDispatch()


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

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false)
        }, 150)
        return () => clearTimeout(timeout)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const { email, password, repeatedPassword, EnteredphoneNumber, firstName, lastName } = formData

        if (!firstName.trim()) {
            setErrors((prevErrors) => ({ ...prevErrors, firstName: true }))
            return
        }

        if (!lastName.trim()) {
            setErrors((prevErrors) => ({ ...prevErrors, lastName: true }))
            return
        }

        if (!EnteredphoneNumber.trim()) {
            setErrors((prevErrors) => ({ ...prevErrors, EnteredphoneNumber: true }))
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
            toast.error('Invalid password: use at least one uppercase letter, lowercase letter, digit, and special character.')
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

            const userDataRegistration: UserDataRegistration = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.EnteredphoneNumber,
                password: '',
            }

            await strapiService.registerUser(userDataRegistration)
        } catch (error) {
            console.error('Registration error:', error)
            //toast.error(error.message)
        } finally {
            setIsLoadingButton(false)
        }
    }

      const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if(credentialResponse.credential){
            const decoded: DecodedToken = jwtDecode(credentialResponse.credential)
            const lastSpaceIndex = decoded.name.lastIndexOf(' ')
            const firstName = decoded.name.slice(0, lastSpaceIndex)
            const lastName = decoded.name.slice(lastSpaceIndex + 1)
    
            setFormData((prevFormData) => ({
              ...prevFormData,
              email: decoded.email,
              firstName,
              lastName,
            }))
        }

      }
      const handleGoogleError = () => {
        console.log('Login Failed')
        toast.error('GoogleLogin Error')
      }

    if (isLoading) {
        return <LoadingSpinner />
    }

    return render(formData, errors, handleChange, handleSubmit, isLoadingButton, handleGoogleSuccess,handleGoogleError)
}

export default RegisterHanlder
