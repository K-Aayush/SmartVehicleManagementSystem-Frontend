export interface userData {
  id: string;
  email: string;
  name: string;
  role: string;
  image: string;
}

export interface loginForm {
  email: string;
  password: string;
}

export interface loginResponse {
  success: boolean;
  user: userData[];
  token: string;
  message: string;
}
