export const useBallotsApi = () => {
  const getBallotsIssued = async (precinctId: string) => {
    try {
      const response = await fetch(
        `https://www.ocvote.gov/datacentral/bin/get.php?q=vbm-counts-issued&p=${precinctId}`
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching ballots data:', error)
      return null
    }
  }

  return {
    getBallotsIssued
  }
} 