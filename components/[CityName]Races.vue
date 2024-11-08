<template>
  <div class="space-y-8">
    <template v-if="loading">
      <!-- Loading content -->
    </template>
    <template v-else-if="error">
      <!-- Error content -->
    </template>
    <template v-else-if="races.length">
      <div v-for="race in races" :key="race.title" class="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">{{ race.title }}</h2>
        
        <!-- Vote Totals Summary -->
        <div class="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div class="text-sm">
              <span class="text-gray-600">Total Votes: </span>
              <span class="font-semibold text-gray-900">{{ formatNumber(getTotalVotes(race.candidates)) }}</span>
            </div>
            <div class="text-sm sm:text-center">
              <span class="text-gray-600">Ballots Cast: </span>
              <span class="font-semibold text-gray-900">{{ formatNumber(race.totalBallots) }}</span>
            </div>
            <div class="text-sm sm:text-right">
              <span class="text-gray-600">Left to Count: </span>
              <span class="font-semibold text-gray-900">{{ formatNumber(getLeftToCount(race)) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Table Container -->
        <div class="overflow-x-auto -mx-4 sm:-mx-6 lg:mx-0">
          <div class="inline-block min-w-full align-middle">
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
                    :class="{'font-semibold': index === 0}"
                >
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ candidate.name }}
                    <span v-if="index === 0" class="ml-1 text-blue-600">(Leading)</span>
                  </td>
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {{ formatNumber(candidate.votes) }}
                  </td>
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    <template v-if="index > 0">
                      <span class="text-red-600">
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
                        :class="index === 0 ? 'bg-blue-500' : 'bg-gray-400'"
                        :style="{
                          width: `${candidate.percentage}%`,
                          opacity: '0.15'
                        }"
                      ></div>
                      <span class="relative z-10 font-medium">
                        {{ formatPercentage(candidate.percentage) }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Last Updated -->
      <div class="text-sm text-gray-500 text-right px-4 sm:px-0">
        Last Updated: {{ lastUpdated }}
      </div>
    </template>
  </div>
</template> 