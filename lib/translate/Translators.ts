import {TimeSeriesRecord} from "@/lib/types/TimeSeriesRecord";
import {TimeSeriesMessage} from "@/lib/types/TimeSeriesMessage";
import {Producer} from "@/lib/types/Producer";

function messageToRecords(msg: TimeSeriesMessage): TimeSeriesRecord[] {
    const readTime = new Date(msg.read_time * 1000).toISOString()
    // loop through every value, create
    return Object.entries(msg.values)
        .map(([key, value]: [string, number]) => ({
            id: `${msg.producer_id}-${key}-${msg.read_time}`,
            key,
            value,
            producerName: msg.producer_name,
            readTime,
        }))
}

function producerListToNameSet(producers: Producer[]): Set<string> {
    return new Set(producers.map((p) => p.producerName));
}

export {messageToRecords, producerListToNameSet}