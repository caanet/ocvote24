import { XMLParser } from 'fast-xml-parser'

export default defineEventHandler(async () => {
  try {
    const response = await fetch('https://www.livevoterturnout.com/ENR/orangecaenr/18/summary_18.xml')
    const xmlData = await response.text()
    
    const parser = new XMLParser()
    const jsonData = parser.parse(xmlData)
    
    // Extract Tustin races
    const tustinRaces = {}

    jsonData.NewDataSet.Table.forEach(entry => {
      if (entry.RaceName?.startsWith('CITY OF TUSTIN')) {
        if (!tustinRaces[entry.RaceName]) {
          tustinRaces[entry.RaceName] = {
            title: entry.RaceName,
            totalBallots: parseInt(entry.TimesCounted) || 0,
            candidates: []
          }
        }

        // Add the candidate
        tustinRaces[entry.RaceName].candidates.push({
          name: entry.ContestantName?.replace('*', '').trim(),
          votes: parseInt(entry.TotalVotes) || 0
        })
      }
    })

    // Convert to array and calculate percentages
    const races = Object.values(tustinRaces).map(race => {
      const totalVotes = race.candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
      
      return {
        ...race,
        candidates: race.candidates.map(candidate => ({
          ...candidate,
          percentage: totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0
        })).sort((a, b) => b.votes - a.votes)
      }
    })

    return races

  } catch (error) {
    console.error('Error:', error)
    return [
      {
        title: "City of Tustin Mayor",
        totalBallots: 25000,
        candidates: [
          {
            name: "Example Candidate 1",
            votes: 15000,
            percentage: 60.0
          },
          {
            name: "Example Candidate 2",
            votes: 10000,
            percentage: 40.0
          }
        ]
      }
    ]
  }
}) 