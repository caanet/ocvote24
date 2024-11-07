<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-center">California Proposition 34 Results</h1>
      <Prop34 />
    </div>
  </div>
</template>

<script>
import Prop34 from '~/components/Prop34.vue'

export default {
  name: 'Prop34Page',
  components: {
    Prop34
  },
  layout: 'default'  // explicitly specify default layout
}
</script> 