
import { Parent, Playdate, Message } from './types';

export const MOCK_CURRENT_USER: Parent = {
  id: 'p1',
  name: 'Sarah Jenkins',
  neighborhood: 'Maplewood',
  photoUrl: 'https://picsum.photos/seed/sarah/200/200',
  verified: true,
  children: [
    { id: 'c1', name: 'Leo', age: 5, interests: ['Dinosaurs', 'Lego', 'Soccer'] },
    { id: 'c2', name: 'Mia', age: 3, interests: ['Drawing', 'Playgrounds'] }
  ]
};

export const NEW_USER: Parent = {
  id: 'p_new',
  name: 'New Parent',
  neighborhood: 'Downtown',
  photoUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix',
  verified: false,
  children: []
};

export const MOCK_PARENTS: Parent[] = [
  {
    id: 'p2',
    name: 'David Chen',
    neighborhood: 'Maplewood',
    photoUrl: 'https://picsum.photos/seed/david/200/200',
    verified: true,
    children: [
      { id: 'c3', name: 'Kai', age: 5, interests: ['Soccer', 'Robots'] }
    ]
  },
  {
    id: 'p3',
    name: 'Emily Rodriguez',
    neighborhood: 'Oak Creek',
    photoUrl: 'https://picsum.photos/seed/emily/200/200',
    verified: true,
    children: [
      { id: 'c4', name: 'Sofia', age: 4, interests: ['Dancing', 'Dolls'] },
      { id: 'c5', name: 'Mateo', age: 7, interests: ['Minecraft', 'Biking'] }
    ]
  },
  {
    id: 'p4',
    name: 'Michael Johnson',
    neighborhood: 'Maplewood',
    photoUrl: 'https://picsum.photos/seed/mike/200/200',
    verified: false,
    children: [
      { id: 'c6', name: 'Jordan', age: 6, interests: ['Basketball', 'Video Games'] }
    ]
  }
];

// Helper to get dynamic local date string (YYYY-MM-DD)
const getFutureDate = (daysToAdd: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  
  const year = date.getFullYear();
  // getMonth is 0-indexed
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export const MOCK_PLAYDATES: Playdate[] = [
  {
    id: 'pd1',
    title: 'Park Afternoon',
    date: getFutureDate(0), // Today
    time: '15:00',
    location: 'Central Park Playground',
    hostId: 'p2',
    attendees: ['p1', 'p2'],
    description: 'Casual meet up at the big slide area. Bringing snacks!',
    isPublic: true,
    type: 'group'
  },
  {
    id: 'pd2',
    title: 'Lego Building Session',
    date: getFutureDate(2), // 2 days from now
    time: '10:30',
    location: 'Sarah\'s House',
    hostId: 'p1',
    attendees: ['p1', 'p3'],
    description: 'Indoor playdate since it might rain.',
    isPublic: false,
    type: 'one-time'
  },
  {
    id: 'pd3',
    title: 'Soccer Practice Meetup',
    date: getFutureDate(5), // 5 days from now
    time: '16:00',
    location: 'Community Field',
    hostId: 'p4',
    attendees: ['p1', 'p4', 'p2'],
    description: 'Getting the kids together for some drills.',
    isPublic: true,
    type: 'group'
  }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    senderId: 'p2',
    receiverId: 'p1',
    content: "Hi Sarah! Is Leo still interested in the soccer meetup?",
    timestamp: '2023-10-25T14:30:00',
    isRead: false
  },
  {
    id: 'm2',
    senderId: 'p3',
    receiverId: 'p1',
    content: "Thanks for inviting Sofia yesterday, she had a blast!",
    timestamp: '2023-10-24T09:15:00',
    isRead: true
  }
];

export const ACTIVITY_CATEGORIES = [
    "Playgrounds", "Indoor Play", "Museums", "Libraries", "Parks", "Zoos"
];
