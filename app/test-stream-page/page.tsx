"use client"

import { useState } from "react"
import { Tag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeSeriesChart, type TimeSeriesRecord } from "@/components/time-series-chart"
import data from "./data.json"

export interface TimeSeriesMessage {
  producer_id: string
  producer_name: string
  read_time: number
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

const allRecords = (data.messages as TimeSeriesMessage[]).flatMap(messageToRecords)

export default function TestStreamPage() {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(data.producers.map((p) => p.producerName))
  )

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  const filtered = allRecords.filter((r) => selected.has(r.producerName))

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Tag className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">{data.streamName}</h1>
          <p className="text-muted-foreground">
            {data.producers.length} producers &mdash; static demo
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        <Card className="w-56 shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Producers</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {data.producers.map((p) => (
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
    </div>
  )
}
