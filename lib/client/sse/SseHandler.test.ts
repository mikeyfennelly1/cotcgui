import { describe, it, expect, vi } from "vitest"
import { SseHandler } from "./SseHandler"
import type { TimeSeriesRecord } from "@/lib/types/TimeSeriesRecord"

const realUpdateMsg: string = "{\"id\":\"6623aada-ec08-46de-b521-966fae86e78c\",\"key\":\"load_1\",\"value\":2.61,\"producerName\":\"clitest\",\"readTime\":\"+58167-12-11T18:16:27Z\"}"
const realUpdateRecord: TimeSeriesRecord = JSON.parse(realUpdateMsg)

function makeHandler() {
    const setRecords = vi.fn()
    const setSelected = vi.fn()
    const setProducers = vi.fn()
    const handler = new SseHandler(setRecords, setSelected, setProducers)
    return { handler, setRecords, setSelected, setProducers }
}

describe("SseHandler", () => {
    describe("historyEventListener", () => {
        const realUpdateRecord: TimeSeriesRecord = JSON.parse(realUpdateMsg)
        console.log(realUpdateRecord)
    })
    describe("historyEventListener", () => {
        it("calls setRecords with the parsed batch", () => {
            const { handler, setRecords } = makeHandler()
            const batch: TimeSeriesRecord[] = [
                { id: "1", key: "cpu", value: 10, producerName: "prod-a", readTime: "2024-01-01T00:00:00Z" },
                { id: "2", key: "cpu", value: 20, producerName: "prod-b", readTime: "2024-01-01T00:00:01Z" },
            ]
            handler.historyEventListener(new MessageEvent("history", { data: JSON.stringify(batch) }))

            expect(setRecords).toHaveBeenCalledWith(batch)
        })

        it("calls addProducer for each record in the batch", () => {
            const { handler, setProducers } = makeHandler()
            const batch: TimeSeriesRecord[] = [
                { id: "1", key: "cpu", value: 10, producerName: "prod-a", readTime: "2024-01-01T00:00:00Z" },
                { id: "2", key: "cpu", value: 20, producerName: "prod-b", readTime: "2024-01-01T00:00:01Z" },
            ]
            handler.historyEventListener(new MessageEvent("history", { data: JSON.stringify(batch) }))

            expect(setProducers).toHaveBeenCalledTimes(2)
        })

        it("does not throw on invalid JSON", () => {
            const { handler } = makeHandler()
            expect(() => {
                handler.historyEventListener(new MessageEvent("history", { data: "not valid json" }))
            }).not.toThrow()
        })
    })

    describe("updateEventListener", () => {
        it("calls setRecords with an updater that appends the new record", () => {
            const { handler, setRecords } = makeHandler()
            const event = new MessageEvent("update", { data: realUpdateMsg })
            handler.updateEventListener(event)

            expect(setRecords).toHaveBeenCalledOnce()
            const updater = setRecords.mock.calls[0][0] as (prev: TimeSeriesRecord[]) => TimeSeriesRecord[]
            const existing: TimeSeriesRecord[] = [
                { id: "1", key: "mem", value: 55, producerName: "prod-a", readTime: "2024-01-01T00:00:00Z" },
            ]
            expect(updater(existing)).toEqual([...existing, realUpdateRecord])
        })

        it("calls addProducer with the record's producer name", () => {
            const { handler, setProducers } = makeHandler()
            handler.updateEventListener(new MessageEvent("update", { data: realUpdateMsg }))

            expect(setProducers).toHaveBeenCalledOnce()
        })

        it("does not throw on invalid JSON", () => {
            const { handler } = makeHandler()
            expect(() => {
                handler.updateEventListener(new MessageEvent("update", { data: "{bad json" }))
            }).not.toThrow()
        })
    })

    describe("addProducer", () => {
        it("adds a new producer via setProducers", () => {
            const { handler, setProducers } = makeHandler()
            handler.addProducer("prod-a")

            expect(setProducers).toHaveBeenCalledOnce()
            const updater = setProducers.mock.calls[0][0] as (prev: Set<string>) => Set<string>
            const result = updater(new Set())
            expect(result.has("prod-a")).toBe(true)
        })

        it("does not add a duplicate producer", () => {
            const { handler, setProducers } = makeHandler()
            handler.addProducer("prod-a")

            const updater = setProducers.mock.calls[0][0] as (prev: Set<string>) => Set<string>
            const existing = new Set(["prod-a"])
            const result = updater(existing)
            expect(result).toBe(existing)
        })

        it("also selects the new producer via setSelected", () => {
            const { handler, setProducers, setSelected } = makeHandler()
            handler.addProducer("prod-a")

            const producerUpdater = setProducers.mock.calls[0][0] as (prev: Set<string>) => Set<string>
            producerUpdater(new Set())

            expect(setSelected).toHaveBeenCalledOnce()
            const selectedUpdater = setSelected.mock.calls[0][0] as (prev: Set<string>) => Set<string>
            expect(selectedUpdater(new Set()).has("prod-a")).toBe(true)
        })
    })
})
