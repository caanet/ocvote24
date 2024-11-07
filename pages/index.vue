<template>
  <div class="container mx-auto px-4">
    <div class="py-8">
      <!-- All Sections -->
      <div class="space-y-12">
        <div v-for="section in sections" :key="section.id" :id="section.id" class="scroll-mt-20">
          <h2 class="text-xl lg:text-2xl font-bold text-gray-800 mb-6">
            {{ section.name }}{{ section.id === 'prop-34' ? '' : ' Results' }}
          </h2>
          <component 
            :is="section.component" 
            v-if="section.component"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Prop34 from '~/components/Prop34.vue'
import CostaMesaRaces from '~/components/CostaMesaRaces.vue'
import FullertonRaces from '~/components/FullertonRaces.vue'
import IrvineRaces from '~/components/IrvineRaces.vue'
import OrangeRaces from '~/components/OrangeRaces.vue'
import SantaAnaRaces from '~/components/SantaAnaRaces.vue'
import TustinRaces from '~/components/TustinRaces.vue'

// Mobile menu state
const isMobileMenuOpen = ref(false)
const isDesktop = ref(false)

// Navigation data (with Prop 34 at the top)
const sections = [
  { id: 'prop-34', name: 'State Measures', component: Prop34 },
  { id: 'costa-mesa', name: 'Costa Mesa', component: CostaMesaRaces },
  { id: 'fullerton', name: 'Fullerton', component: FullertonRaces },
  { id: 'irvine', name: 'Irvine', component: IrvineRaces },
  { id: 'orange', name: 'Orange', component: OrangeRaces },
  { id: 'santa-ana', name: 'Santa Ana', component: SantaAnaRaces },
  { id: 'tustin', name: 'Tustin', component: TustinRaces }
]

// Update template to use sections instead of cities
const cities = sections // Keep this for backward compatibility if needed

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
  sections.forEach(section => {
    const element = document.getElementById(section.id)
    if (element) observer.observe(element)
  })

  // Initial width check
  checkWidth()
  window.addEventListener('resize', checkWidth)

  // Cleanup
  onUnmounted(() => {
    sections.forEach(section => {
      const element = document.getElementById(section.id)
      if (element) observer.unobserve(element)
    })
    window.removeEventListener('resize', checkWidth)
  })
})

useHead({
  title: 'Orange County Election Results 2024',
  meta: [
    {
      name: 'description',
      content: 'Live election results for Orange County cities including Costa Mesa, Fullerton, Irvine, Orange, Santa Ana, and Tustin. View real-time vote counts and percentages for local races.'
    },
    {
      property: 'og:title',
      content: 'Orange County Election Results 2024'
    },
    {
      property: 'og:description',
      content: 'Live election results for Orange County cities including Costa Mesa, Fullerton, Irvine, Orange, Santa Ana, and Tustin. View real-time vote counts and percentages for local races.'
    },
    {
      name: 'twitter:title',
      content: 'Orange County Election Results 2024'
    },
    {
      name: 'twitter:description',
      content: 'Live election results for Orange County cities including Costa Mesa, Fullerton, Irvine, Orange, Santa Ana, and Tustin. View real-time vote counts and percentages for local races.'
    }
  ]
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