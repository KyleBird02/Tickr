<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">📚 Your Portfolio</h1>

    <div class="mb-6 space-y-2">
      <h2 class="text-xl">Balance: ${{ balance.toFixed(2) }}</h2>
      <h2 class="text-xl">Portfolio Value: ${{ portfolioValue.toFixed(2) }}</h2>
      <h2 class="text-xl font-semibold">Total Account Value: ${{ totalAccountValue.toFixed(2) }}</h2>
    </div>

    <div v-if="portfolio.length" class="grid gap-6">
      <div
        v-for="stock in portfolio"
        :key="stock.stockName"
        class="border p-4 rounded shadow-sm"
      >
        <h2 class="text-xl font-bold">{{ stock.stockName }}</h2>
        <p>Quantity: {{ stock.quantity }}</p>
        <p>Bought Price: ${{ stock.boughtPrice.toFixed(2) }}</p>
        <p>Current Price: 
          <span v-if="currentPrices[stock.stockName] !== undefined">
            ${{ currentPrices[stock.stockName].toFixed(2) }}
          </span>
          <span v-else>
            Loading...
          </span>
        </p>

        <p>
          P/L: 
          <span
            :class="{
              'text-green-500': getProfitLoss(stock) >= 0,
              'text-red-500': getProfitLoss(stock) < 0
            }"
          >
            ${{ getProfitLoss(stock).toFixed(2) }}
          </span>
        </p>

        <!-- SELL Button -->
        <button
          @click="sellStock(stock.stockName)"
          class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sell
        </button>
      </div>
    </div>

    <div v-else>
      <p>No holdings yet!</p>
    </div>

    <router-link to="/" class="text-blue-500 underline mt-10 block">Back to Market</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { io, Socket } from 'socket.io-client'
import axios from 'axios'

interface PortfolioItem {
  stockName: string;
  quantity: number;
  boughtPrice: number;
}

const balance = ref(0)
const portfolio = ref<PortfolioItem[]>([])
const currentPrices = ref<Record<string, number>>({})

let socket: Socket

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    await fetchPortfolio()
    await fetchCurrentPrices()

    socket = io('http://localhost:5000')

    socket.on('stockUpdate', (stock) => {
      currentPrices.value[stock.Name] = stock.close
    })
  } catch (err) {
    console.error('Failed to fetch portfolio or prices', err)
  }
})

onUnmounted(() => {
  if (socket) {
    socket.disconnect()
  }
})

async function fetchPortfolio() {
  const token = localStorage.getItem('token')
  if (!token) return

  const res = await axios.get('http://localhost:5000/api/orders/portfolio', {
    headers: { Authorization: `Bearer ${token}` }
  })
  balance.value = res.data.balance
  portfolio.value = res.data.portfolio
}

async function fetchCurrentPrices() {
  try {
    const res = await axios.get('http://localhost:5000/api/stocks/latest')
    currentPrices.value = res.data
  } catch (err) {
    console.error('Failed to fetch stock prices', err)
  }
}

function getProfitLoss(stock: PortfolioItem): number {
  const current = currentPrices.value[stock.stockName]
  if (current === undefined) return 0
  return (current - stock.boughtPrice) * stock.quantity
}

const portfolioValue = computed(() => {
  let total = 0
  for (const stock of portfolio.value) {
    const currentPrice = currentPrices.value[stock.stockName]
    if (currentPrice !== undefined) {
      total += currentPrice * stock.quantity
    }
  }
  return total
})

const totalAccountValue = computed(() => {
  return balance.value + portfolioValue.value
})

async function sellStock(stockName: string) {
  const quantityStr = prompt(`Enter quantity to sell for ${stockName}:`)
  if (!quantityStr) return

  const quantity = parseFloat(quantityStr)
  if (isNaN(quantity) || quantity <= 0) {
    alert('Invalid quantity')
    return
  }

  const token = localStorage.getItem('token')
  if (!token) return

  try {
    await axios.post('http://localhost:5000/api/orders', {
      stockName,
      quantity,
      type: 'SELL'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    alert('Stock sold successfully!')
    await fetchPortfolio()
  } catch (err) {
    console.error('Failed to sell stock', err)
    alert('Failed to sell stock')
  }
}
</script>

<style scoped>
/* Add optional styles here */
</style>
