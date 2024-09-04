import { User } from './User'

export interface MyFriends {
    id: string
    user: User;
    mutualFreinds: string[];
    nbMutualFriends: number;
    createdAt: Date;
}

export interface FriendsResult {
    totalFriends: number;          // Total number of friends
    friendsList: MyFriends[];    // Array of friends with details
}

export interface InvitationsFriends {
    id: string
    user: User;
    nbMutualFriends: number;
    sentAt: Date;
    mutualFreinds: string[];
    status: string;
}

  