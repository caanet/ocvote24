<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header with navigation -->
    <div class="mb-8 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Ballots Left to Count</h1>
      <NuxtLink 
        to="/" 
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Back to Home
      </NuxtLink>
    </div>

    <!-- Presidential Race Card -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ presRace?.raceName }}</h3>
        
        <dl class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <dt class="text-sm font-medium text-gray-500">Total Ballots</dt>
            <dd class="mt-1 text-2xl font-semibold text-gray-900">
              {{ formatNumber(presRace?.timesCounted) }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Total Votes Cast</dt>
            <dd class="mt-1 text-2xl font-semibold text-gray-900">
              {{ formatNumber(presRace?.totalVotesCast) }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Left to Count</dt>
            <dd class="mt-1 text-2xl font-semibold text-gray-900">
              {{ formatNumber(presRace?.leftToCount) }}
            </dd>
          </div>
        </dl>

        <!-- Debug info -->
        <pre v-if="debug" class="mt-4 text-xs text-gray-500">{{ presRace }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: electionData } = await useFetch('/api/election-data')
const debug = ref(true) // Toggle for debugging

// Get Presidential race data
const presRace = computed(() => {
  if (!electionData.value?.NewDataSet?.Table) return null
  
  const races = electionData.value.NewDataSet.Table
  const presidentialRace = races.filter(race => 
    race.RaceName === 'PRESIDENT AND VICE PRESIDENT'
  )
  
  if (!presidentialRace.length) return null

  // Get TimesCounted from first entry (should be same for all)
  const timesCounted = parseInt(presidentialRace[0].TimesCounted) || 0
  
  // Sum all candidate votes
  const totalVotesCast = presidentialRace.reduce((sum, candidate) => 
    sum + (parseInt(candidate.TotalVotes) || 0), 0
  )
  
  return {
    raceName: 'President and Vice President',
    timesCounted,
    totalVotesCast,
    leftToCount: Math.max(0, timesCounted - totalVotesCast),
    candidates: presidentialRace // Keep for debugging
  }
})

// Helper function
const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat().format(num)
}
</script> 