interface TimeSeriesMessage {
    producer_id: string
    producer_name: string
    read_time: number
    values: Record<string, number>
}

export type {TimeSeriesMessage}