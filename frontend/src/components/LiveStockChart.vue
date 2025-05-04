<template>
  <div class="p-4 border mt-4">
    <p class="mb-2 font-medium">Live Chart for {{ symbol }}</p>

    <Line
      v-if="chartData.labels.length"
      :data="chartData"
      :options="chartOptions"
    />
    <p v-else class="text-sm text-gray-400">Waiting for data...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { io } from 'socket.io-client'

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({ symbol: String })

const socket = io('http://localhost:5000')
const dataPoints = ref([])

const palette = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6', '#14B8A6', '#D946EF']
const assignedColors = ref({})

function getColorForSymbol(symbol) {
  const key = symbol.toUpperCase()
  if (!assignedColors.value[key]) {
    const randomColor = palette[Math.floor(Math.random() * palette.length)]
    assignedColors.value[key] = randomColor
  }
  return assignedColors.value[key]
}

const chartData = ref({ labels: [], datasets: [] })

const chartOptions = {
  responsive: true,
  scales: {
    x: {
      ticks: { autoSkip: true },
    },
    y: {
      beginAtZero: false
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  }
}

const updateChart = () => {
  const sorted = [...dataPoints.value].sort((a, b) => new Date(a.date) - new Date(b.date))
  const labels = sorted.map(p => p.date)
  const data = sorted.map(p => Number(p.close))
  const color = getColorForSymbol(props.symbol)

  console.log("📊 Updating chart:", { symbol: props.symbol, color, labels, data })

  chartData.value = {
    labels,
    datasets: [{
      label: `${props.symbol} Price`,
      data,
      borderColor: color,
      backgroundColor: color,
      tension: 0.3,
      fill: false,
      pointRadius: 3,
      pointHoverRadius: 5
    }]
  }
}

onMounted(() => {
  socket.on('stockUpdate', tick => {
    if (tick.Name.toUpperCase() === props.symbol.toUpperCase()) {
      console.log('✅ Chart received:', tick)
      dataPoints.value.push(tick)
      updateChart()
    }
  })
})
</script>
