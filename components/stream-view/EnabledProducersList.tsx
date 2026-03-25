"use client"

import React, { useState } from "react"
import { Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Producer } from "@/lib/types/Producer"

export function EnabledProducersList(producers: Producer[], selected: Set<string>, toggleSelected: (name: string) => void) {
  const [query, setQuery] = useState("")
  const filtered = producers.filter((p) =>
    p.producerName.toLowerCase().includes(query.toLowerCase())
  )

  return <Card className="w-56 shrink-0 max-h-parent">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium">Producers</CardTitle>
      <div className="relative mt-1">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"/>
        <Input
          placeholder="Filter..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-8 pl-8 text-sm"
        />
      </div>
    </CardHeader>
    <CardContent className="flex flex-col gap-3 overflow-y-auto max-h-96 scrollbar-thin">
      {filtered.map((p) => (
        <label key={p.uuid} className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm leading-tight flex-1">{p.producerName}</span>
          <input
            type="checkbox"
            checked={selected.has(p.producerName)}
            onChange={() => toggleSelected(p.producerName)}
            className="accent-primary"
          />
        </label>
      ))}
      {filtered.length === 0 && (
        <p className="text-xs text-muted-foreground italic">No producers match.</p>
      )}
    </CardContent>
  </Card>;
}
