<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Header with navigation -->
      <div class="mb-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Irvine Election Results</h1>
        <NuxtLink 
          to="/" 
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to Home
        </NuxtLink>
      </div>

      <!-- Results Component -->
      <IrvineRaces />
    </div>
  </div>
</template>

<script setup>
import IrvineRaces from '~/components/IrvineRaces.vue'
</script> 