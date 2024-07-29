import React, { useState } from 'react'
import { uploadFile } from '../../services/userService' // Adjust the import path as needed
import { useAuth } from '../../contexte/AuthContext'

const UploadFileComponent: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { user, refreshUserData } = useAuth()

  // Handle file change event
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    
    if (file) {
      try {
        const result = await uploadFile(file,user?.id || null)
        setImageUrl(result.url)
        await refreshUserData()
        setError(null)
      } catch (err) {
        setError('Failed to upload file')
        setImageUrl(null)
      }
    }
  }

  return (
    <div className='d-flex justify-content-center bg-dark vh-100'>
      <div className="w-25 bg-white mt-5 p-5">
        <input type="file" name='image' onChange={handleFileChange} />
        {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ width: '100%', marginTop: '10px' }} />}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  )
}

export default UploadFileComponent
