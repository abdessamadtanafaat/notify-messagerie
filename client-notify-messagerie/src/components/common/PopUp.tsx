import React from 'react'

interface PopUpProps {
  openPopUp: boolean;
  closePopUp: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  //confirmButtonText?: string;
  //cancelButtonText?: string;
}

const PopUp: React.FC<PopUpProps> = ({
  openPopUp,
  closePopUp,
  title,
  message,
  onConfirm,
  //confirmButtonText = 'Yes, I\'m sure',
  //cancelButtonText = 'No, go back',
}) => {
  const handleClosePopUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.id === 'modalContainer') {
      closePopUp()
    }
  }

  if (!openPopUp) return null

  return (
    <div
      id='modalContainer'
      onClick={handleClosePopUp}
      className={`fixed inset-0 flex justify-end transition-transform ease-in-out duration-300 z-50 ${
        openPopUp ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div
        className={`relative w-full max-w-md bg-white rounded-lg shadow-lg p-6 transform transition-transform ease-in-out duration-300 ${
          openPopUp ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
               <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
        <p className='mt-3 text-gray-600'>{message}</p>
        <div className='mt-6 flex justify-end space-x-3'>
          <button
            onClick={onConfirm}
            className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150'
          >
            Confirm
          </button>
          <button
            onClick={closePopUp}
            className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-150'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default PopUp
