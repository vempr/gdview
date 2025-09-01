const ALLOWED_GUEST_PATHS = ['/', '/about', '/login', '/register'];
const ALLOWED_USER_PATHS = ['/', '/about', '/profile'];

export default defineNuxtRouteMiddleware(async (to) => {
  const { user, fetchUser } = useAuth();

  if (!import.meta.server) await fetchUser();

  const isUserAuthenticated = user.value;

  if (!isUserAuthenticated && !ALLOWED_GUEST_PATHS.includes(to.path)) {
    return navigateTo('/login');
  }

  if (isUserAuthenticated && !ALLOWED_USER_PATHS.includes(to.path)) {
    return navigateTo('/profile');
  }
});
