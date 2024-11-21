import { XMLParser } from 'fast-xml-parser'

export default defineEventHandler(async () => {
  try {
    const response = await fetch('https://www.livevoterturnout.com/ENR/orangecaenr/18/summary_18.xml')
    const xmlData = await response.text()
    
    const parser = new XMLParser()
    const jsonData = parser.parse(xmlData)
    
    // Extract Costa Mesa races
    const costaMesaRaces = {}
    let generatedDate = ''

    // Get the GeneratedDate from the correct path
    if (jsonData.NewDataSet?.GeneratedDate) {
      generatedDate = jsonData.NewDataSet.GeneratedDate
    }

    jsonData.NewDataSet.Table.forEach(entry => {
      if (entry.RaceName?.startsWith('CITY OF COSTA MESA')) {
        if (!costaMesaRaces[entry.RaceName]) {
          costaMesaRaces[entry.RaceName] = {
            title: entry.RaceName,
            totalBallots: parseInt(entry.TimesCounted) || 0,
            overVotes: parseInt(entry.OverVotes) || 0,
            underVotes: parseInt(entry.UnderVotes) || 0,
            candidates: []
          }
        }

        if (entry.ContestantName && !entry.ContestantName.includes('Over Votes') && !entry.ContestantName.includes('Under Votes')) {
          costaMesaRaces[entry.RaceName].candidates.push({
            name: entry.ContestantName?.replace('*', '').trim(),
            votes: parseInt(entry.TotalVotes) || 0
          })
        }
      }
    })

    // Convert to array and calculate percentages
    const races = Object.values(costaMesaRaces).map(race => {
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
          title: "CITY OF COSTA MESA Mayor",
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