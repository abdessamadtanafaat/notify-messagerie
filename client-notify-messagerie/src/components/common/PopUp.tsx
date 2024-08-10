import React from 'react'

interface PopUpProps {
  openPopUp: boolean;
  closePopUp: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const PopUp: React.FC<PopUpProps> = ({
  openPopUp,
  closePopUp,
  title,
  message,
  onConfirm,
  confirmButtonText = 'Yes, I\'m sure',
  cancelButtonText = 'No, go back'
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
      className='fixed inset-0 bg-black flex justify-center items-center bg-opacity-20 backdrop-blur-sm z-50'
    >
      <div className="rounded-lg bg-white p-8 shadow-2xl">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="rounded bg-red-300 px-4 py-2 text-sm font-medium text-black-600 dark:text-white"
            onClick={onConfirm}
          >
            {confirmButtonText}
          </button>
          <button
            type="button"
            className="rounded bg-gray-200 px-4 py-2 text-sm font-medium dark:text-gray-600 text-black"
            onClick={closePopUp}
          >
            {cancelButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PopUp
