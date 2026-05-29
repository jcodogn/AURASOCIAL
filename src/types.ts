export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  website: string;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  isCreator: boolean;
  walletBalance: number;
  role: 'user' | 'creator' | 'admin';
  stripeAccountId?: string;
}

export type PostType = 'image' | 'video' | 'carousel' | 'file';

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  isVerified: boolean;
  type: PostType;
  media: string[]; // Base64 or URLs
  caption: string;
  hashtags: string[];
  location?: string;
  likesCount: number;
  commentsCount: number;
  hasLiked: boolean;
  hasSaved: boolean;
  createdAt: string;
  comments: Comment[];
  isScheduled?: boolean;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  isVerified: boolean;
  media: string;
  type: 'image' | 'video';
  isViewed: boolean;
  createdAt: string;
  reactionsCount?: number;
}

export interface Comment {
  id: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  likesCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  media?: string;
  mediaType?: 'image' | 'voice' | 'video';
  createdAt: string;
  isRead: boolean;
}

export interface ChatChannel {
  id: string;
  partner: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isOnline: boolean;
  };
  messages: Message[];
  unreadCount: number;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'tip' | 'system';
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  postMedia?: string;
  createdAt: string;
  isRead: boolean;
}

export interface CreatorCampaign {
  id: string;
  title: string;
  description: string;
  price: number;
  subscribersCount: number;
}

export interface MarketItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  sellerUsername: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  target: string;
  user: string;
  timestamp: string;
}
