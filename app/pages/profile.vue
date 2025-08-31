<script setup lang="ts">
definePageMeta({
  middleware: 'authenticated',
});
const { logout } = useAuth();

const unexpectedError = ref('');

const { data } = await useFetch('/api/profile');
if (data.value?.error) {
  navigateTo('/');
  unexpectedError.value = data.value.error;
}

async function onSubmit() {
  await logout();
  return navigateTo('/');
}
</script>

<template>
  <h1 v-if="unexpectedError.length">Unexpected error: {{ unexpectedError }}</h1>
  <h1 v-else-if="data?.success">Hi {{ data.data.username }}</h1>
  <form @submit.prevent="onSubmit">
    <button type="submit">Log out</button>
  </form>
</template>
