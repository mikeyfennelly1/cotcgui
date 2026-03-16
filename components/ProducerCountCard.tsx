import React from "react";
import {Tag} from "lucide-react";

function ProducerCountCard(groupName: string , producers: Set<string>) {
    return <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Tag className="h-5 w-5 text-primary"/>
        </div>
        <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">{groupName}</h1>
            <p className="text-muted-foreground">
                {producers.size} producer{producers.size === 1 ? "" : "s"} &mdash; live
            </p>
        </div>
    </div>;
}

export {ProducerCountCard}