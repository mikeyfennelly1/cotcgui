import React from "react"

export function ProducerView(producerCount: number) {
    return <section className={"mt-20"}>
        <h2 className={"text-2xl"}>Producers</h2>
        <p className="text-muted-foreground">
            {producerCount} producer{producerCount === 1 ? "" : "s"} &mdash; live
        </p>
    </section>;
}
