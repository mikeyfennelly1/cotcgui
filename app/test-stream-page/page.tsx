"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TimeSeriesChart } from "@/components/time-series-chart"
import data from "./data.json"
import {TimeSeriesMessage} from "@/lib/types/TimeSeriesMessage";
import {TimeSeriesRecord} from "@/lib/types/TimeSeriesRecord";
import {messageToRecords, producerListToNameSet} from "@/lib/translate/Translators";
import {ProducerCountCard} from "@/components/producer-count-card";
import {ProducerSelectionCard} from "@/app/test-stream-page/producer-selection-card";

const allRecords: TimeSeriesRecord[] = (data.messages as TimeSeriesMessage[]).flatMap(messageToRecords);

export default function TestStreamPage() {
  const initialSet: Set<string> = new Set(producerListToNameSet(data.producers));
  const [selected, setSelected] = useState<Set<string>>(initialSet);

  function toggle(name: string): void {
    setSelected((prev: Set<string>): Set<string> => {
      const next: Set<string> = new Set(prev);
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  const filtered: TimeSeriesRecord[] = allRecords.filter((r: TimeSeriesRecord): boolean => selected.has(r.producerName))

  return (
    <div className="flex flex-col gap-6 p-6">
      {ProducerCountCard()}
      <div className="flex gap-4 items-start">
        {ProducerSelectionCard(selected, toggle)}
        <Card className="flex-1">
          <CardContent className="h-100 pt-6">
            <TimeSeriesChart records={filtered}/>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
