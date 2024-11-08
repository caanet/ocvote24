<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header with navigation -->
    <div class="mb-8 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Congressional District Results</h1>
      <NuxtLink 
        to="/" 
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Back to Home
      </NuxtLink>
    </div>

    <CongressionalDistricts />
  </div>
</template>

<script setup>
import CongressionalDistricts from '~/components/CongressionalRaces.vue'
</script> 