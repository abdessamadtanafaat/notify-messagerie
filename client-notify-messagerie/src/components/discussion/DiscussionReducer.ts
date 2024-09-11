
import { User } from '../../interfaces'
import { Discussion, Message } from '../../interfaces/Discussion'

export type DiscussionState = {
  menuOpen: string | null;
  discussions: Discussion[];
  loading: boolean;
  page: number;
  loadingMoreDiscussions: boolean;
  loadingMoreSearchDiscussions: boolean;
  discussionsSearch: Discussion[]; 
  selectedUser: User | null;
  idDiscussion: string;
  messages: Message[];
  //searchAttempted: boolean; 
  searchInDiscussion: string;

};

const initialState: DiscussionState = {
  menuOpen: null,
  discussions: [],
  loading: true,
  page: 1,
  loadingMoreDiscussions: false,
  loadingMoreSearchDiscussions: false,
  discussionsSearch: [],
  selectedUser: null,
  idDiscussion: '',
  messages: [],
  //searchAttempted: false,
  searchInDiscussion: '',
}

export type Action =
  | { type: 'TOGGLE_MENU'; payload: string | null }
  | { type: 'DELETE_DISCUSSION'; payload: string }
  | { type: 'SET_DISCUSSIONS'; payload: Discussion[] }
  | { type: 'ADD_MORE_DISCUSSIONS'; payload: Discussion[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | {
      type: 'UPDATE_DISCUSSION';
      payload: { newMessage: Message; timestamp: string };
    }
  | {type: 'LOAD_MORE_DISCUSSIONS'; payload: boolean} 
  | { type: 'SET_DISCUSSIONS_SEARCH'; payload: Discussion[] }
  | { type: 'SET_LOADING_MORE_SEARCH_DISCUSSIONS'; payload: boolean }
  | { type: 'ADD_MORE_DISCUSSIONS'; payload: Discussion[] }
  | { type: 'SET_SELECTED_USER'; payload: { user: User; idDiscussion: string } }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'SET_USERS_SEARCH'; payload: Discussion[] }
  // | {type: 'SEARCH_ATTEMPTED'; payload: boolean}
  | { type: 'CLEAR_SEARCH' }
  | { type: 'SET_SEARCH_INPUT'; payload: string }; 

export const DiscussionReducer = (
  state: DiscussionState = initialState,
  action: Action
): DiscussionState => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return {
        ...state,
        menuOpen: action.payload === state.menuOpen ? null : action.payload, // Toggle menu visibility
      }
    case 'DELETE_DISCUSSION':
      return {
        ...state,
        discussions: state.discussions.filter(
          (discussion) => discussion.id !== action.payload
        ),
      }
    case 'SET_DISCUSSIONS':
      console.log('set discussions')
      return { ...state, discussions: action.payload, loading: false, page: 1 }

    case 'ADD_MORE_DISCUSSIONS':
      return {
        ...state,
        discussions: [...state.discussions, ...action.payload],
        loading: false,
      }

    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'UPDATE_DISCUSSION': {
      const { newMessage, timestamp } = action.payload

      // Update discussions with the new message
      const updatedDiscussions = state.discussions.map((discussion) => {
        if (discussion.id === newMessage.discussionId) {
          return {
            ...discussion,
            lastMessage: newMessage,
            lastMessageTimestamp: timestamp,
            lastMessageContent: newMessage.content,
          }
        }
        return discussion
      })

      // Sort discussions with the one containing the new message at the top
      const sortedDiscussions = updatedDiscussions.sort((a, b) => {
        if (a.id === newMessage.discussionId) return -1 // Move discussion with new message to the top
        if (b.id === newMessage.discussionId) return 1
        return (
          new Date(b.lastMessageTimestamp).getTime() -
          new Date(a.lastMessageTimestamp).getTime()
        ) // Sort by lastMessageTimestamp
      })

      return {
        ...state,
        discussions: sortedDiscussions,
      }
    }

    case 'LOAD_MORE_DISCUSSIONS':
        return { ...state, loadingMoreDiscussions: action.payload }

    case 'SET_LOADING_MORE_SEARCH_DISCUSSIONS':
      return { ...state, loadingMoreSearchDiscussions: action.payload }

    case 'SET_DISCUSSIONS_SEARCH':
        return { ...state, discussionsSearch: action.payload, loading: false, page: 1 }

    case 'SET_SELECTED_USER':
          return {
            ...state,
            selectedUser: action.payload.user,
            idDiscussion: action.payload.idDiscussion,
          }
    case 'SET_MESSAGES':
          return {
            ...state,
            messages: action.payload,
          }
    case 'SET_USERS_SEARCH':
          return {
            ...state,
            discussionsSearch: action.payload,
          }
          // case 'SEARCH_ATTEMPTED':
          //   return { ...state, searchAttempted: action.payload }
          case 'SET_SEARCH_INPUT':
              return { ...state, searchInDiscussion: action.payload }
          case 'CLEAR_SEARCH':
              return { ...state, searchInDiscussion: '',
                                 discussionsSearch: [],
                                 //searchAttempted: false,
                                }

              
    default:
      return state
  }
}

export { initialState }
