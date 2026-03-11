import { describe, it, expect, beforeAll } from "vitest"
import { getStream } from "./page"

beforeAll(() => {
  process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:8082"
})

describe("getStream", () => {
  it("fetches stream data for 'test' from the real endpoint", async () => {
    const stream = await getStream("test")
    console.log("stream result:", JSON.stringify(stream, null, 2))
    expect(stream).not.toBeNull()
  })
})
