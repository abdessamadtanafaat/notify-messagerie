// src/components/FriendsReducer.ts
import { User } from '../../interfaces'

type FriendsState = {
  loading: boolean;
  friends: User[];
  commonFriendsCount: Map<string, number>;
  selectedFriend: User | null;
  openPopUp: boolean;
  menuOpen: string | null;
  searchInDiscussion: string ;
  usersSearch: User[]; 
  removeFriend: string;
};

// Use `export type` for type-only exports
export type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FRIENDS'; payload: User[] }
  | { type: 'SET_COMMON_FRIENDS_COUNT'; payload: Map<string, number> }
  | { type: 'SET_SELECTED_FRIEND'; payload: User | null }
  | { type: 'TOGGLE_POPUP'; payload: boolean }
  | { type: 'TOGGLE_MENU'; payload: string | null }
  | {type: 'SET_SEARCH_DISCUSSION'; payload: string}
  |{type: 'SET_USERS_SEARCH'; payload: User[]}
  |{type: 'REMOVE_FRIEND'; payload: string};
const initialState: FriendsState = {
  loading: true,
  friends: [],
  commonFriendsCount: new Map(),
  selectedFriend: null,
  openPopUp: false,
  menuOpen: null,
  searchInDiscussion: '', 
  usersSearch: [],
  removeFriend: '',
}


const friendsReducer = (state: FriendsState, action: Action): FriendsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_FRIENDS':
      return { ...state, friends: action.payload }
    case 'SET_COMMON_FRIENDS_COUNT':
      return { ...state, commonFriendsCount: action.payload }
    case 'SET_SELECTED_FRIEND':
      return { ...state, selectedFriend: action.payload }
    case 'TOGGLE_POPUP':
      return { ...state, openPopUp: action.payload }
    case 'TOGGLE_MENU':
      return { ...state, menuOpen: action.payload }
    case 'SET_SEARCH_DISCUSSION':
    return { ...state, searchInDiscussion: action.payload }
    case 'SET_USERS_SEARCH':
        return { ...state, usersSearch: action.payload }
        case 'REMOVE_FRIEND': {
            const updatedFriends = state.friends.filter(friend => friend.id !== action.payload)
            return { ...state, friends: updatedFriends }
        }    
    default:
      return state
  }
}

export { friendsReducer, initialState }
