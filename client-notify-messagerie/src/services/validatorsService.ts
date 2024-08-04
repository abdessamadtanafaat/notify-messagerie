
const validatorsService = {
    isValidPhone: (phone: string): boolean => {
      const pattern = /^\+\d{12}$/
      return pattern.test(phone)
    },

    transformPhone: (phone: string): string =>{
      
      if(/^0\d{9}$/.test(phone)){

        return `+212${phone.slice(1)}`
      }
      return phone
    },
  
    isValidEmail: (email: string): boolean => {
      // Regular expression for validating email addresses
      const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
      return emailPattern.test(email)
    },
  
    isValidPassword: (password: string): boolean => {
      // Example criteria for a strong password:
      // - Minimum length of 8 characters
      // - Contains at least one uppercase letter
      // - Contains at least one lowercase letter
      // - Contains at least one digit
      // - Contains at least one special character (e.g., !@#$%^&*)
      const requiredLength = 8
      const hasUpperCase = /[A-Z]/.test(password)
      const hasLowerCase = /[a-z]/.test(password)
      const hasDigit = /\d/.test(password)
      const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  
      return (
        password.length >= requiredLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasDigit &&
        hasSpecialChar
      )
    },
  }
  
  export default validatorsService