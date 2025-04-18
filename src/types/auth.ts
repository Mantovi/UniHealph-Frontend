export type LoginForm = {
    email: string;
    password: string;
  };
  
  export type RegisterForm = {
    name: string;
    email: string;
    cpf: string;
    password: string;
    phone: string;
  };
  
  export type JwtPayload = {
    sub: string;
    iat: number;
    exp: number;
    role?: 'ADMIN' | 'UNIVERSITY' | 'STUDENT';
  };