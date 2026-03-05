import { TimeSeriesChart, type TimeSeriesRecord } from "@/components/time-series-chart"
import createLogger from "@/lib/logger"

const logger = createLogger("TimeSeriesStream")

async function fetchStream(streamId: string | number): Promise<TimeSeriesRecord[]> {
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/api/reporting/streams/${streamId}`,
      { next: { revalidate: 30 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    logger.debug(`stream id=${streamId} response body: ${JSON.stringify(data)}`)
    return data
  } catch {
    return []
  }
}

export async function TimeSeriesStream({ streamId }: { streamId: string | number }) {
  const records = await fetchStream(streamId)
  logger.info(`fetched ${records.length} records for stream id=${streamId}`)
  return <TimeSeriesChart records={records} />
}
