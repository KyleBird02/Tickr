<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">📈 Live Stock Market</h1>

    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search stocks..."
        class="border p-3 w-full md:w-1/2 rounded shadow-sm"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div
          v-for="stock in filteredStocks"
          :key="stock.Name"
          @click="selectStock(stock)"
          class="border p-4 rounded cursor-pointer hover:bg-gray-100 transition shadow"
        >
          <h2 class="text-xl">{{ stock.Name }}</h2>
          <p>Price: ${{ stock.close }}</p>
          <p>Date: {{ stock.date }}</p>
        </div>
      </div>

      <div v-if="selectedStock" class="border p-6 rounded shadow-lg">
        <h2 class="text-xl font-bold mb-4">Trade {{ selectedStock.Name }}</h2>

        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-gray-700 mb-2">Quantity</label>
            <input type="number" v-model.number="quantity" class="border p-2 w-full rounded" min="1" />
          </div>

          <div>
            <label class="block text-gray-700 mb-2">Order Type</label>
            <select v-model="orderType" class="border p-2 w-full rounded">
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>

          <button @click="placeOrder" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded">
            Place Order
          </button>
        </div>
      </div>
    </div>

    <router-link to="/portfolio" class="text-blue-500 underline mt-10 block">Go to Portfolio</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { io, Socket } from 'socket.io-client'
import axios from 'axios'

interface Stock {
  Name: string;
  close: number;
  date: string;
}

const stocks = ref<Stock[]>([])
const selectedStock = ref<Stock | null>(null)
const quantity = ref<number>(1)
const orderType = ref<'BUY' | 'SELL'>('BUY')
const searchQuery = ref('')

let socket: Socket

onMounted(() => {
  socket = io('http://localhost:5000')

  socket.on('stockUpdate', (stock: Stock) => {
    const idx = stocks.value.findIndex(s => s.Name === stock.Name)
    if (idx !== -1) {
      stocks.value[idx] = stock
    } else {
      stocks.value.push(stock)
    }
  })
})

onUnmounted(() => {
  if (socket) {
    // socket.disconnect()
    console.log('Socket disconnected ✅')
  }
})

function selectStock(stock: Stock) {
  selectedStock.value = stock
}

async function placeOrder() {
  if (!selectedStock.value) return

  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login first.')
      return
    }

    await axios.post('http://localhost:5000/api/orders', {
      stockName: selectedStock.value.Name,
      quantity: quantity.value,
      type: orderType.value,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    alert('Order placed successfully!')
    quantity.value = 1
    selectedStock.value = null
  } catch (error) {
    console.error(error)
    alert('Order failed.')
  }
}

const filteredStocks = computed(() => {
  if (!searchQuery.value.trim()) {
    return stocks.value
  }
  return stocks.value.filter(stock =>
    stock.Name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>
