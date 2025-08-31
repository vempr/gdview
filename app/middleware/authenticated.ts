export default defineNuxtRouteMiddleware(async () => {
  const { data, error } = await useFetch('/api/profile');

  if (error.value || data.value?.error) {
    return navigateTo('/login');
  }
});
