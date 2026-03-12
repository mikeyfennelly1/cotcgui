"use client"

import { useEffect, useState } from "react"
import { Tag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeSeriesChart, type TimeSeriesRecord } from "@/components/time-series-chart"
import createLogger from "@/lib/logger"

const logger = createLogger("HomePage")

const GROUP = "test"

interface TimeSeriesRecordDTO {
  id: string
  key: string
  value: number
  producerName: string
  readTime: string
}

export default function Home() {
  const [records, setRecords] = useState<TimeSeriesRecord[]>([])
  const [producers, setProducers] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    const url = `/api/group/events/${GROUP}`
    const es = new EventSource(url)
    logger.info(`SSE connection opened to ${url}`)

    function addProducer(name: string) {
      setProducers((prev) => {
        if (prev.has(name)) return prev
        const next = new Set(prev)
        next.add(name)
        setSelected((s) => new Set([...s, name]))
        return next
      })
    }

    es.addEventListener("history", (event) => {
      try {
        const batch: TimeSeriesRecordDTO[] = JSON.parse(event.data)
        batch.forEach((r) => addProducer(r.producerName))
        setRecords(batch)
      } catch (err) {
        logger.warn(`Failed to parse SSE history: ${err}`)
      }
    })

    es.addEventListener("update", (event) => {
      try {
        const record: TimeSeriesRecordDTO = JSON.parse(event.data)
        addProducer(record.producerName)
        setRecords((prev) => [...prev, record])
      } catch (err) {
        logger.warn(`Failed to parse SSE update: ${err}`)
      }
    })

    es.onerror = () => logger.error("SSE connection error")

    return () => {
      es.close()
      logger.info("SSE connection closed")
    }
  }, [])

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  const filtered = records.filter((r) => selected.has(r.producerName))

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Tag className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">{GROUP}</h1>
          <p className="text-muted-foreground">
            {producers.size} producer{producers.size === 1 ? "" : "s"} &mdash; live
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        <Card className="w-56 shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Producers</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[...producers].map((name) => (
              <label key={name} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.has(name)}
                  onChange={() => toggle(name)}
                  className="accent-primary"
                />
                <span className="text-sm leading-tight">{name}</span>
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
