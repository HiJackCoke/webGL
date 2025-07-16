export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface Theme {
  mode: "light" | "dark";
  primaryColor: string;
}
