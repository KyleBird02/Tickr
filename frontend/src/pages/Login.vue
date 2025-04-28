<template>
  <div class="flex flex-col items-center justify-center h-screen gap-6">
    <h1 class="text-3xl font-bold">Login</h1>
    
    <input
      v-model="email"
      type="email"
      placeholder="Email"
      class="border p-2 w-72 rounded"
    />
    <input
      v-model="password"
      type="password"
      placeholder="Password"
      class="border p-2 w-72 rounded"
    />
    
    <button @click="handleLogin"
      class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-72">
      Login
    </button>

    <router-link to="/register" class="text-blue-500 underline">Don't have an account? Register</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const email = ref('')
const password = ref('')
const router = useRouter()

async function handleLogin() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: email.value,
      password: password.value,
    })

    const token = response.data.token
    localStorage.setItem('token', token)

    router.push('/')
  } catch (error) {
    console.error(error)
    alert('Login failed. Please check your email and password.')
  }
}
</script>
