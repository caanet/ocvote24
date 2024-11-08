<!-- Rename CD47.vue to CongressionalDistricts.vue -->
<template>
  <div class="space-y-6">
    <!-- Page Title -->
    <h2 class="text-2xl font-bold text-gray-900">Congressional Districts Results</h2>

    <!-- Debug info -->
    <pre v-if="!cd47Race" class="text-sm text-gray-500">Loading data...</pre>

    <!-- Race Results -->
    <div v-if="cd47Race" class="bg-white shadow rounded-lg divide-y divide-gray-200">
      <div class="p-6">
        <!-- Race Header -->
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            {{ cd47Race[0]?.RaceName }}
          </h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">Updated {{ formatDate(electionData?.NewDataSet?.GeneratedDate) }}</span>
          </div>
        </div>

        <!-- Vote Totals Summary -->
        <div class="mb-4 mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
            <div class="text-sm">
              <span class="text-gray-600">Total Ballots: </span>
              <span class="font-semibold text-gray-900">{{ formatNumber(getTotalBallots()) }}</span>
            </div>
            <div class="text-sm sm:text-center">
              <span class="text-gray-600">Total Counted: </span>
              <span class="font-semibold text-gray-900">
                {{ formatNumber(getTotalCounted()) }}
                <span class="ml-1 text-xs text-gray-500">
                  ({{ ((getTotalCounted() / getTotalBallots()) * 100).toFixed(1) }}%)
                </span>
              </span>
            </div>
            <div class="text-sm sm:text-center">
              <span class="text-gray-600">Left to Count: </span>
              <span class="font-semibold text-gray-900">{{ formatNumber(getLeftToCount()) }}</span>
            </div>
            <div class="text-sm sm:text-right">
              <span class="text-gray-600">Needed to Win: </span>
              <span class="font-semibold text-gray-900">{{ formatNumber(getNeededToWin()) }}</span>
            </div>
          </div>
        </div>

        <!-- Candidate Results -->
        <div class="mt-6 space-y-8">
          <div v-for="candidate in sortedCandidates" :key="candidate.ContestantID" class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span 
                  v-if="candidate.Party"
                  :class="getPartyBadgeClasses(candidate.Party)"
                >
                  {{ getPartyLetter(candidate.Party) }}
                </span>
                <span class="text-sm font-medium text-gray-900">{{ formatCandidateName(candidate.ContestantName) }}</span>
                <span 
                  v-if="isLeading(candidate)" 
                  class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                >
                  Leading
                </span>
                <span 
                  v-if="isLikelyWinner(candidate)"
                  class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20"
                >
                  Likely Winner
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-900">{{ candidate.ContestantVotePercent }}</span>
                <span 
                  v-if="!isLeading(candidate)" 
                  class="text-xs text-gray-500"
                >
                  (-{{ getPercentageDifference() }}%)
                </span>
              </div>
            </div>

            <div class="relative w-full bg-gray-100 rounded-full h-4">
              <div
                class="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                :class="isLeading(candidate) ? 'bg-green-500' : 'bg-gray-400'"
                :style="{
                  width: candidate.ContestantVotePercent
                }"
              ></div>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-2">
              <div>
                <div class="text-xs font-medium text-gray-500">Vote by Mail</div>
                <div class="text-sm text-gray-900">{{ formatNumber(candidate.VotebyMailBallotsVotes) }}</div>
              </div>
              <div>
                <div class="text-xs font-medium text-gray-500">Vote Center</div>
                <div class="text-sm text-gray-900">{{ formatNumber(candidate.VoteCenterBallotsVotes) }}</div>
              </div>
            </div>

            <div class="pt-2">
              <span class="text-sm font-medium text-gray-900">Total Votes: </span>
              <span class="text-sm text-gray-900">{{ formatNumber(candidate.TotalVotes) }}</span>
              <span 
                v-if="!isLeading(candidate)" 
                class="text-sm text-gray-500 ml-2"
              >
                ({{ formatNumber(getVoteDifference()) }} votes behind)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: electionData } = await useFetch('/api/election-data')

