<template>
  <img
    class="landing-background"
    src="../assets/background.png"
  />
  <div class="flex flex-col items-center justify-center h-screen gap-6 z-100">
    <h1 class="text-3xl font-bold z-100">Login</h1>
    
    <input
      v-model="email"
      type="email"
      placeholder="Email"
      class="border p-2 w-72 rounded z-100"
    />
    <input
      v-model="password"
      type="password"
      placeholder="Password"
      class="border p-2 w-72 rounded z-100"
    />
    
    <button @click="handleLogin"
      class="try-button hover:bg-blue-600 text-white p-2 rounded w-72 z-100">
      Login
    </button>

    <router-link to="/register" class="text-blue-500 underline z-100">Don't have an account? Register</router-link>
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
<style scoped>
  .landing-background {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }
  .try-button { /* blue-500 */
    color: black;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 3px solid black;
    width: 18rem;
    text-align: center;
    z-index: 100;
    transition: background-color 0.3s ease;
  }

  .try-button:hover {
    background-color: white; /* blue-600 */
  }

</style>