export interface loginForm {
  email: string;
  password: string;
}

export interface roles {
  role: "USER" | "VENDOR" | "SERVICE_PROVIDER" | "ADMIN";
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
  message: string;
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

export interface productDataProps {
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface vendorProductResponse {
  success: boolean;
  message: string;
  product: productDataProps;
  token: string;
  images: string[];
}
