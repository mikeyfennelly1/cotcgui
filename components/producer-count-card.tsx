import React from "react";
import data from "@/app/test-stream-page/data.json";
import {Tag} from "lucide-react";

function ProducerCountCard(): React.JSX.Element {
    return <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Tag className="h-5 w-5 text-primary"/>
        </div>
        <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">{data.streamName}</h1>
            <p className="text-muted-foreground">
                {data.producers.length} producers &mdash; static demo
            </p>
        </div>
    </div>;
}

export {ProducerCountCard}