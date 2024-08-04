import API_ENDPOINTS from '../api/endpoints'
import axiosStrapiInstance from '../api/axiosStrapiInstance'
import { ErrorResponse } from 'react-router-dom'
import axios from 'axios'
import { UserDataRegistration, UserStrapiData } from '../interfaces'


const strapiService = {

    registerUser: async (userData: UserDataRegistration) => {
        try {
            const response = await axiosStrapiInstance.post(API_ENDPOINTS.USERS, { data: userData })
            return response.data

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const typedError = error.response.data as ErrorResponse
                console.log(typedError)
                throw typedError

            } else {
                throw { error: 'strapi regestratio failed', statusCode: 500 }
            }
        }
    },

    getUserData: async (email: string) => {

        try {
            const response = await axiosStrapiInstance.get(`${API_ENDPOINTS.USERS}?filters[$and][0][email][$eq]=${email}&populate=avatar`)
            console.log(response.data)
            return response.data

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const typedError = error.response.data as ErrorResponse
                console.log(typedError)
                throw typedError

            } else {
                throw { error: 'Strapi Registration Error occurred', statusCode: 500 }
            }
        }
    },

    updateUserData: async (email: string, userData: UserStrapiData) => {
        try {
            const data = await findUserByEmail(email)
            console.log(data)
            const userId = data.data[0].id
            console.log(userId)
            const response = await axiosStrapiInstance.put(`${API_ENDPOINTS.USERS}/${userId}`, { data: userData })
            console.log(userId)
            console.log(response.data)
            return response.data

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const typedError = error.response.data as ErrorResponse
                console.log(typedError)
                throw typedError

            } else {
                throw { error: 'Updating user Info Error occurred', statusCode: 500 }
            }
        }
    },
}

export default strapiService

async function findUserByEmail(email: string) {
    try {
        const response = await axiosStrapiInstance.get(`${API_ENDPOINTS.USERS}?filters[$and][0][email][$eq]=${email}`)

        const users = response.data
        return users

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const typedError = error.response.data as ErrorResponse
            console.log(typedError)
            throw typedError

        } else {
            throw { error: 'finding User Error occurred', statusCode: 500 }
        }
    }
}

