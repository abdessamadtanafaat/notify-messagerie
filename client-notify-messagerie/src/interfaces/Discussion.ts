import { User } from './User'

export interface Message {
    discussionId: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: Date; 
    read: boolean;
    readTime: Date;
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
    userId: string;
}
