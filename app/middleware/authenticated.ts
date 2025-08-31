const ALLOWED_GUEST_PATHS = ['/', '/about', '/login', '/register'];
const ALLOWED_USER_PATHS = ['/', '/about', '/profile'];

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, fetchUser } = useAuth();
  await fetchUser();
  const isUserAuthenticated = isAuthenticated.value;

  if (!isUserAuthenticated && !ALLOWED_GUEST_PATHS.includes(to.path)) {
    return navigateTo('/login');
  }

  if (isUserAuthenticated && !ALLOWED_USER_PATHS.includes(to.path)) {
    return navigateTo('/profile');
  }
});
