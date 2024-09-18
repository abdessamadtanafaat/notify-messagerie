// import React, { createContext, useReducer, useContext, ReactNode } from 'react'
// import { Message } from '../interfaces/Discussion'

// interface MessageState {
//     messages: Message[];
//     loadingMore: boolean;
//     cursor: Date | null;
//     hasMore: boolean;
// }

// type MessageAction =
//     | { type: 'SET_MESSAGES'; payload: Message[] }
//     | { type: 'ADD_MESSAGE'; payload: Message }
//     | { type: 'SET_LOADING_MORE'; payload: boolean }
//     | { type: 'SET_CURSOR'; payload: Date | null }
//     | { type: 'SET_HAS_MORE'; payload: boolean };

// const MessageContext = createContext<{ state: MessageState; dispatch: React.Dispatch<MessageAction> } | undefined>(undefined)

// const messageReducer = (state: MessageState, action: MessageAction): MessageState => {
//     switch (action.type) {
//         case 'SET_MESSAGES':
//             return { ...state, messages: [...action.payload, ...state.messages], loadingMore: false }
//         case 'ADD_MESSAGE':
//             return { ...state, messages: [...state.messages, action.payload] }
//         case 'SET_LOADING_MORE':
//             return { ...state, loadingMore: action.payload }
//         case 'SET_CURSOR':
//             return { ...state, cursor: action.payload }
//         case 'SET_HAS_MORE':
//             return { ...state, hasMore: action.payload }
//         default:
//             return state
//     }
// }

// export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//     const [state, dispatch] = useReducer(messageReducer, {
//         messages: [],
//         loadingMore: false,
//         cursor: null,
//         hasMore: true,
//     })

//     return <MessageContext.Provider value={{ state, dispatch }}>{children}</MessageContext.Provider>
// }

// export const useMessageContext = () => {
//     const context = useContext(MessageContext)
//     if (!context) {
//         throw new Error('useMessageContext must be used within a MessageProvider')
//     }
//     return context
// }
