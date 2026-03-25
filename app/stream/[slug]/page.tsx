import createLogger, { Logger } from "@/lib/logger"
import { Group } from "@/lib/types/Group"
import { getGroupByName } from "@/lib/client/group/group"
import React from "react"
import { Separator } from "radix-ui"
import { GroupBanner } from "./GroupBanner"
import { GroupStreamView } from "./GroupStreamView"
import { ProducerView } from "./ProducerView"

const logger: Logger = createLogger("GroupPage")

export default async function GroupPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const groupName: string = decodeURIComponent(slug);
    let group: Group;
    let producerCount: number;
    try {
        group = await getGroupByName(groupName);
        producerCount = group.producers.length;
    } catch {
        console.error("error getting group: ", groupName)
        return (<></>)
    }

    logger.info(`rendering group page for name=${group.name} producers=${producerCount}`)

    return (
        <main className="flex flex-col gap-6 m-10">
            {GroupBanner(groupName, group)}
            <Separator.Root className={"h-px bg-border"}/>
            {GroupStreamView(producerCount, group)}
            <Separator.Root className={"h-px bg-border"}/>
            {ProducerView(group)}
        </main>
    )
}
