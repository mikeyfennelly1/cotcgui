import React from "react"
import { Group } from "@/lib/types/Group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProducerView(group: Group) {
    const producerCount = group.producers.length
    return <section className={"mt-20"}>
        <h2 className={"text-2xl"}>Producers</h2>
        <p className="text-muted-foreground">
            {producerCount} producer{producerCount === 1 ? "" : "s"} &mdash; live
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.producers.map((p) => (
                <Card key={p.uuid}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{p.producerName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground font-mono">{p.uuid}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    </section>;
}
