"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeSeriesChart, type TimeSeriesRecord } from "@/components/time-series-chart"
import createLogger from "@/lib/logger"

const logger = createLogger("StreamView")

interface Producer {
  uuid: string
  producerName: string
}

/** Matches TimeSeriesMessageDTO from the backend */
interface TimeSeriesMessage {
  producer_id: string
  producer_name: string
  read_time: number  // epoch seconds
  values: Record<string, number>
}

function messageToRecords(msg: TimeSeriesMessage): TimeSeriesRecord[] {
  const readTime = new Date(msg.read_time * 1000).toISOString()
  return Object.entries(msg.values).map(([key, value]) => ({
    id: `${msg.producer_id}-${key}-${msg.read_time}`,
    key,
    value,
    producerName: msg.producer_name,
    readTime,
  }))
}

interface StreamViewProps {
  producers: Producer[]
  streamName: string
}

export function StreamView({ producers, streamName }: StreamViewProps) {
  const [records, setRecords] = useState<TimeSeriesRecord[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set(producers.map((p) => p.producerName)))

  useEffect(() => {
    const url = `/api/group/events/${streamName}`
    const es = new EventSource(url)

    logger.info(`SSE connection opened to ${url}`)

    es.onmessage = (event) => {
      console.log(`SSE message for stream id=${streamName}:`, event.data)
    }

    es.addEventListener("history", (event) => {
      console.log(`SSE history event for stream id=${streamName}:`, event.data)
      try {
        const batch: TimeSeriesMessage[] = JSON.parse(event.data)
        const records = batch.flatMap(messageToRecords)
        logger.debug(`SSE history: ${batch.length} messages → ${records.length} records`)
        setRecords(records)
      } catch (err) {
        logger.warn(`Failed to parse SSE history event: ${err}`)
      }
    })

    es.addEventListener("update", (event) => {
      console.log(`SSE update event for stream id=${streamName}:`, event.data)
      try {
        const msg: TimeSeriesMessage = JSON.parse(event.data)
        const records = messageToRecords(msg)
        logger.debug(`SSE update: producer=${msg.producer_name} keys=${Object.keys(msg.values).join(",")}`)
        setRecords((prev) => [...prev, ...records])
      } catch (err) {
        logger.warn(`Failed to parse SSE update event: ${err}`)
      }
    })

    es.onerror = () => {
      logger.error(`SSE connection error for stream id=${streamName}`)
    }

    return () => {
      es.close()
      logger.info(`SSE connection closed for stream id=${streamName}`)
    }
  }, [streamName])

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  const filtered: TimeSeriesRecord[] = records.filter((r) => selected.has(r.producerName))

  return (
    <div className="flex gap-4 items-start">
      <Card className="w-56 shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Producers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {producers.map((p) => (
            <label key={p.uuid} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.has(p.producerName)}
                onChange={() => toggle(p.producerName)}
                className="accent-primary"
              />
              <span className="text-sm leading-tight">{p.producerName}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardContent className="h-[400px] pt-6">
          <TimeSeriesChart records={filtered} />
        </CardContent>
      </Card>
    </div>
  )
}
