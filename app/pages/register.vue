<script setup lang="ts">
import { ZodError } from 'zod';
import { registerSchema } from '#shared/zod/auth';

const unexpectedError = ref('');
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

    const res = await $fetch('/api/register', {
      method: 'POST',
      body: validated,
    });
    if (res.error) {
      unexpectedError.value = res.error;
    } else {
      return navigateTo('/profile');
    }
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
    <h1>Hello from login.vue</h1>

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
  </main>
</template>
