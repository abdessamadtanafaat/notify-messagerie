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
  searchReq: string;
  pinned: boolean;
  isBlocked: boolean;
  imagePreview: string | null
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
  searchReq: '',
  pinned: false,
  isBlocked: false, 
  imagePreview: null


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
  | { type: 'LOAD_MORE_DISCUSSIONS'; payload: boolean }
  | { type: 'SET_DISCUSSIONS_SEARCH'; payload: Discussion[] }
  | { type: 'SET_LOADING_MORE_SEARCH_DISCUSSIONS'; payload: boolean }
  | { type: 'ADD_MORE_DISCUSSIONS'; payload: Discussion[] }
  | { type: 'SET_SELECTED_USER'; payload: { user: User; idDiscussion: string } }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'SET_USERS_SEARCH'; payload: Discussion[] }
  | { type: 'CLEAR_SEARCH' }
  | { type: 'SET_SEARCH_INPUT'; payload: string }
  | { type: 'TOGGLE_PIN'; payload: string }
  | { type: 'BLOCK_DISCUSSION'; payload: string }
  | { type: 'UNBLOCK_DISCUSSION'; payload: string }
  | { type: 'SET_IMAGE_PREVIEW'; payload: { imagePreview: string | null } };


export const DiscussionReducer = (
  state: DiscussionState = initialState,
  action: Action
): DiscussionState => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return {
        ...state,
        menuOpen: action.payload
    }
    case 'DELETE_DISCUSSION':
      return {
        ...state,
        discussions: state.discussions.filter(discussion => discussion.id !== action.payload)
    }
    case 'SET_DISCUSSIONS':
      console.log('set discussions')
      return { 
        ...state, 
        discussions: action.payload.map((discussion, index) => ({
          ...discussion,
          originalIndex: index,
        })), 
        loading: false, 
        page: 1 
      }


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
        
        // Find the index of the discussion to update
        const updatedDiscussions = state.discussions.filter(
          discussion => discussion.id !== newMessage.discussionId
        )
  
        // Find the discussion to be moved to the top
        const updatedDiscussion = state.discussions.find(
          discussion => discussion.id === newMessage.discussionId
        )
  
        if (updatedDiscussion) {
          // Update the discussion with the new message
          updatedDiscussion.lastMessage = newMessage
          updatedDiscussion.lastMessageTimestamp = timestamp
  
          // Move the updated discussion to the top
          return {
            ...state,
            discussions: [updatedDiscussion, ...updatedDiscussions]
          }
        }
  
        return state
      }


    
    case 'LOAD_MORE_DISCUSSIONS':
      return { ...state, loadingMoreDiscussions: action.payload }

    case 'SET_LOADING_MORE_SEARCH_DISCUSSIONS':
      return { ...state, loadingMoreSearchDiscussions: action.payload }

    case 'SET_DISCUSSIONS_SEARCH':
      return {
        ...state,
        discussionsSearch: action.payload,
        loading: false,
        page: 1,
      }

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
    case 'SET_SEARCH_INPUT':
      return { ...state, searchReq: action.payload }
    case 'CLEAR_SEARCH':
      return { ...state, searchReq: '', discussionsSearch: [] }


      case 'TOGGLE_PIN': {
        
    const discussionId = action.payload
    
    // Find the discussion and its original index
    const discussionsWithIndex = state.discussions.map((discussion, index) => ({
      ...discussion,
      originalIndex: discussion.originalIndex !== undefined ? discussion.originalIndex : index,
    }))

    const discussions = discussionsWithIndex.map(discussion => {
        if (discussion.id === discussionId) {
            return { 
              ...discussion, 
              isPinned: !discussion.isPinned 
            }
        }
        return discussion
    })

    // Sort discussions with pinned ones at the top
    const sortedDiscussions = discussions.sort((a, b) => {
        if (a.isPinned !== b.isPinned) {
            return a.isPinned ? -1 : 1
        }
        return a.originalIndex - b.originalIndex 
    })

    console.log('Updated Discussions with Pin:', sortedDiscussions) 

    return { ...state, discussions: sortedDiscussions }
      
      }

      case 'BLOCK_DISCUSSION': {
        return {
            ...state,
            discussions: state.discussions.map(discussion =>
                discussion.id === action.payload
                    ? { ...discussion, isBlocked: true }
                    : discussion
            ),
        }
    }
    case 'UNBLOCK_DISCUSSION': {
        return {
            ...state,
            discussions: state.discussions.map(discussion =>
                discussion.id === action.payload
                    ? { ...discussion, isBlocked: false }
                    : discussion
            ),
        }
    }
    case 'SET_IMAGE_PREVIEW':
      return { ...state, imagePreview: action.payload.imagePreview }


    default:
      return state
  }
}

export { initialState }
