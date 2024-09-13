import React, {  } from 'react'
import { User } from '../../interfaces'
import { FileIcon, ImageIcon, SendIcon, Smile } from 'lucide-react'
import data, { Emoji } from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Message, SeenNotif } from '../../interfaces/Discussion'
import AudioRecorder from './AudioRecorder'

interface InputAreaProps {
  message: string;
  handleChange: (field: 'message', value: string) => void;
  showEmojiPicker: { message: boolean };
  togglePicker: (picker: 'message') => void;
  addEmoji: (emoji: Emoji) => void;
  setPickerRef: (field: 'message') => (el: HTMLDivElement | null) => void;
  sendImage: (event: React.ChangeEvent<HTMLInputElement>, idDiscussion: string, receiver: User) => void;
  sendFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSend: (receiver: User, idDiscussion: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, receiver: User, idDiscussion: string) => void;
  sendTypingNotification: (discussionId: string, receiver: User) => void;
  typingUser: string | null;
  seenUser: boolean | null;
  sendSeenNotification: (messageId: string, discussionId: string, receiver: User) => void;
  seenNotif: SeenNotif;
  handleSendAudio: (blob: Blob, idDiscussion: string, receiver: User) => void;
  recordingAudio: string | null;
  sendRecordingNotification: (discussionId: string, receiver: User) => void;
  loading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  imagePreview: string | null;
  idDiscussion: string;
  receiver: User;
  lastMessage: Message;
  scrollToBottomInput: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({
  message,
  handleChange,
  showEmojiPicker,
  togglePicker,
  addEmoji,
  setPickerRef,
  sendImage,
  sendFile,
  handleSend,
  handleKeyDown,
  sendTypingNotification,
  sendSeenNotification,
  handleSendAudio,
  sendRecordingNotification,
  fileInputRef,
  idDiscussion,
  receiver,
  lastMessage,
  scrollToBottomInput
}) => {
  return (
    <div className='absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'>
      <div className='flex items-center justify-center space-x-1'>
        <div className='flex items-center space-x-1 px-1'>
          <label className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-center">
            <input
              type="file"
              name="image"
              onChange={(e) => sendImage(e, idDiscussion, receiver)}
              ref={fileInputRef}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <ImageIcon className='w-4 h-4 text-blue-600 dark:text-gray-400 dark:hover:text-white' />
          </label>
          <label className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-center">
            <input
              type="file"
              name="file"
              onChange={sendFile}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <FileIcon className='w-4 h-4 text-blue-600 cursor-pointer dark:text-gray-400 dark:hover:text-white' />
          </label>
        </div>

        <div className='relative flex-grow'>
          <input
            type='text'
            name='message'
            placeholder='Type a message...'
            value={message}
            onChange={(e) => {
              handleChange('message', e.target.value)
              sendTypingNotification(lastMessage.discussionId, receiver)
              scrollToBottomInput()
            }}
            onKeyDown={(e) => {
              handleKeyDown(e, receiver, idDiscussion)
              scrollToBottomInput()
            }}
            onFocus={() => {
              if (receiver.id === lastMessage.receiverId) {
                sendSeenNotification(lastMessage.id, lastMessage.discussionId, receiver)
              }
              scrollToBottomInput()
            }}
            autoFocus={true}
            className='w-full h-10 px-2 text-sm border-b-2 bg-gray-200 border-gray-600 rounded-2xl placeholder:font-light placeholder:text-gray-500 dark:bg-gray-700 focus:border-blue-400 focus:outline-none'
          />

          <Smile
            className='w-4 h-4 text-blue-600 cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 dark:text-gray-400 dark:hover:text-white'
            onClick={() => togglePicker('message')}
          />
          {showEmojiPicker.message && (
            <div
              ref={setPickerRef('message')}
              className="absolute transform -translate-y-96 right-1 bg-white border border-gray-300 rounded shadow-lg"
            >
              <Picker
                data={data}
                emojiSize={20}
                emojiButtonSize={28}
                onEmojiSelect={(emoji: Emoji) => addEmoji(emoji)}
                maxFrequentRows={0}
              />
            </div>
          )}
        </div>

        <div className='flex items-center space-x-1 px-1'>
          <AudioRecorder
            onSend={async (blob) => handleSendAudio(blob, idDiscussion, receiver)}
            sendRecordingNotification={sendRecordingNotification}
            lastMessage={lastMessage}
            receiver={receiver}
          />
          <button
            onClick={() => handleSend(receiver, idDiscussion)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <SendIcon className='w-4 h-4 text-blue-600 cursor-pointer dark:text-gray-400 dark:hover:text-white' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default InputArea
