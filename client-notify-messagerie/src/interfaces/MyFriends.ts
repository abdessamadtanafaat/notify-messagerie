import { User } from './User'

export interface MyFriends {
    id: string
    user: User;
    mutualFreinds: string[];
    nbMutualFriends: number;
    createdAt: Date;
}

// export interface FriendsResult {
//     totalFriends: number;         
//     friendsList: MyFriends[];    
// }

export interface InvitationsFriends {
    id: string
    user: User;
    nbMutualFriends: number;
    sentAt: Date;
    mutualFreinds: string[];
    status: string;
}

export interface AnswerInvitationRequest {
    userId: string;
    friendId: string;
    answerInvitationChoice: InvitationResponse;
}

export enum InvitationResponse {
    Accepted = 0,
    Rejected = 1,
}

export interface FriendsRequests {
    id: string
    user: User;
    nbMutualFriends: number;
    sentAt: Date;
    mutualFreinds: string[];
    status: string;
}

export interface CancelledFriendRequest {
    userId: string;
    friendId: string;
}
