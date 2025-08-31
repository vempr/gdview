<script setup lang="ts">
definePageMeta({
  middleware: 'authenticated',
});

const { data } = await useFetch('/api/profile');
</script>

<template>
  <h1 v-if="data?.error">Unexpected error: {{ data.error }}</h1>
  <h1 v-else-if="data?.success">Hi {{ data.data.username }}</h1>
</template>
