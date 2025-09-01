<script setup lang="ts">
definePageMeta({
  middleware: 'authenticated',
});
const { fetchUser, logout } = useAuth();

const res = await fetchUser();
if (res?.error) {
  navigateTo('/');
}

async function onSubmit() {
  await logout();
  return navigateTo('/');
}
</script>

<template>
  <h1 v-if="res?.success">Hi {{ res.user.username }}</h1>
  <form @submit.prevent="onSubmit">
    <button type="submit">Log out</button>
  </form>
</template>
