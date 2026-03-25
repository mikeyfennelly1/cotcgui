import React from "react"
import { Group } from "@/lib/types/Group"
import { StreamView } from "@/components/stream-view"
import { NoProducersView } from "./NoProducersView"

export function GroupStreamView(producerCount: number, group: Group) {
    return <div className={"m-10"}>
        {producerCount > 0 ? <StreamView producers={group.producers} streamName={group.name}/> : <NoProducersView group={group}/>}
    </div>;
}
