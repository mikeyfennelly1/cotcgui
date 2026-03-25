import createLogger, {Logger} from "@/lib/logger"
import { StreamView } from "@/components/stream-view"
import {Group} from "@/lib/types/Group";
import {getGroupByName} from "@/lib/client/group/group";
import {ProducerCountCard} from "@/components/producer-count-card";
import {producerListToNameSet} from "@/lib/translate/Translators";
import React from "react";
import {Separator} from "radix-ui";
import {DeleteGroupButton} from "@/components/app-sidebar/DeleteGroupButton";
import {Producer} from "@/lib/types/Producer";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

const logger: Logger = createLogger("GroupPage")

function NoProducersView({group}: { group: Group }): React.JSX.Element {
    return <>
        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
            <p className="text-muted-foreground italic">No producers for {group.name}</p>
        </div>
    </>;
}

function GroupBanner(groupName: string, group: Group) {
    return <div className={"grid grid-cols-2"}>
        <ProducerCountCard groupName={groupName} producers={producerListToNameSet(group.producers)}/>
        <DeleteGroupButton groupName={groupName}/>
    </div>;
}

function GroupStreamView(producerCount: number, group: Group) {
    return <div className={"m-10"}>
        {producerCount > 0 ? <StreamView producers={group.producers} streamName={group.name}/> :
            <NoProducersView group={group}/>}
    </div>;
}

function ProducerView(producerCount: number) {
    return <section className={"mt-20"}>
        <h2 className={"text-2xl"}>Producers</h2>
        <p className="text-muted-foreground">
            {producerCount} producer{producerCount === 1 ? "" : "s"} &mdash; live
        </p>
    </section>;
}

export default async function GroupPage({params}: { params: Promise<{ slug: string }> }) {
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
            {ProducerView(producerCount)}
        </main>
    )
}
