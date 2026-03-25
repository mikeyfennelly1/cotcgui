import { describe, it, expect, beforeAll } from "vitest"
import { getGroupByName, createGroup } from "./group"
import { ServerSideException } from "@/lib/client/exception/ServerSideException"
import { ClientSideException } from "@/lib/client/exception/ClientSideException"

beforeAll(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:8082"
})

describe("getGroupByName", () => {
    const groupName: string = "test";

    it("get group by name successful request", async () => {
        const result = await getGroupByName(groupName)
        console.log(result)
    })

    it("ClientSideException message includes the group name", async () => {
        await expect(getGroupByName(groupName)).rejects.toSatisfy(
            (e: unknown) => e instanceof ClientSideException && e.message.includes(groupName)
        )
    })

    it("throws ServerSideException when the API returns non-200", async () => {
        process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:8082/nonexistent"
        await expect(getGroupByName(groupName)).rejects.toSatisfy(
            (e: unknown) => e instanceof ServerSideException
        )
    })
})

describe("createGroup", () => {
    it("resolves without throwing on successful creation", async () => {
        await expect(createGroup("test-group-vitest2")).resolves.toBeUndefined()
    })
})
