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
  const overVotes = race.overVotes || 0
  const underVotes = race.underVotes || 0
  const timesCounted = race.totalBallots || 0
  return timesCounted - (totalVotes + overVotes + underVotes)
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

// Add this helper function
const cannotCatchLeader = (candidate, index, race) => {
  if (index === 0) return false // Leader can't be behind themselves
  const leader = race.candidates[0]
  return (candidate.votes + getLeftToCount(race)) < leader.votes
}

// Fetch race data
const fetchRaces = async () => {
  try {
    loading.value = true
    error.value = null
    
    const { data } = await useFetch('/api/tustin-races')

    if (!data.value) {
      throw new Error('No data received')
    }

    races.value = data.value.races
    lastUpdated.value = data.value.generatedDate
    
  } catch (err) {
    error.value = 'Unable to load race data. Please try again later.'
  } finally {
    loading.value = false
  }
}

// Fetch data immediately
fetchRaces()

// Add onMounted to handle tooltip initialization
onMounted(() => {
  const tooltips = document.querySelectorAll('[data-tooltip]')
  tooltips.forEach(el => {
    el.title = el.dataset.tooltip
  })
})
</script>

<template>
  <div class="space-y-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4">
      <div class="flex">
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-else-if="races.length">
      <div v-for="race in races" :key="race.title" class="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ race.title }}</h2>
        
        <!-- Vote Totals Summary -->
        <div class="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4" 
               :class="{'sm:grid-cols-4': race.candidates.length === 2}">
            <div class="text-sm">
              <span class="text-gray-600">Total Ballots: </span>
              <span class="font-semibold text-gray-900">{{ formatNumber(race.totalBallots) }}</span>
            </div>
            <div class="text-sm sm:text-center">
              <span class="text-gray-600">Total Counted: </span>
              <span class="font-semibold text-gray-900">
                {{ formatNumber(getTotalVotes(race.candidates)) }}
                <span class="ml-1 text-xs text-gray-500">
                  ({{ formatPercentage((getTotalVotes(race.candidates) / race.totalBallots) * 100) }})
                </span>
              </span>
            </div>
            <div class="text-sm sm:text-center">
              <span class="text-gray-600">Left to Count: </span>
              <span class="font-semibold text-gray-900">
                {{ formatNumber(getLeftToCount(race)) }}
              </span>
            </div>
            <div v-if="race.candidates.length === 2" class="text-sm sm:text-right">
              <span class="text-gray-600">Needed to Win: </span>
              <span class="font-semibold text-gray-900">{{ formatNumber(Math.floor(race.totalBallots / 2) + 1) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Results Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th scope="col" class="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Votes
                </th>
                <th scope="col" class="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Behind
                </th>
                <th scope="col" class="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  %
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(candidate, index) in race.candidates" 
                  :key="candidate.name" 
                  class="hover:bg-gray-50"
                  :class="{
                    'font-semibold': index === 0,
                    'text-gray-400': cannotCatchLeader(candidate, index, race)
                  }"
              >
                <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm"
                    :class="{
                      'text-gray-900': !cannotCatchLeader(candidate, index, race),
                      'text-gray-400': cannotCatchLeader(candidate, index, race)
                    }"
                >
                  {{ candidate.name }}
                  <span 
                    v-if="index === 0" 
                    :class="[
                      'ml-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset border',
                      getLeftToCount(race) === 0
                        ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 border-yellow-200'
                        : cannotCatchLeader(race.candidates[1], 1, race)
                          ? 'bg-blue-50 text-blue-700 ring-blue-600/20 border-blue-200'
                          : 'bg-green-50 text-green-700 ring-green-600/20 border-green-200'
                    ]"
                  >
                    {{ getLeftToCount(race) === 0 
                        ? 'WON' 
                        : cannotCatchLeader(race.candidates[1], 1, race)
                          ? 'LIKELY WINNER'
                          : 'LEADING' 
                    }}
                  </span>
                </td>
                <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-right"
                    :class="{
                      'text-gray-900': !cannotCatchLeader(candidate, index, race),
                      'text-gray-400': cannotCatchLeader(candidate, index, race)
                    }"
                >
                  {{ formatNumber(candidate.votes) }}
                </td>
                <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-right">
                  <template v-if="index > 0">
                    <span :class="{
                      'text-red-600': !cannotCatchLeader(candidate, index, race),
                      'text-gray-400': cannotCatchLeader(candidate, index, race)
                    }">
                      -{{ formatNumber(getVoteDifference(race.candidates, index)) }}
                      <span class="hidden sm:inline text-gray-500 text-xs ml-1">
                        (-{{ formatPercentage(getPercentageDifference(race.candidates, index)) }})
                      </span>
                    </span>
                  </template>
                </td>
                <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-right relative">
                  <div class="relative flex items-center justify-end h-full">
                    <div class="absolute inset-y-0 left-0 w-full bg-gray-100"></div>
                    <div 
                      class="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
                      :class="[
                        index === 0 ? 'bg-green-500' : 'bg-gray-400',
                        cannotCatchLeader(candidate, index, race) ? 'opacity-50' : ''
                      ]"
                      :style="{
                        width: `${candidate.percentage}%`
                      }"
                    ></div>
                    <span class="relative z-10 font-medium"
                          :class="{ 'text-gray-400': cannotCatchLeader(candidate, index, race) }">
                      {{ formatPercentage(candidate.percentage) }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Last Updated -->
      <div class="text-sm text-gray-500 text-right px-4 sm:px-0 mt-4">
        Last Updated: {{ lastUpdated }}
      </div>
    </div>

    <!-- No Results State -->
    <div v-else class="text-center py-8 text-gray-500">
      No results available at this time.
    </div>
  </div>
</template>

<style>
/* Add smooth scrolling and hide scrollbars */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}

.overflow-x-auto::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* Ensure table cells don't wrap on mobile */
td, th {
  white-space: nowrap;
}

/* Ensure percentage bars don't overflow */
.relative {
  overflow: hidden;
}

.relative:hover > div {
  display: block !important;
}
</style> 