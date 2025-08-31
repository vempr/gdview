<script setup lang="ts">
definePageMeta({
  middleware: 'authenticated',
});

import { ZodError } from 'zod';
import { registerSchema } from '#shared/zod/auth';

const { register } = useAuth();

const serverError = ref('');
const errors = reactive({
  username: '',
  password: '',
});

const credentials = reactive({
  username: '',
  password: '',
});

async function onSubmit() {
  try {
    const validated = registerSchema.parse(credentials);

    const error = await register(validated);
    if (error) serverError.value = error;
    else return navigateTo('/profile');
  } catch (err) {
    if (err instanceof ZodError) {
      errors.username = err.issues[0]?.message ?? '';
      errors.password = err.issues[1]?.message ?? '';
    }
  }
}
</script>

<template>
  <main>
    <h1>Hello from register.vue</h1>

    <form @submit.prevent="onSubmit">
      <label
        >Username
        <input v-model="credentials.username" />
      </label>

      <label
        >Password
        <input v-model="credentials.password" />
      </label>

      <button type="submit">Submit</button>
    </form>

    <h2>Client errors</h2>
    <p>{{ errors.username }}</p>
    <p>{{ errors.password }}</p>

    <h2>Server error: {{ serverError }}</h2>
  </main>
</template>
