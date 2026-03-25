"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TimeSeriesChart } from "@/components/time-series-chart"
import { SseHandler } from "@/lib/client/sse/SseHandler"
import { TimeSeriesRecord } from "@/lib/types/TimeSeriesRecord"
import { Producer } from "@/lib/types/Producer"
import { EnabledProducersList } from "./EnabledProducersList"

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
      {EnabledProducersList(producers, selected, toggleSelected)}
      <Card className="flex-1">
        <CardContent className="h-100 pt-6">
          <TimeSeriesChart records={filtered}/>
        </CardContent>
      </Card>
    </div>
  )
}
