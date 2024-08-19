import { User } from './User'

export interface Message {
    id: string;
    discussionId: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: Date; 
    read: boolean;
    readTime: Date;
    type: string;
}

export interface Discussion {
    id: string;
    lastMessage: Message;
    participants: string[]; // Array of user IDs
    lastMessageTimestamp: string; // Use ISODate string format
    lastMessageContent: string;
    receiver: User;
}

export interface TypingNotification {
    type: 'typing';
    senderId: string;
    receiverId : string;

}

export interface SeenNotification {
    type: 'seen'
    messageId: string; 
    senderId: string;
    receiverId: string;
    readTime: Date; 
    isSeen: boolean;
}
export interface SeenNotif {
    isSeen: boolean;
    seenDate?: Date;
}
