<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Header -->
    <header class="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-40">
      <div class="flex justify-between items-center p-4">
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="text-gray-600 hover:text-gray-900"
        >
          <svg 
            class="h-6 w-6" 
            :class="{ 'hidden': isMobileMenuOpen }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg 
            class="h-6 w-6" 
            :class="{ 'hidden': !isMobileMenuOpen }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <NuxtLink 
          to="/" 
          class="text-xl font-bold text-gray-900"
        >
          OC Elections
        </NuxtLink>
        <div class="w-6"><!-- Spacer --></div>
      </div>
    </header>

    <!-- Mobile Navigation Menu -->
    <div 
      v-if="isMobileMenuOpen"
      class="lg:hidden fixed inset-0 z-30 pt-16"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="isMobileMenuOpen = false"></div>
      <div class="relative bg-white h-full w-64 p-4">
        <nav class="space-y-2">
          <NuxtLink 
            v-for="city in cities" 
            :key="city.id"
            :to="`/${city.id}`"
            class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            :class="{ 'bg-blue-50 text-blue-600': $route.path === `/${city.id}` }"
            @click="isMobileMenuOpen = false"
          >
            {{ city.name }}
          </NuxtLink>
        </nav>
      </div>
    </div>

    <!-- Desktop Header -->
    <header class="hidden lg:block fixed top-0 left-0 right-0 bg-white shadow-md z-40">
      <div class="container mx-auto px-4">
        <div class="flex items-center h-16">
          <NuxtLink 
            to="/" 
            class="text-2xl font-bold text-gray-900 mr-8"
          >
            Orange County Elections
          </NuxtLink>
          <nav class="flex space-x-4 overflow-x-auto">
            <NuxtLink 
              v-for="city in cities" 
              :key="city.id"
              :to="`/${city.id}`"
              class="px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
              :class="{ 'bg-gray-100 text-gray-900': $route.path === `/${city.id}` }"
            >
              {{ city.name }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-16">
      <div class="relative isolate flex items-center justify-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5">
        <div class="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
          <div class="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30" style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"></div>
        </div>
        <div class="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
          <div class="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30" style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"></div>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
          <p class="text-sm leading-6 text-gray-900 text-center">
            <strong class="font-semibold">Last Update:</strong>
            <span class="inline-flex items-center rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-900/10 ml-2">
              {{ generatedDate }}
            </span>
          </p>
          <p class="text-sm leading-6 text-gray-900 text-center">
            <strong class="font-semibold">Next Update:</strong>
            <span class="inline-flex items-center rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-900/10 ml-2">
              {{ timeLeft }}
            </span>
            <span class="ml-1">(5:00 PM PT)</span>
          </p>
        </div>
      </div>
      <div class="max-w-full overflow-x-hidden">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-8">
      <div class="container mx-auto px-4 py-6">
        <p class="text-center text-gray-600 text-sm">
          © {{ new Date().getFullYear() }} Victor Cao  Orange County Elections Dashboard
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'

const isMobileMenuOpen = ref(false)

// Navigation data (alphabetically ordered)
const cities = [
  { id: 'costa-mesa', name: 'Costa Mesa' },
  { id: 'fullerton', name: 'Fullerton' },
  { id: 'irvine', name: 'Irvine' },
  { id: 'orange', name: 'Orange' },
  { id: 'santa-ana', name: 'Santa Ana' },
  { id: 'tustin', name: 'Tustin' }
]

// Close mobile menu on route change
watch(() => useRoute().path, () => {
  isMobileMenuOpen.value = false
})

// Close mobile menu on window resize if desktop
onMounted(() => {
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      isMobileMenuOpen.value = false
    }
  })
})

// Cleanup event listener
onUnmounted(() => {
  window.removeEventListener('resize')
})

const getNextUpdate = () => {
  const now = new Date()
  const pacificTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
  let next = new Date(pacificTime)
  
  next.setHours(17, 0, 0, 0)
  
  if (pacificTime.getHours() >= 17) {
    next.setDate(next.getDate() + 1)
  }
  
  return new Date(next.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
}

const timeLeft = ref('')
const lastUpdate = ref('')

// Get the last update time from irvine-races.ts
const { data: raceData } = await useFetch('/api/irvine-races')
const generatedDate = computed(() => {
  if (raceData.value?.generatedDate) {
    return new Date(raceData.value.generatedDate).toLocaleString('en-US', { 
      timeZone: 'America/Los_Angeles',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZoneName: 'short'
    })
  }
  return 'Not available'
})

const updateCountdown = () => {
  const now = new Date()
  const next = getNextUpdate()
  const diff = Math.max(0, next - now)
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  timeLeft.value = `${hours}h ${minutes}m ${seconds}s`
}

onMounted(() => {
  updateCountdown()
  setInterval(updateCountdown, 1000)
})
</script>

<style>
/* Prevent body scroll when mobile menu is open */
body {
  @apply overflow-x-hidden;
}

body.menu-open {
  @apply overflow-hidden;
}

/* Table responsiveness */
.table-container {
  @apply w-full overflow-x-auto;
}

/* Make tables scroll horizontally on mobile */
table {
  @apply min-w-full;
}
</style> 