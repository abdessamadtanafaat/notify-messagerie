// src/components/FriendsReducer.ts
import { User } from '../../interfaces'
import {
  MyFriends,
  InvitationsFriends,
  FriendsRequests,
} from '../../interfaces/MyFriends'

export type FriendsState = {
  loading: boolean;
  friends: MyFriends[];
  loadingMoreFriends: boolean;
  commonFriendsCount: Map<string, number>;
  selectedFriend: User | null;
  openPopUp: boolean;
  menuOpen: string | null;
  searchReq: string;
  usersSearch: MyFriends[];
  invitations: InvitationsFriends[];
  friendsRequests: FriendsRequests[];
  loadingMoreInvitations: boolean;
  loadingMoreFriendsRequests: boolean;
  loadingMoreSearchUsers: boolean;
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
  | { type: 'SET_SEARCH_FRIENDS'; payload: string }
  | { type: 'SET_USERS_SEARCH'; payload: MyFriends[] }
  | { type: 'SET_INVITATIONS'; payload: InvitationsFriends[] }
  | { type: 'REMOVE_FRIEND'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'ADD_MORE_USERS'; payload: MyFriends[] }
  | { type: 'ADD_MORE_INVITATIONS'; payload: InvitationsFriends[] }
  | { type: 'ADD_MORE_FRIENDS_REQUESTS'; payload: FriendsRequests[] }
  | { type: 'REMOVE_INVITATIONS'; payload: string }
  | { type: 'REMOVE_FRIEND_REQUEST'; payload: string }
  | { type: 'SET_FRIENDS_REQUESTS'; payload: FriendsRequests[] }
  | { type: 'SET_LOADING_MORE_FRIENDS'; payload: boolean }
  | { type: 'SET_LOADING_MORE_FRIENDS_REQUESTS'; payload: boolean }
  | { type: 'SET_LOADING_MORE_INVITATIONS'; payload: boolean }
  | { type: 'ADD_MORE_FRIENDS'; payload: MyFriends[] }
  | { type: 'SET_LOADING_MORE_SEARCH_USERS'; payload: boolean };

const initialState: FriendsState = {
  loading: true,
  friends: [],
  loadingMoreFriends: false,
  loadingMoreSearchUsers: false,
  commonFriendsCount: new Map(),
  selectedFriend: null,
  openPopUp: false,
  menuOpen: null,
  searchReq: '',
  usersSearch: [],
  invitations: [],
  loadingMoreInvitations: false,
  friendsRequests: [],
  loadingMoreFriendsRequests: false,
  removeFriend: '',
  page: 1,
  hasMore: true,
}
const friendsReducer = (state: FriendsState, action: Action): FriendsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_FRIENDS': {
      const newFriends = action.payload
      const updatedFriends = [...state.friends, ...newFriends].reduce(
        (uniqueFriends, friend) => {
          if (!uniqueFriends.find((f) => f.user.id === friend.user.id)) {
            uniqueFriends.push(friend)
          }
          return uniqueFriends
        },
        [] as MyFriends[]
      )
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
    case 'SET_SEARCH_FRIENDS':
      return { ...state, searchReq: action.payload }
    case 'SET_USERS_SEARCH':
      return { ...state, usersSearch: action.payload, loading: false, page: 1 }

    case 'SET_INVITATIONS':
      return { ...state, invitations: action.payload, loading: false, page: 1 }
    case 'SET_FRIENDS_REQUESTS':
      return {
        ...state,
        friendsRequests: action.payload,
        loading: false,
        page: 1,
      }
    case 'ADD_MORE_USERS':
      return {
        ...state,
        usersSearch: [...state.usersSearch, ...action.payload],
        loading: false,
      }
    case 'ADD_MORE_INVITATIONS':
      return {
        ...state,
        invitations: [...state.invitations, ...action.payload],
        loading: false,
      }

    case 'ADD_MORE_FRIENDS':
      return {
        ...state,
        friends: [...state.friends, ...action.payload],
        loading: false,
      }

    case 'ADD_MORE_FRIENDS_REQUESTS':
      return {
        ...state,
        friendsRequests: [...state.friendsRequests, ...action.payload],
        loading: false,
      }

    case 'REMOVE_FRIEND': {
      const updatedFriends = state.friends.filter(
        (friend) => friend.user.id !== action.payload
      )
      const updatedSearchUsers = state.usersSearch.filter(
        (user) => user.user.id !== action.payload
      )
      return {
        ...state,
        friends: updatedFriends,
        usersSearch: updatedSearchUsers,
      }
    }
    case 'SET_PAGE':
      return { ...state, page: action.payload }
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload }
    case 'REMOVE_INVITATIONS':
      return {
        ...state,
        invitations: state.invitations.filter(
          (invitation) => invitation.user.id !== action.payload
        ),
      }
    case 'REMOVE_FRIEND_REQUEST':
      return {
        ...state,
        friendsRequests: state.invitations.filter(
          (friendsRequest) => friendsRequest.user.id !== action.payload
        ),
      }

    case 'SET_LOADING_MORE_INVITATIONS':
      return { ...state, loadingMoreInvitations: action.payload }
    case 'SET_LOADING_MORE_FRIENDS_REQUESTS':
      return { ...state, loadingMoreFriendsRequests: action.payload }
    case 'SET_LOADING_MORE_FRIENDS':
      return { ...state, loadingMoreFriends: action.payload }

    case 'SET_LOADING_MORE_SEARCH_USERS':
      return { ...state, loadingMoreSearchUsers: action.payload }

      


    default:
      return state
  }
}

export { friendsReducer, initialState }
