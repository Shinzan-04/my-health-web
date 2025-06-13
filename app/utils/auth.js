import jwtDecode from 'jwt-decode';

export interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
  [key: string]: any;
}

export const getToken = (): string | null => {
  const authData = localStorage.getItem('authData');
  try {
    const parsed = JSON.parse(authData || '{}');
    return parsed.token || null;
  } catch {
    return null;
  }
};

export const decodeToken = (): JwtPayload | null => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};

export const getUserRole = (): string | null => {
  const decoded = decodeToken();
  return decoded?.role || null;
};

export const isTokenExpired = (): boolean => {
  const decoded = decodeToken();
  if (!decoded?.exp) return true;
  const now = Date.now() / 1000;
  return decoded.exp < now;
};
