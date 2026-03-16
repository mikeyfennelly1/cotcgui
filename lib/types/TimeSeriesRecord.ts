interface TimeSeriesRecord {
    id: string
    key: string
    value: number
    producerName: string
    readTime: string
}

export type {TimeSeriesRecord}