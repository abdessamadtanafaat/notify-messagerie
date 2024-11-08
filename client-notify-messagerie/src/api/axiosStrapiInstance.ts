import axios from 'axios'

const axiosStrapiInstance = axios.create({
    baseURL: 'http://localhost:1337/api/',
    headers: {
        'Content-Type': 'application/json',
    }
})

export default axiosStrapiInstance