// Helper Functions (these don't depend on cd47Race)
const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat().format(num)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  })
}

const formatCandidateName = (name) => {
  return name.split('/')[0].split('(')[0].trim()
}

// Simplify to just get the letter since we're handling colors in the template
const getPartyLetter = (party) => {
  switch (party) {
    case 'REP': return 'R'
    case 'DEM': return 'D'
    case 'NPP': return 'I'
    default: return 'I'
  }
}

// Computed properties and functions that depend on cd47Race
const cd47Race = computed(() => {
  if (!electionData.value?.NewDataSet?.Table) return null
  
  const races = Array.isArray(electionData.value.NewDataSet.Table) 
    ? electionData.value.NewDataSet.Table 
    : [electionData.value.NewDataSet.Table]
  
  return races.filter(race => race.RaceName === 'UNITED STATES REPRESENTATIVE 47th District')
})

const sortedCandidates = computed(() => {
  if (!cd47Race.value) return []
  return [...cd47Race.value].sort((a, b) => 
    parseInt(b.TotalVotes) - parseInt(a.TotalVotes)
  )
})

// Functions that depend on computed properties
const getTotalBallots = () => {
  if (!cd47Race.value?.[0]) return 0
  return parseInt(cd47Race.value[0].TimesCounted) || 0
}

const getTotalCounted = () => {
  if (!cd47Race.value) return 0
  return cd47Race.value.reduce((sum, candidate) => 
    sum + parseInt(candidate.TotalVotes || 0), 0
  )
}

const getLeftToCount = () => {
  const totalBallots = getTotalBallots()
  const totalCounted = getTotalCounted()
  return Math.max(0, totalBallots - totalCounted)
}

const getNeededToWin = () => {
  const totalBallots = getTotalBallots()
  return Math.floor(totalBallots / 2) + 1
}

const isLeading = (candidate) => {
  if (!sortedCandidates.value.length) return false
  return candidate.ContestantID === sortedCandidates.value[0].ContestantID
}

const getVoteDifference = () => {
  if (!sortedCandidates.value || sortedCandidates.value.length < 2) return 0
  return parseInt(sortedCandidates.value[0].TotalVotes) - 
         parseInt(sortedCandidates.value[1].TotalVotes)
}

const getTrailingCandidateVotes = () => {
  if (!sortedCandidates.value || sortedCandidates.value.length < 2) return 0
  return parseInt(sortedCandidates.value[1].TotalVotes) || 0
}

const isLikelyWinner = (candidate) => {
  if (!isLeading(candidate)) return false
  
  const trailingVotes = getTrailingCandidateVotes()
  const leftToCount = getLeftToCount()
  const maxPossibleTrailingVotes = trailingVotes + leftToCount
  
  return parseInt(candidate.TotalVotes) > maxPossibleTrailingVotes
}

const getPercentageDifference = () => {
  if (!sortedCandidates.value || sortedCandidates.value.length < 2) return '0.0'
  
  const leadingPercent = parseFloat(sortedCandidates.value[0].ContestantVotePercent)
  const trailingPercent = parseFloat(sortedCandidates.value[1].ContestantVotePercent)
  
  return (leadingPercent - trailingPercent).toFixed(1)
}

const getPartyBadgeClasses = (party) => {
  const baseClasses = 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
  
  switch (party) {
    case 'REP':
      return `${baseClasses} bg-red-800 text-white ring-red-500/20`
    case 'DEM':
      return `${baseClasses} bg-blue-800 text-white ring-blue-500/20`
    default:
      return `${baseClasses} bg-gray-800 text-white ring-gray-500/20`
  }
}

// Add watcher to debug candidates
watch(sortedCandidates, (newVal) => {
  console.log('Sorted Candidates:', newVal)
}, { immediate: true })
</script> 