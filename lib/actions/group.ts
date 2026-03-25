"use server"

import { revalidatePath } from "next/cache"
import { deleteGroup } from "@/lib/client/group/group"

type ActionResult = { success: true } | { success: false; error: string }

async function deleteGroupAction(name: string): Promise<ActionResult> {
    try {
        await deleteGroup(name)
        revalidatePath("/", "layout")
        return { success: true }
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Unknown error" }
    }
}

export { deleteGroupAction }
