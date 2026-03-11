"use client"

import {useEffect, useState} from "react"
import {TimeSeriesChart, type TimeSeriesRecord} from "@/components/time-series-chart"
import {StreamHandler, type SetRecords} from "@/components/stream-handler"

export function TimeSeriesStream({ streamId }: { streamId: string | number }) {
  const [records, setRecords] = useState<TimeSeriesRecord[]>([])

  useEffect(() => {
    const handler = new StreamHandler(String(streamId), { setRecords })
    return () => {
      handler.close()
    }
  }, [streamId])

  return <TimeSeriesChart records={records} />
}

export type {SetRecords};
