"use server"

import { revalidateTag } from "next/cache"
import { createGroup, deleteGroup, getGroups } from "@/lib/client/group/group"
import { Group } from "@/lib/types/Group"

type ActionResult = { success: true } | { success: false; error: string }

async function createGroupAction(name: string): Promise<ActionResult> {
    try {
        await createGroup(name)
        revalidateTag('groups')
        return { success: true }
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Unknown error" }
    }
}

async function deleteGroupAction(name: string): Promise<ActionResult> {
    try {
        await deleteGroup(name)
        revalidateTag('groups')
        return { success: true }
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Unknown error" }
    }
}

async function getGroupsAction(): Promise<Group[]> {
    try {
        return await getGroups()
    } catch {
        return []
    }
}

export { createGroupAction, deleteGroupAction, getGroupsAction }
