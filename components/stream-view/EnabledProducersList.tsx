"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Producer } from "@/lib/types/Producer"

export function EnabledProducersList(producers: Producer[], selected: Set<string>, toggleSelected: (name: string) => void) {
  return <Card className="w-56 shrink-0">
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
  </Card>;
}
