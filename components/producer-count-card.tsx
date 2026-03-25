import React from "react";

interface ProducerCountCardProps {
    groupName: string;
    producers: Set<string>;
}

function ProducerCountCard({ groupName }: ProducerCountCardProps): React.JSX.Element {
    return <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">{groupName}</h1>
        </div>
    </div>;
}

export {ProducerCountCard}