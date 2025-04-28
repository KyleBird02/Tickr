<template>
  <div class="flex flex-col items-center justify-center h-screen gap-4">
    <h1 class="text-2xl font-bold">Register</h1>
    <input v-model="email" placeholder="Email" class="border p-2 w-64 rounded" />
    <input v-model="password" type="password" placeholder="Password" class="border p-2 w-64 rounded" />
    <button @click="register" class="bg-green-500 text-white p-2 rounded w-64">Register</button>
    <p>Already have an account? <router-link to="/login" class="text-blue-500">Login</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const register = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/signup', { email: email.value, password: password.value })
    localStorage.setItem('token', res.data.token)
    router.push('/')
  } catch (err) {
    alert('Registration failed')
  }
}
</script>
