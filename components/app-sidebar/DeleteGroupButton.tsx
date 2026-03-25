"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deleteGroup } from "@/lib/client/group/group"
import createLogger from "@/lib/logger"

const logger = createLogger("DeleteGroupButton")

export function DeleteGroupButton({ groupName }: { groupName: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        setLoading(true)
        logger.info(`attempting to delete group: name="${groupName}"`)
        try {
            await deleteGroup(groupName)
            logger.info(`successfully deleted group: name="${groupName}"`)
            router.push("/")
        } catch (err) {
            logger.error(`failed to delete group: name="${groupName}" error=${err}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button variant={"destructive"} className={"ml-auto cursor-pointer"} onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Group"}
        </Button>
    )
}
