const isClient = () => typeof window !== 'undefined';

export const setToken = (token: string) => {
  if (isClient()) {
    localStorage.setItem('token', token);
  }
};

export const getToken = (): string | null => {
  if (isClient()) {
    return localStorage.getItem('token');
  }
  return null;
};

export const removeToken = () => {
  if (isClient()) {
    localStorage.removeItem('token');
  }
};