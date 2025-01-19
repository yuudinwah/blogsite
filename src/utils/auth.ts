import { auth } from './firebase';

export const setUserCookie = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    // Set cookie
    document.cookie = `session=${token}; path=/`;
  }
};

export const removeUserCookie = () => {
  document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
};