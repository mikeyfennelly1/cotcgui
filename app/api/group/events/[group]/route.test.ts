import { describe, it, expect, beforeAll } from "vitest"
import { NextRequest } from "next/server"
import { GET } from "./route"
import {TimeSeriesMessage} from "@/app/test-stream-page/page";

beforeAll(() => {
  process.env.SUBSCRIBER_URL = "http://localhost:8082"
})

describe("GET /api/group/events/[id]", () => {
  it("proxies SSE stream for group 'test'", async () => {
    const request = new NextRequest("http://localhost:8082/api/group/events?group=test")
    const params = Promise.resolve({ id: "test" })

    const response = await GET(request, { params })

    console.log("status:", response.status)
    console.log("content-type:", response.headers.get("Content-Type"))

    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("text/event-stream")

    const reader: ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>> = response.body!.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      if (chunk) console.log("chunk:", chunk)
    }
  })
})
