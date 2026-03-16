"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeSeriesChart } from "@/components/time-series-chart"
import createLogger from "@/lib/logger"
import {SseHandler} from "@/lib/client/sse/SseHandler";
import {TimeSeriesRecord} from "@/lib/types/TimeSeriesRecord";
import {Producer} from "@/lib/types/Producer";

const logger = createLogger("StreamView")

interface StreamViewProps {
  producers: Producer[]
  streamName: string
}

export function StreamView({ producers, streamName }: StreamViewProps) {
  const [records, setRecords] = useState<TimeSeriesRecord[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set(producers.map((p) => p.producerName)))

  useEffect((): void => {
    const handler: SseHandler = new SseHandler(
        setRecords,
        setSelected
    );
    handler.start(streamName)
  }, [streamName])

  function toggleSelected(name: string): void {
    setSelected((prev: Set<string>): Set<string> => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
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
                onChange={() => toggleSelected(p.producerName)}
                className="accent-primary"
              />
              <span className="text-sm leading-tight">{p.producerName}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardContent className="h-100 pt-6">
          <TimeSeriesChart records={filtered} />
        </CardContent>
      </Card>
    </div>
  )
}
