<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">📚 Your Portfolio</h1>
    <div class="mb-4">
      <h2 class="text-xl">Balance: ${{ balance }}</h2>
    </div>
    <div v-if="portfolio.length">
      <div v-for="stock in portfolio" :key="stock.stockName" class="border p-4 mb-2 rounded shadow">
        <h2 class="text-xl">{{ stock.stockName }}</h2>
        <p>Quantity: {{ stock.quantity }}</p>
      </div>
    </div>
    <div v-else>
      <p>No holdings yet!</p>
    </div>
    <router-link to="/" class="text-blue-500">Back to Market</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const balance = ref(0)
const portfolio = ref([])

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const res = await axios.get('http://localhost:5000/api/orders/portfolio', {
      headers: { Authorization: `Bearer ${token}` }
    })
    balance.value = res.data.balance
    portfolio.value = res.data.portfolio
  } catch (err) {
    alert('Failed to fetch portfolio')
  }
})
</script>
