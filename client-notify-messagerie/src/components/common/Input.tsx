import React, { useState, useRef, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps {
  type: 'text' | 'password';
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterPress?: () => void;
  error?: boolean;
  errorText?: string;
  name?: string;
  autoFocus?: boolean;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  onEnterPress,
  error = false,
  errorText = '',
  name = '', // Default errorText to empty string
  autoFocus = false
}) => {

  const inputRef = useRef<HTMLInputElement>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(type === 'text') // Manage password visibility with state


  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev) // Toggle password visibility
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onEnterPress) {
      onEnterPress()
    }
  }

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])
  return (
    <div className="relative">
      <input
        type={isPasswordVisible ? 'text' : type}
        className={`w-full p-2 border rounded-md placeholder:font-light placeholder-text-gray-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          hover:border-blue-400 focus:border-blue-400 focus:outline-none`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        name={name}
        ref={inputRef}
      />
      {type === 'password' && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute top-1/2 -translate-y-1/2 right-3"
          style={{ transform: 'translateY(-50%)' }}
        >
          {isPasswordVisible ? (
            <EyeOff color="#6B7280" size={20} />
          ) : (
            <Eye color="#6B7280" size={20} />
          )}
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
