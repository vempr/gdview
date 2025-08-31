<script setup lang="ts">
const { isAuthenticated, fetchUser } = useAuth();

await fetchUser();

const links = computed(() => {
  return isAuthenticated.value ? ['/', '/about', '/profile'] : ['/', '/about', '/login', '/register'];
});
</script>

<template>
  <header>
    <NuxtImg src="/logo.png" class="rounded-lg size-20" />
    <p class="italic">This is a header from Header.vue with <code>class="italic"</code></p>
    <ul>
      <li v-for="link in links">
        <NuxtLink :to="link">{{ link }}</NuxtLink>
      </li>
    </ul>
  </header>
</template>
