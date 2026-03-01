export interface LoginCredentials {
  email: string;
  password: string;
}

export enum UserRole {
  SUPERADMIN = 'superadmin',
  DEAN = 'dean',
  FACULTY = 'faculty',
  ADMIN = 'admin',
  ORGANIZATION = 'organization',
}

export interface UserProfile {
  admin_id?: number;
  dean_id?: number;
  faculty_id?: number;
  organization_id?: number;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  organization_name?: string;
  email?: string;
  contact_number?: string;
  department_id?: number;
  department_name?: string;
  description?: string;
  name?: string;
}

export interface User {
  user_id: number;
  email: string;
  role: UserRole;
  profile: UserProfile;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
  redirectPath: string;
}
