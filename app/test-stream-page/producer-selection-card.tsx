import data from "@/app/test-stream-page/data.json";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";

function ProducerSelectionCard(selected: Set<string>, toggle: (name: string) => void): React.JSX.Element {
    return <Card className="w-56 shrink-0">
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
    </Card>;
}

export {ProducerSelectionCard}