import { User } from './User'

export interface Message {
    id: string;
    discussionId: string;
    senderId: string;
    firstName: string;
    lastName: string;
    receiverId: string;
    content: string;
    timestamp: Date; 
    read: boolean;
    readTime: Date;
    type: string;


}

export interface AudioMessage extends Message {
    type: 'audio';
}

export interface FileMessage extends Message {
    type: 'file';
}
export interface Discussion {
    id: string;
    lastMessage: Message;
    participants: string[];
    lastMessageTimestamp: string; 
    lastMessageContent: string;
    receiver: User;
    isPinned: boolean;
    isBlocked: boolean;
    originalIndex?: number; 

}

export interface TypingNotification {
    type: 'typing';
    discussionId: string;
    senderId: string;
    receiverId : string;

}

export interface SeenNotification {
    type: 'seen'
    discussionId: string;
    messageId: string; 
    senderId: string;
    receiverId: string;
    readTime: Date; 
    isSeen: boolean;
}

export interface RecordingNotification {
    type: 'recording'
    discussionId: string;
    senderId: string;
    receiverId: string;
}

export interface SeenNotif {
    isSeen: boolean;
    seenDate?: Date | string
}

export enum DoingWithDiscussionOperation {
    Blocked = 0,
    Archived = 1,
    Pinned = 2
}

export interface DoingWithDiscussion {
    discussionId: string;
    doingWithDiscussionChoice: DoingWithDiscussionOperation;
}

