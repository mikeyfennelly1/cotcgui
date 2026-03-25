import React from "react"
import { Group } from "@/lib/types/Group"
import { ProducerCountCard } from "@/components/producer-count-card"
import { DeleteGroupButton } from "@/components/app-sidebar/DeleteGroupButton"
import { producerListToNameSet } from "@/lib/translate/Translators"

export function GroupBanner(groupName: string, group: Group) {
    return <div className={"grid grid-cols-2"}>
        <ProducerCountCard groupName={groupName} producers={producerListToNameSet(group.producers)}/>
        <DeleteGroupButton groupName={groupName}/>
    </div>;
}
