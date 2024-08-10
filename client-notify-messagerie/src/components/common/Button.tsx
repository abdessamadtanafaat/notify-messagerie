import React from 'react'

interface ButtonProps {
  text: React.ReactNode;
  onClick: () => void;
  className?: string;
  loading?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className = '', loading = false,onMouseEnter,onMouseLeave}) => {
  const handleClick = async () => {
    if (!loading) {
      await onClick() // Execute onClick handler if not loading
    }
  }

  return (
    <button
      className={`flex items-center justify-center w-full p-2 rounded-lg mb-6 ${className}`}
      onClick={handleClick}
      disabled={loading}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {loading && (
        <svg className="jsutify-center animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {loading ? '' : text}
    </button>
  )
}

export default Button
