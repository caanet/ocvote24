import { $fetch } from 'ofetch'

interface BallotData {
  label: string;
  value: string;
  "0": string;
  "1": string;
}

interface BallotResponse {
  info: {
    caption: string;
    rowSub: string;
  };
  data: BallotData[];
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const precinctId = query.precinctId as string

  try {
    const [issuedData, returnedData] = await Promise.all([
      $fetch(`https://www.ocvote.gov/datacentral/bin/get.php`, {
        params: {
          q: 'vbm-counts-issued',
          p: precinctId
        }
      }),
      $fetch(`https://www.ocvote.gov/datacentral/bin/get.php`, {
        params: {
          q: 'vbm-counts-returned',
          p: precinctId
        }
      })
    ])

    return {
      issued: issuedData,
      returned: returnedData
    }
  } catch (error) {
    console.error('Error fetching ballot data:', error)
    throw createError({
      statusCode: 500,
      message: `Failed to fetch ballot data for precinct ${precinctId}`
    })
  }
}) 