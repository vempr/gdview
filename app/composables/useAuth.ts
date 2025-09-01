interface User {
  id: number;
  username: string;
  admin: boolean;
  created_at: string;
  updated_at: string;
}

const user = ref<User | null>(null);

export const useAuth = () => {
  const fetchUser = async () => {
    try {
      const res = await $fetch('/api/profile');
      if (res.user !== null) user.value = res.user;
      return res;
    } catch (error) {
      user.value = null;
      return null;
    }
  };

  const login = async (credentials: { username: string; password: string }) => {
    const res = await $fetch('/api/login', {
      method: 'POST',
      body: credentials,
      credentials: 'include',
    });

    if (res.success) user.value = res.user;
    if (res.error) return res.error;
  };

  const register = async (credentials: { username: string; password: string }) => {
    const res = await $fetch('/api/register', {
      method: 'POST',
      body: credentials,
      credentials: 'include',
    });

    if (res.success) user.value = res.user;
    if (res.error) return res.error;
  };

  const logout = async () => {
    try {
      await $fetch('/api/session', { method: 'DELETE', credentials: 'include' });
      user.value = null;
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (import.meta.server) {
    const nuxtApp = useNuxtApp();
    const serverAuth = nuxtApp.ssrContext?.event.context.auth;
    if (serverAuth?.user) {
      user.value = serverAuth.user;
    }
  }

  return {
    user: readonly(user),
    fetchUser,
    login,
    register,
    logout,
  };
};
