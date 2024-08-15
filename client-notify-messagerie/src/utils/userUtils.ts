
import defaultAvatar from '../assets/default-avatar.png' // Adjust the path as necessary
import defaultAvatarNight from '../assets/default-avatar-night.png' // Dark theme

export const getAvatarUrl = (theme: string, user?: { avatarUrl?: string }) => {
    if (user?.avatarUrl) { return user.avatarUrl }
    return theme === 'dark' ? defaultAvatarNight : defaultAvatar
}

export const formateDate = (date: Date | string | undefined): string => {
    if(!date) return 'N/A'

    const parsedDate = new Date(date)
    return parsedDate.toLocaleDateString()

}

export const getTimeDifference = (logoutTime: Date | string | undefined): string  => {
    if(!logoutTime) return 'N/A'

    const now  = new Date()
    const lastLogout = new Date(logoutTime)
    const differenceInSeconds = Math.floor((now.getTime() - lastLogout.getTime()) / 1000)

    const secondsInMinute = 60 
    const secondsInHour = 3600
    const secondsInDay = 86400
    const secondsInWeek = 604800
    const secondsInMonth = 2592000

    if (differenceInSeconds < secondsInMinute ) {
        return `${differenceInSeconds} seconds ago`
    }else if (differenceInSeconds < secondsInHour) {
        return `${Math.floor(differenceInSeconds / secondsInMinute)} minutes ago`
    }else if(differenceInSeconds < secondsInDay){
        return `${Math.floor(differenceInSeconds / secondsInHour)} hours ago`
    }else if(differenceInSeconds < secondsInWeek){
        return `${Math.floor(differenceInSeconds / secondsInDay)} days ago`
    }else if(differenceInSeconds < secondsInMonth){
        return `${Math.floor(differenceInSeconds / secondsInDay)} weeks ago`
    } else {
        return `${Math.floor(differenceInSeconds / secondsInMonth)} months ago`
    }
}

export const formatPhoneNumber = (phoneNumber: string)=>{
    const cleaned = ('' + phoneNumber).replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{6})$/)

    if (match) {
        return `+${match[1]} ${match[2]}-${match[3]}`
    }
    return phoneNumber
}


// Convert a string from PascalCase (UpperCamelCase) to camelCase (lowerCamelCase)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toCamelCase = (str: any) => {
    console.log(`Original PascalCase string: ${str}`)
    
    if (!str) return str

    // Convert first character to lowercase
    const camelCaseStr = str.charAt(0).toLowerCase() + str.slice(1)
    
    console.log(`Converted camelCase string: ${camelCaseStr}`)
    return camelCaseStr
}



// Convert all keys in an object from PascalCase to camelCase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertKeysToCamelCase = (obj:any) => {
    console.log('Converting object keys from PascalCase to camelCase:', obj)
    
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map(item => convertKeysToCamelCase(item))
    }

    const result = Object.keys(obj).reduce((acc, key) => {
        console.log(`Processing key: ${key}`)
        const camelCaseKey = toCamelCase(key)
        console.log(`Camel case key: ${camelCaseKey}`)
        acc[camelCaseKey] = convertKeysToCamelCase(obj[key])
        return acc
    }, {})
    
    return result
}