<template>
  <div class="container mx-auto px-4">
    <div class="py-8">
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
        {{ cityName }} Election Results
      </h1>
      <component :is="`${cityName.replace(/\s+/g, '')}Races`" />
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const cityName = computed(() => {
  const city = route.params.city.toString()
  return city.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
})
</script> 