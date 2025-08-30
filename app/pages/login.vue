<script setup lang="ts">
import { ZodError } from 'zod';
import { loginSchema } from '#shared/zod/auth';

const errors = reactive({
  username: '',
  password: '',
});

const credentials = reactive({
  username: '',
  password: '',
});

async function onSubmit() {
  console.log('hello');
  try {
    const validated = loginSchema.parse(credentials);
    const res = await $fetch('/api/login', {
      method: 'POST',
      body: validated,
    });
    console.log(res);
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

    <h2>Errors</h2>
    <p>{{ errors.username }}</p>
    <p>{{ errors.password }}</p>
  </main>
</template>
