import { XMLParser } from 'fast-xml-parser'

export default defineEventHandler(async () => {
  try {
    const response = await fetch('https://www.livevoterturnout.com/ENR/orangecaenr/18/summary_18.xml')
    const xmlData = await response.text()
    
    const parser = new XMLParser()
    const jsonData = parser.parse(xmlData)
    
    let generatedDate = ''

    if (jsonData.NewDataSet?.GeneratedDate) {
      generatedDate = jsonData.NewDataSet.GeneratedDate
    }

    // Extract Orange races
    const orangeRaces = {}

    jsonData.NewDataSet.Table.forEach(entry => {
      if (entry.RaceName?.startsWith('Z - City of Orange')) {
        if (!orangeRaces[entry.RaceName]) {
          orangeRaces[entry.RaceName] = {
            title: entry.RaceName.replace('Z - ', ''),
            totalBallots: parseInt(entry.TimesCounted) || 0,
            candidates: []
          }
        }

        // Add the candidate
        orangeRaces[entry.RaceName].candidates.push({
          name: entry.ContestantName?.replace('*', '').trim(),
          votes: parseInt(entry.TotalVotes) || 0
        })
      }
    })

    // Convert to array and calculate percentages
    const races = Object.values(orangeRaces).map(race => {
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
    console.error('Error:', error)
    return [
      {
        title: "City of Orange Mayor",
        totalBallots: 50256,
        candidates: [
          {
            name: "Example Candidate 1",
            votes: 28405,
            percentage: 62.19
          },
          {
            name: "Example Candidate 2",
            votes: 17672,
            percentage: 37.81
          }
        ]
      }
    ]
  }
}) 