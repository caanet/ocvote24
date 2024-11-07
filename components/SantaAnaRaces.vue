<template>
  <div class="space-y-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
          <button 
            @click="fetchRaces" 
            class="mt-2 text-sm text-red-600 hover:text-red-500 underline"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>

    <!-- Results -->
    <template v-else-if="races.length">
      <div v-for="race in races" :key="race.title" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-2">{{ race.title }}</h2>
        
        <!-- Vote Totals Summary -->
        <div class="mb-4 p-4 bg-gray-50 rounded-lg">
          <div class="grid grid-cols-3 gap-4">
            <div class="text-sm">
              <span class="text-gray-600">Total Votes Counted: </span>
              <span class="font-semibold text-gray-900">{{ formatNumber(getTotalVotes(race.candidates)) }}</span>
            </div>
            <div class="text-sm text-center">
              <span class="text-gray-600">Total Ballots Cast: </span>
              <span class="font-semibold text-gray-900">{{ formatNumber(race.totalBallots) }}</span>
            </div>
            <div class="text-sm text-right">
              <span class="text-gray-600">Left to Count: </span>
              <span class="font-semibold text-gray-900">{{ formatNumber(getLeftToCount(race)) }}</span>
            </div>
          </div>
        </div>
        
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Candidate
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Votes
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Difference
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(candidate, index) in race.candidates" 
                :key="candidate.name" 
                class="hover:bg-gray-50"
                :class="{'font-semibold': index === 0}"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ candidate.name }}
                <span v-if="index === 0" class="ml-2 text-blue-600">(Leading)</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                {{ formatNumber(candidate.votes) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                <template v-if="index > 0">
                  <span class="text-red-600">
                    -{{ formatNumber(getVoteDifference(race.candidates, index)) }}
                    <span class="text-gray-500 text-xs ml-1">
                      (-{{ formatPercentage(getPercentageDifference(race.candidates, index)) }})
                    </span>
                  </span>
                </template>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right relative">
                <div class="relative flex items-center justify-end h-full">
                  <!-- Background bar -->
                  <div class="absolute inset-y-0 left-0 w-full bg-gray-100"></div>
                  
                  <!-- Colored fill -->
                  <div 
                    class="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
                    :class="index === 0 ? 'bg-blue-500' : 'bg-gray-400'"
                    :style="{
                      width: `${candidate.percentage}%`,
                      opacity: '0.15'
                    }"
                  ></div>
                  
                  <!-- Percentage text -->
                  <span class="relative z-10 font-medium">
                    {{ formatPercentage(candidate.percentage) }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Last Updated -->
      <div class="text-sm text-gray-500 text-right">
        Last Updated: {{ lastUpdated }}
      </div>
    </template>

    <!-- No Results State -->
    <div v-else-if="!loading && !error" class="text-center py-8 text-gray-500">
      No results available at this time.
    </div>
  </div>
</template>

<script setup>
const races = ref([])
const loading = ref(true)
const error = ref(null)
const lastUpdated = ref('')

// Format helpers
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const formatPercentage = (num) => {
  return num ? num.toFixed(1) + '%' : '0%'
}

// Calculate total votes for a race
const getTotalVotes = (candidates) => {
  return candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
}

// Calculate remaining ballots to count
const getLeftToCount = (race) => {
  const totalVotes = getTotalVotes(race.candidates)
  return race.totalBallots - totalVotes
}

// Calculate differences between candidates
const getVoteDifference = (candidates, index) => {
  if (index === 0) return null
  const difference = candidates[0].votes - candidates[index].votes
  return difference
}

const getPercentageDifference = (candidates, index) => {
  if (index === 0) return null
  const difference = candidates[0].percentage - candidates[index].percentage
  return difference
}

// Fetch race data
const fetchRaces = async () => {
  try {
    loading.value = true
    error.value = null
    
    const { data } = await useFetch('/api/santa-ana-races')


    if (!data.value) {
      throw new Error('No data received')
    }

    races.value = data.value
    lastUpdated.value = new Date().toLocaleString()
    
  } catch (err) {

    error.value = 'Unable to load race data. Please try again later.'
  } finally {
    loading.value = false
  }
}

// Fetch data immediately
fetchRaces()
</script> 