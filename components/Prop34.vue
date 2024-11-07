<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="measure">
      <h1 class="text-2xl font-bold">Proposition {{ measure.Number }}</h1>
      <h2 class="text-xl mb-6 text-gray-700">{{ measure.Name }}</h2>
      
      <!-- Total Votes -->
      <div class="mb-4 text-gray-600">
        Total Votes: {{ totalVotes }}
      </div>

      <div class="space-y-4">
        <!-- Yes Votes -->
        <div class="relative pt-1">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-lg font-semibold inline-block">Yes</span>
              <span v-if="difference > 0" 
                class="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium border-green-200 bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                Leading (+{{ Math.abs(difference) }}%)
              </span>
            </div>
            <div class="text-right">
              <span class="text-lg font-semibold inline-block">{{ measure.yesPercent }}%</span>
              <span class="text-sm text-gray-600 ml-2">({{ formatNumber(measure.yesVotes) }} votes)</span>
            </div>
          </div>
          <div class="w-full overflow-hidden h-2 text-xs flex rounded bg-green-100 mt-1">
            <div
              class="w-full h-full bg-green-500"
              :style="{
                width: `${measure.yesPercent}%`,
                minWidth: '4px'
              }"
            ></div>
          </div>
        </div>

        <!-- No Votes -->
        <div class="relative pt-1">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-lg font-semibold inline-block">No</span>
              <span v-if="difference < 0" 
                class="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium border-red-200 bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20">
                Leading by {{ Math.abs(difference) }}%
              </span>
            </div>
            <div class="text-right">
              <span class="text-lg font-semibold inline-block">{{ measure.noPercent }}%</span>
              <span class="text-sm text-gray-600 ml-2">({{ formatNumber(measure.noVotes) }} votes)</span>
            </div>
          </div>
          <div class="w-full overflow-hidden h-2 text-xs flex rounded bg-red-100 mt-1">
            <div
              class="w-full h-full bg-red-500"
              :style="{
                width: `${measure.noPercent}%`,
                minWidth: '4px'
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>No data found for Proposition 34</div>
  </div>
</template>

<script>
export default {
  name: 'Prop34',
  data() {
    return {
      measure: null,
      loading: true,
      error: null
    }
  },
  computed: {
    totalVotes() {
      if (!this.measure) return '0'
      

      // Simple addition
      const total = this.measure.yesVotes + this.measure.noVotes
      
      return this.formatNumber(total)
    },
    difference() {
      if (!this.measure) return 0
      return parseFloat((this.measure.yesPercent - this.measure.noPercent).toFixed(1))
    },
    differenceColor() {
      if (this.difference > 0) return 'text-green-600'
      if (this.difference < 0) return 'text-red-600'
      return 'text-gray-600'
    }
  },
  async created() {
    try {
      const response = await fetch('https://api-internal.sos.ca.gov/returns/ballot-measures')
      const data = await response.json()
      let measure = data['ballot-measures'].find(m => m.Number === '34')
      
      if (measure) {
        // Remove commas and convert to numbers
        const yesVotes = Number(measure.yesVotes.replace(/,/g, ''))
        const noVotes = Number(measure.noVotes.replace(/,/g, ''))
        
        this.measure = {
          ...measure,
          yesVotes: yesVotes,
          noVotes: noVotes,
          yesPercent: parseFloat(measure.yesPercent),
          noPercent: parseFloat(measure.noPercent)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      this.error = 'Failed to load proposition data'
    } finally {
      this.loading = false
    }
  },
  methods: {
    formatNumber(num) {
      return new Intl.NumberFormat().format(num)
    }
  }
}
</script> 