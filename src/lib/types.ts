export interface loginForm {
  email: string;
  password: string;
}

export interface loginResponse {
  success: boolean;
  user: userDataProps;
  token: string;
  message: string;
}

export interface registerForm {
  email: string;
  password: string;
  name: string;
  role: string;
  profileImage?: string;
  phone: string;
  companyName?: string;
}

export interface userDataProps {
  id: string;
  email: string;
  name: string;
  password: string;
  role: string;
  profileImage?: string;
  phone: string;
  companyName?: string;
}
