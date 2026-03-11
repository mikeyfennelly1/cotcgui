import { describe, it, expect, beforeAll } from "vitest"
import { NextRequest } from "next/server"
import { GET } from "./route"

beforeAll(() => {
  process.env.SUBSCRIBER_URL = "http://localhost:8082"
})

describe("GET /api/group/events/[id]", () => {
  it("proxies SSE stream for group 'test'", async () => {
    const request = new NextRequest("http://localhost:3000/api/group/events/test")
    const params = Promise.resolve({ id: "test" })

    const response = await GET(request, { params })

    console.log("status:", response.status)
    console.log("content-type:", response.headers.get("Content-Type"))

    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("text/event-stream")

    // Read one chunk from the stream then cancel to avoid hanging
    const reader = response.body!.getReader()
    const { value } = await reader.read()
    const chunk = new TextDecoder().decode(value)
    console.log("first chunk:", chunk)
    await reader.cancel()
  })
})
