"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TimeSeriesChart} from "@/components/time-series-chart"
import {TimeSeriesRecord} from "@/lib/types/TimeSeriesRecord";
import {SseHandler} from "@/lib/client/sse/SseHandler";
import {SelectProducerCard} from "@/components/SelectProducerCard";
import {ProducerCountCard} from "@/components/ProducerCountCard";

const GROUP = "test"

export default function Home(): React.JSX.Element {
  const [records, setRecords] = useState<TimeSeriesRecord[]>([])
  const [producers, setProducers] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handler: SseHandler = new SseHandler();
    return handler.start(GROUP, setProducers, setSelected, setRecords);
  }, [])

  function toggle(name: string): void {
    setSelected((prev: Set<string>): Set<string> => {
      const next = new Set(prev);
      if (next.has(name)){
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  const filtered: TimeSeriesRecord[] = records.filter((r) => selected.has(r.producerName))

  return (
    <div className="flex flex-col gap-6 p-6">
      {ProducerCountCard(GROUP, producers)}

      <div className="flex gap-4 items-start">
        {SelectProducerCard(producers, selected, toggle)}

        <Card className="flex-1">
          <CardContent className="h-100 pt-6">
            <TimeSeriesChart records={filtered}/>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
