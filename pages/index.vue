<template>
  <div class="min-h-screen bg-gray-50 relative">
    <!-- Mobile Menu Button -->
    <div class="lg:hidden fixed top-4 left-4 z-50">
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="p-2 bg-white rounded-lg shadow-lg"
      >
        <span class="sr-only">Open menu</span>
        <!-- Menu/Close icon -->
        <svg 
          class="h-6 w-6 text-gray-600" 
          :class="{ 'hidden': isMobileMenuOpen }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg 
          class="h-6 w-6 text-gray-600" 
          :class="{ 'hidden': !isMobileMenuOpen }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Left Navigation Bar (Floating on mobile) -->
    <div 
      v-show="isMobileMenuOpen"
      class="lg:hidden fixed left-0 top-0 w-64 h-full bg-white shadow-lg p-6 z-40 overflow-y-auto"
    >
      <h2 class="text-lg font-bold text-gray-900 mb-4">Cities</h2>
      <nav class="space-y-2">
        <a 
          v-for="city in cities" 
          :key="city.id"
          :href="`#${city.id}`"
          @click="isMobileMenuOpen = false"
          class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          :class="{ 'bg-blue-50 text-blue-600': activeSection === city.id }"
        >
          {{ city.name }}
        </a>
      </nav>
    </div>

    <!-- Desktop Navigation (Fixed) -->
    <div class="hidden lg:block fixed left-0 top-0 w-64 h-full bg-white shadow-lg p-6 overflow-y-auto">
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

    <!-- Overlay for mobile -->
    <div 
      v-if="isMobileMenuOpen" 
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
      @click="isMobileMenuOpen = false"
    ></div>

    <!-- Main Content -->
    <div class="lg:pl-64">
      <div class="p-4 lg:p-8">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 mt-12 lg:mt-0">Orange County Election Results</h1>
        
        <!-- Costa Mesa -->
        <div id="costa-mesa" class="mb-12 scroll-mt-8">
          <div class="mb-6">
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800">Costa Mesa Results</h2>
          </div>
          <CostaMesaRaces />
        </div>

        <!-- Fullerton -->
        <div id="fullerton" class="mb-12 scroll-mt-8">
          <div class="mb-6">
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800">Fullerton Results</h2>
          </div>
          <FullertonRaces />
        </div>

        <!-- Irvine -->
        <div id="irvine" class="mb-12 scroll-mt-8">
          <div class="mb-6">
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800">Irvine Results</h2>
          </div>
          <IrvineRaces />
        </div>

        <!-- Orange -->
        <div id="orange" class="mb-12 scroll-mt-8">
          <div class="mb-6">
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800">Orange Results</h2>
          </div>
          <OrangeRaces />
        </div>

        <!-- Santa Ana -->
        <div id="santa-ana" class="mb-12 scroll-mt-8">
          <div class="mb-6">
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800">Santa Ana Results</h2>
          </div>
          <SantaAnaRaces />
        </div>

        <!-- Tustin -->
        <div id="tustin" class="mb-12 scroll-mt-8">
          <div class="mb-6">
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800">Tustin Results</h2>
          </div>
          <TustinRaces />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import CostaMesaRaces from '~/components/CostaMesaRaces.vue'
import FullertonRaces from '~/components/FullertonRaces.vue'
import IrvineRaces from '~/components/IrvineRaces.vue'
import OrangeRaces from '~/components/OrangeRaces.vue'
import SantaAnaRaces from '~/components/SantaAnaRaces.vue'
import TustinRaces from '~/components/TustinRaces.vue'

// Mobile menu state
const isMobileMenuOpen = ref(false)
const isDesktop = ref(false)

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

// Check window width
const checkWidth = () => {
  isDesktop.value = window.innerWidth >= 1024
  if (isDesktop.value) {
    isMobileMenuOpen.value = false
  }
}

// Intersection Observer setup
const observerCallback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      activeSection.value = entry.target.id
    }
  })
}

// Setup observers and window resize listener
onMounted(() => {
  const observer = new IntersectionObserver(observerCallback, {
    rootMargin: '-20% 0px -75% 0px'
  })

  // Observe all section elements
  cities.forEach(city => {
    const element = document.getElementById(city.id)
    if (element) observer.observe(element)
  })

  // Initial width check
  checkWidth()
  window.addEventListener('resize', checkWidth)

  // Cleanup
  onUnmounted(() => {
    cities.forEach(city => {
      const element = document.getElementById(city.id)
      if (element) observer.unobserve(element)
    })
    window.removeEventListener('resize', checkWidth)
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

/* Prevent scroll when mobile menu is open */
.overflow-hidden {
  overflow: hidden;
}
</style>