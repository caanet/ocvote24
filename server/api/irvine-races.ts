import { XMLParser } from 'fast-xml-parser'

export default defineEventHandler(async () => {
  try {
    const response = await fetch('https://www.livevoterturnout.com/ENR/orangecaenr/18/summary_18.xml')
    const xmlData = await response.text()
    
    const parser = new XMLParser()
    const jsonData = parser.parse(xmlData)
    
    // Extract Irvine races
    const irvineRaces = {}
    let generatedDate = ''

    // Get the GeneratedDate if available
    if (jsonData.NewDataSet.Table[0]?.GeneratedDate) {
      generatedDate = jsonData.NewDataSet.Table[0].GeneratedDate
    }

    jsonData.NewDataSet.Table.forEach(entry => {
      if (entry.RaceName?.startsWith('CITY OF IRVINE')) {
        if (!irvineRaces[entry.RaceName]) {
          irvineRaces[entry.RaceName] = {
            title: entry.RaceName,
            totalBallots: parseInt(entry.TimesCounted) || 0,
            candidates: []
          }
        }

        // Add the candidate
        irvineRaces[entry.RaceName].candidates.push({
          name: entry.ContestantName?.replace('*', '').trim(),
          votes: parseInt(entry.TotalVotes) || 0
        })
      }
    })

    // Convert to array and calculate percentages
    const races = Object.values(irvineRaces).map(race => {
      const totalVotes = race.candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
      
      return {
        ...race,
        candidates: race.candidates.map(candidate => ({
          ...candidate,
          percentage: totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0
        })).sort((a, b) => b.votes - a.votes)
      }
    })

    return {
      races,
      generatedDate
    }

  } catch (error) {
    return {
      races: [
        {
          title: "CITY OF IRVINE Mayor",
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
      ],
      generatedDate: new Date().toLocaleString()
    }
  }
}) 