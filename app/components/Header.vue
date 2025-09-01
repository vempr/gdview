<script setup lang="ts">
import logo from '@@/public/logo.png';
const { user } = useAuth();

const links = computed(() => {
  return user.value ? ['/', '/about', '/profile'] : ['/', '/about', '/login', '/register'];
});
</script>

<template>
  <header>
    <img :src="logo" class="rounded-lg size-20" />
    <!-- NextImg doesn't work in development for some reason :/ -->
    <p class="italic">This is a header from Header.vue with <code>class="italic"</code></p>
    <client-only>
      <ul>
        <li v-for="link in links">
          <NuxtLink :to="link">{{ link }}</NuxtLink>
        </li>
      </ul>
    </client-only>
  </header>
</template>
