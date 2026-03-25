import { describe, it, expect, beforeAll } from "vitest"
import { getGroups, getGroupByName, createGroup } from "./group"
import { ServerSideException } from "@/lib/client/exception/ServerSideException"
import { ClientSideException } from "@/lib/client/exception/ClientSideException"
import {Group} from "@/lib/types/Group";

beforeAll(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:8082"
})

describe("getGroups", () => {
    it("returns an array on successful request", async () => {
        const result = await getGroups()
        expect(Array.isArray(result)).toBe(true)
    })

    it("each group has uuid, name, children, and producers fields", async () => {
        const result = await getGroups()
        for (const group of result) {
            expect(group).toHaveProperty("uuid")
            expect(group).toHaveProperty("name")
            expect(group).toHaveProperty("children")
            expect(group).toHaveProperty("producers")
        }
    })
})

describe("getGroupByName", () => {
    const groupName: string = "test";

    it("get group by name successful request", async () => {
        const result: Group[] = await getGroups()
        console.log(result)
    })

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
