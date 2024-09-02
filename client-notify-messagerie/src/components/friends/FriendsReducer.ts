// src/components/FriendsReducer.ts
import { User } from '../../interfaces'
import { MyFriends } from '../../interfaces/MyFriends'

export type FriendsState = {
  loading: boolean;
  friends: MyFriends[];
  commonFriendsCount: Map<string, number>;
  selectedFriend: User | null;
  openPopUp: boolean;
  menuOpen: string | null;
  searchInDiscussion: string;
  usersSearch: User[];
  removeFriend: string;
  page: number;
  hasMore: boolean;
};

// Use `export type` for type-only exports
export type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FRIENDS'; payload: MyFriends[] }
  | { type: 'SET_COMMON_FRIENDS_COUNT'; payload: Map<string, number> }
  | { type: 'SET_SELECTED_FRIEND'; payload: User | null }
  | { type: 'TOGGLE_POPUP'; payload: boolean }
  | { type: 'TOGGLE_MESSAGE'; payload: boolean }
  | { type: 'TOGGLE_MENU'; payload: string | null }
  | { type: 'SET_SEARCH_DISCUSSION'; payload: string }
  | { type: 'SET_USERS_SEARCH'; payload: MyFriends[] }
  | { type: 'REMOVE_FRIEND'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_HAS_MORE'; payload: boolean };
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
  page: 1,
  hasMore: true,
}

const friendsReducer = (state: FriendsState, action: Action): FriendsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    //case 'SET_FRIENDS':
    //  return { ...state, friends: [...state.friends, ...action.payload] } // Append new friends

      case 'SET_FRIENDS': {
        const newFriends = action.payload
        const updatedFriends = [...state.friends, ...newFriends].reduce((uniqueFriends, friend) => {
          if (!uniqueFriends.find(f => f.user.id === friend.user.id)) {
            uniqueFriends.push(friend)
          }
          return uniqueFriends
        }, [] as MyFriends[])
        return { ...state, friends: updatedFriends }
      }

    case 'SET_COMMON_FRIENDS_COUNT':
      return { ...state, commonFriendsCount: action.payload }
    case 'SET_SELECTED_FRIEND':
      return { ...state, selectedFriend: action.payload }
    case 'TOGGLE_POPUP':
      return { ...state, openPopUp: action.payload }
      case 'TOGGLE_MESSAGE':
        return { ...state, openPopUp: action.payload }
    case 'TOGGLE_MENU':
      return {
        ...state,
        menuOpen: action.payload === state.menuOpen ? null : action.payload,
      }
    case 'SET_SEARCH_DISCUSSION':
      return { ...state, searchInDiscussion: action.payload }
    case 'SET_USERS_SEARCH':
      return { ...state, usersSearch: action.payload }
    case 'REMOVE_FRIEND': {
      const updatedFriends = state.friends.filter(
        (friend) => friend.id !== action.payload
      )
      const updatedSearchUsers = state.usersSearch.filter(
        (user) => user.id !== action.payload
    )
      return { ...state, friends: updatedFriends, usersSearch: updatedSearchUsers }
    }
    case 'SET_PAGE':
      return { ...state, page: action.payload }
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload }

      
    default:
      return state
  }
}

export { friendsReducer, initialState }