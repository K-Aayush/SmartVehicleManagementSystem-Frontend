export interface loginForm {
  email: string;
  password: string;
}

export interface authResponse {
  success: boolean;
  user: userDataProps;
  token: string;
  message: string;
}

export interface tokenCheck {
  success: boolean;
  user: userDataProps;
}

export interface registerFormData {
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
