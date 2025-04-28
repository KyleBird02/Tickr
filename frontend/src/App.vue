<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="flex items-center justify-between p-4 bg-white shadow">
      <div class="text-xl font-bold">
        <router-link to="/">StockTrader</router-link>
      </div>
      <div class="flex items-center gap-4">
        <router-link to="/" class="text-gray-700 hover:text-blue-500">Market</router-link>
        <router-link to="/portfolio" class="text-gray-700 hover:text-blue-500">Portfolio</router-link>
        <router-link v-if="!isLoggedIn" to="/login" class="text-gray-700 hover:text-blue-500">Login</router-link>
        <button v-else @click="logout" class="text-gray-700 hover:text-red-500">Logout</button>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isLoggedIn = computed(() => {
  return !!localStorage.getItem('token')
})

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
