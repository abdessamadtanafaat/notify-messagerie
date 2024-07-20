
import React from 'react'
 const LoadingSpinner: React.FC = () => (
   <div className=" bg-white flex items-center justify-center h-screen dark:bg-gray-800">
      <div className="h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
 </div>
 )

export default LoadingSpinner