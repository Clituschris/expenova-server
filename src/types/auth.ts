export interface CreateUserBody {
  email: string;
  name: string;
  phone: string;
  password_hash: string;
}

export interface SignupBody {
  email: string;
  name: string;
  phone: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface ResetKeyBody {
  email: string;
  phone: string;
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  phone: string;
  password_hash: string;
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
}
