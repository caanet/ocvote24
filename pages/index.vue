<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Left Navigation Bar -->
    <div class="fixed left-0 top-0 w-64 h-full bg-white shadow-lg p-6">
      <h2 class="text-lg font-bold text-gray-900 mb-4">Cities</h2>
      <nav class="space-y-2">
        <a 
          v-for="city in cities" 
          :key="city.id"
          :href="`#${city.id}`"
          class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          :class="{ 'bg-blue-50 text-blue-600': activeSection === city.id }"
        >
          {{ city.name }}
        </a>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="pl-64">
      <div class="p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Orange County Election Results</h1>
        
        <!-- Costa Mesa Section -->
        <div id="costa-mesa" class="mb-12 scroll-mt-8">
          <div class="mb-6 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800">Costa Mesa Results</h2>
            <NuxtLink 
              to="/costa-mesa" 
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Full Costa Mesa Results
            </NuxtLink>
          </div>
          <CostaMesaRaces />
        </div>

        <!-- Fullerton Section -->
        <div id="fullerton" class="mb-12 scroll-mt-8">
          <div class="mb-6 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800">Fullerton Results</h2>
            <NuxtLink 
              to="/fullerton" 
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Full Fullerton Results
            </NuxtLink>
          </div>
          <FullertonRaces />
        </div>

        <!-- Orange Section -->
        <div id="orange" class="mb-12 scroll-mt-8">
          <div class="mb-6 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800">Orange Results</h2>
            <NuxtLink 
              to="/orange" 
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Full Orange Results
            </NuxtLink>
          </div>
          <OrangeRaces />
        </div>

        <!-- Santa Ana Section -->
        <div id="santa-ana" class="mb-12 scroll-mt-8">
          <div class="mb-6 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800">Santa Ana Results</h2>
            <NuxtLink 
              to="/santa-ana" 
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Full Santa Ana Results
            </NuxtLink>
          </div>
          <SantaAnaRaces />
        </div>

        <!-- Tustin Section -->
        <div id="tustin" class="mb-12 scroll-mt-8">
          <div class="mb-6 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800">Tustin Results</h2>
            <NuxtLink 
              to="/tustin" 
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Full Tustin Results
            </NuxtLink>
          </div>
          <TustinRaces />
        </div>

        <!-- Irvine Section -->
        <div id="irvine" class="mb-12 scroll-mt-8">
          <div class="mb-6 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800">Irvine Results</h2>
            <NuxtLink 
              to="/irvine" 
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Full Irvine Results
            </NuxtLink>
          </div>
          <IrvineRaces />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SantaAnaRaces from '~/components/SantaAnaRaces.vue'
import OrangeRaces from '~/components/OrangeRaces.vue'
import TustinRaces from '~/components/TustinRaces.vue'
import CostaMesaRaces from '~/components/CostaMesaRaces.vue'
import FullertonRaces from '~/components/FullertonRaces.vue'
import IrvineRaces from '~/components/IrvineRaces.vue'

// Navigation data (alphabetically ordered)
const cities = [
  { id: 'costa-mesa', name: 'Costa Mesa' },
  { id: 'fullerton', name: 'Fullerton' },
  { id: 'irvine', name: 'Irvine' },
  { id: 'orange', name: 'Orange' },
  { id: 'santa-ana', name: 'Santa Ana' },
  { id: 'tustin', name: 'Tustin' }
]

// Track active section
const activeSection = ref('')

// Intersection Observer setup
const observerCallback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      activeSection.value = entry.target.id
    }
  })
}

// Setup observers
onMounted(() => {
  const observer = new IntersectionObserver(observerCallback, {
    rootMargin: '-20% 0px -75% 0px'
  })

  // Observe all section elements
  cities.forEach(city => {
    const element = document.getElementById(city.id)
    if (element) observer.observe(element)
  })

  // Cleanup
  onUnmounted(() => {
    cities.forEach(city => {
      const element = document.getElementById(city.id)
      if (element) observer.unobserve(element)
    })
  })
})
</script>

<style>
/* Smooth scrolling behavior */
html {
  scroll-behavior: smooth;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>