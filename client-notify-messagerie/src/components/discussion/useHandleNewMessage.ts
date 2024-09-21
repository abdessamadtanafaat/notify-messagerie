// // src/hooks/useHandleNewMessage.ts
// import { useRef } from 'react'
// import { Message } from '../../interfaces/Discussion'

// const useHandleNewMessage = (messages: Message[], setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
//   const chatContainerRef = useRef<HTMLDivElement | null>(null)

//   const handleNewMessage = (newMessage: Message) => {
//     setMessages((prevMessages) => [...prevMessages, newMessage])  // Append new message to the bottom

//     if (chatContainerRef.current) {
//       setTimeout(() => {
//         chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight  // Scroll to bottom
//       }, 100)  // Delay to ensure UI is updated
//     }
//   }

//   return {
//     handleNewMessage,
//     chatContainerRef,  // Return chat container ref to attach it in the chat component
//   }
// }

// export default useHandleNewMessage
