import { User } from './User'

export interface MyFriends {
    id: string
    user: User;
    mutualFreinds: string[];
    nbMutualFriends: number;
    createdAt: Date;
  }