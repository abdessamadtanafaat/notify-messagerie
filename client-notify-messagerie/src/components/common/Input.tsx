import React, { useState } from 'react'
import { Eye, EyeOff, TriangleAlert } from 'lucide-react' // Import eye icons from lucide-react

interface InputProps {
  type: 'text' | 'password';
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterPress?: () => void; 
  error?: boolean;
  errorText?: string; // New prop for error text

}

const Input: React.FC<InputProps> = ({ type, placeholder, value, onChange, onEnterPress, error = false ,  errorText = '', // Default errorText to empty string
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false) // State to track focus

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  // the enter button after setting the password in forum
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onEnterPress) {
      onEnterPress()
    }
  }

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : type}
        className={`w-full p-2 border rounded-md placeholder:font-light placeholder-text-gray-500
          ${isFocused ? 'border-blue-400' : error ? 'border-red-500' : 'border-gray-300'}
          hover:border-blue-400 focus:border-blue-400 focus:outline-none`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur} 
        onKeyDown={handleKeyDown}
      />
            {error && (
        <div className="absolute top-1/2 -translate-y-1/2 right-3" style={{ transform: 'translateY(-50%)' }}>
          <TriangleAlert color="#DC2626" size={20} />
        </div>
      )}

      {type === 'password' && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute top-1/2 -translate-y-1/2 right-3"
          style={{ transform: 'translateY(-50%)' }}
        >
          {showPassword ? <Eye color="#6B7280" size={20} /> : <EyeOff color="#6B7280" size={20} />}
        </button>
      )}

      {error && (
        <div className="absolute left-0 mt-1 text-red-500 text-sm">
          {errorText}
        </div>
      )}
      
    </div>
  )
}

export default Input
