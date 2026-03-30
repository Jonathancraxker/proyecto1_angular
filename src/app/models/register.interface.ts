export interface UserRegister {
  nombre_completo: string;
  username: string;
  email: string;
  password?: string;
  direccion: string;
  telefono: string;
}

export interface AuthResponse {
  message: string;
  user?: UserRegister;
  error?: string;
}