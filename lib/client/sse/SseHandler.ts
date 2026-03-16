import {TimeSeriesRecord} from "@/lib/types/TimeSeriesRecord";
import createLogger, {Logger} from "@/lib/logger";

type setState<T> = (value: (((prevState: T) => T) | T)) => void

export class SseHandler {
    private logger : Logger = createLogger("SseHandler");
    private readonly setRecords: setState<TimeSeriesRecord[]>
    private readonly setSelected: setState<Set<string>>

    constructor(
        setRecords: setState<TimeSeriesRecord[]>,
        setSelected: setState<Set<string>>,
    ) {
        this.setRecords = setRecords
        this.setSelected = setSelected
    }

    historyEventListener(event: MessageEvent): void {
        try {
            const batch: TimeSeriesRecord[] = JSON.parse(event.data)
            this.setRecords(batch)
        } catch (err) {
            this.logger.warn(`Failed to parse SSE history: ${err}`)
        }
    }

    updateEventListener(event: MessageEvent): void {
        try {
            const record: TimeSeriesRecord = JSON.parse(event.data)
            this.setRecords((prev) => [...prev, record])
        } catch (err) {
            this.logger.warn(`Failed to parse SSE update: ${err}`)
        }
    }

    public start(groupName: string): () => void {
        const url = `/api/group/events/${groupName}`
        const es = new EventSource(url)
        this.logger.info(`SSE connection opened to ${url}`)

        es.addEventListener("history", (event) => {
            this.historyEventListener(event);
        })

        es.addEventListener("update", (event) => {
            this.updateEventListener(event);
        })

        es.onerror = (): void => this.logger.error("SSE connection error")

        return (): void => {
            es.close()
            this.logger.info("SSE connection closed")
        }
    }
}
