export const useAuth = () => {
  const user = useState<any | null>('auth.user', () => null);
  const isAuthenticated = computed(() => !!user.value);

  const fetchUser = async () => {
    try {
      const { data } = await $fetch('/api/profile');
      user.value = data;
      return data;
    } catch (error) {
      user.value = null;
      return null;
    }
  };

  const logout = async () => {
    try {
      await $fetch('/api/session', { method: 'DELETE' });
      user.value = null;
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const login = async (credentials: any) => {
    try {
      const res = await $fetch('/api/login', {
        method: 'POST',
        body: credentials,
      });
      if (res.error) return res.error;

      await fetchUser();
    } catch (error) {
      throw error;
    }
  };

  const register = async (credentials: any) => {
    try {
      const res = await $fetch('/api/register', {
        method: 'POST',
        body: credentials,
      });
      if (res.error) return res.error;

      await fetchUser();
    } catch (error) {
      throw error;
    }
  };

  return {
    user: readonly(user),
    isAuthenticated,
    fetchUser,
    logout,
    login,
    register,
  };
};
