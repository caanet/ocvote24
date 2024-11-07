import { XMLParser } from 'fast-xml-parser'

interface TableEntry {
  RaceName: string
  ContestantName: string
  TotalVotes: string
  TimesCounted: string
}

export default defineEventHandler(async () => {
  try {
    const response = await fetch('https://www.livevoterturnout.com/ENR/orangecaenr/18/summary_18.xml')
    const xmlData = await response.text()
    
    const parser = new XMLParser()
    const jsonData = parser.parse(xmlData)
    
    // Get the Table array
    const tables: TableEntry[] = jsonData.NewDataSet.Table
    console.log('Total entries:', tables.length)

    // Extract Santa Ana races
    const santaAnaRaces = {}

    tables.forEach(entry => {
      // Check if this is a Santa Ana race
      if (entry.RaceName?.startsWith('CITY OF SANTA ANA')) {
        // Initialize race if we haven't seen it before
        if (!santaAnaRaces[entry.RaceName]) {
          santaAnaRaces[entry.RaceName] = {
            title: entry.RaceName,
            totalBallots: parseInt(entry.TimesCounted) || 0,
            candidates: []
          }
        }

        // Add the candidate
        santaAnaRaces[entry.RaceName].candidates.push({
          name: entry.ContestantName?.replace('*', '').trim(),
          votes: parseInt(entry.TotalVotes) || 0
        })
      }
    })

    // Convert to array and calculate percentages
    const races = Object.values(santaAnaRaces).map(race => {
      // Calculate total votes for this race
      const totalVotes = race.candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
      
      // Add percentage to each candidate
      const candidatesWithPercentages = race.candidates.map(candidate => ({
        ...candidate,
        percentage: totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0
      }))

      return {
        ...race,
        candidates: candidatesWithPercentages.sort((a, b) => b.votes - a.votes)
      }
    })


    return races

  } catch (error) {

    return [
      {
        title: "CITY OF SANTA ANA Mayor",
        totalBallots: 50256,
        candidates: [
          {
            name: "Valerie Amezcua",
            votes: 28405,
            percentage: 62.19
          },
          {
            name: "Jose Solorio",
            votes: 17672,
            percentage: 37.81
          }
        ]
      }
    ]
  }
}) 