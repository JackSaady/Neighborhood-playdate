export interface Child {
  id: string;
  name: string;
  age: number;
  interests: string[];
}

export interface Parent {
  id: string;
  name: string;
  neighborhood: string;
  photoUrl: string;
  children: Child[];
  verified: boolean;
}

export interface Playdate {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  hostId: string;
  attendees: string[]; // Parent IDs
  description: string;
  isPublic: boolean;
  type: 'one-time' | 'recurring' | 'group';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ActivitySuggestion {
  name: string;
  type: string;
  description: string;
  address?: string;
  rating?: number;
  googleMapsUri?: string;
}
