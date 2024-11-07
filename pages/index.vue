<template>
  <div class="container mx-auto px-4">
    <div class="py-8">
      <!-- City Sections -->
      <div class="space-y-12">
        <div v-for="city in cities" :key="city.id" :id="city.id" class="scroll-mt-20">
          <h2 class="text-xl lg:text-2xl font-bold text-gray-800 mb-6">{{ city.name }} Results</h2>
          <component 
            :is="city.component" 
            v-if="city.component"
          />
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
  { id: 'costa-mesa', name: 'Costa Mesa', component: CostaMesaRaces },
  { id: 'fullerton', name: 'Fullerton', component: FullertonRaces },
  { id: 'irvine', name: 'Irvine', component: IrvineRaces },
  { id: 'orange', name: 'Orange', component: OrangeRaces },
  { id: 'santa-ana', name: 'Santa Ana', component: SantaAnaRaces },
  { id: 'tustin', name: 'Tustin', component: TustinRaces }
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