export interface Group {
  id: string;
  name: string;
  description: string;
  groupTypeName: string;
  imageUrl: string | null;
  meetingDays: string | null;
  meetingFrequency: string | null;
  meetingLocation: string | null;
  whatsAppUrl: string | null;
  telegramUrl: string | null;
  websiteUrl: string | null;
  peopleInGroupsCount: number;
  personInGroupID?: string | null;
}

export interface GroupPerson {
  firstName: string;
  lastName: string;
  photo: string | null;
  email?: string;
  phoneNumber?: string;
}

export interface GroupManager {
  id: string;
  person: GroupPerson;
}

export interface GroupEvent {
  id: string;
  eventName: string;
  eventDate: string;
  onlineUrl: string | null;
}

export interface GroupDetail extends Group {
  overview?: {
    totalEvent?: number;
    totalMembers?: number;
    averageAttendance?: number;
  } | null;
  groupManagers?: GroupManager[] | null;
  groupEvents?: GroupEvent[] | null;
}
