import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

function SelectProducerCard(producers: Set<string>, selected: Set<string>, toggle: (name: string) => void) {
    return <Card className="w-56 shrink-0">
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
    </Card>;
}

export {SelectProducerCard}