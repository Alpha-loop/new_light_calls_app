export interface UserProfile {
  firstName?: string;

  lastName?: string;

  pictureUrl?: string;

  about?: string;

  occupation?: string;

  maritalStatus?: string;

  maritalStatusID?: number | null;

  email?: string;

  mobilePhone?: string;

  homeAddress?: string;

  churchGroup?: string;

  makeProfileVisible?: boolean;
}