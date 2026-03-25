import React from "react"
import { Group } from "@/lib/types/Group"

export function NoProducersView({ group }: { group: Group }): React.JSX.Element {
    return <>
        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
            <p className="text-muted-foreground italic">No producers for {group.name}</p>
        </div>
    </>;
}
