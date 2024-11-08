import { XMLParser } from 'fast-xml-parser'

export default defineEventHandler(async (event) => {
  try {
    const response = await fetch('https://www.livevoterturnout.com/ENR/orangecaenr/18/summary_18.xml')
    const xmlData = await response.text()
    
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: ''
    })
    
    const data = parser.parse(xmlData)
    return data

  } catch (error) {
    console.error('Error fetching election data:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch election data'
    })
  }
}) 