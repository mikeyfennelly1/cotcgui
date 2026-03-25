"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { deleteGroupAction } from "@/lib/actions/group"
import createLogger from "@/lib/logger"

const logger = createLogger("DeleteGroupButton")

export function DeleteGroupButton({ groupName }: { groupName: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        setLoading(true)
        logger.info(`attempting to delete group: name="${groupName}"`)
        const result = await deleteGroupAction(groupName)
        if (result.success) {
            logger.info(`successfully deleted group: name="${groupName}"`)
            toast.success(`Group ${groupName} deleted`)
            router.push("/")
            router.refresh()
        } else {
            logger.error(`failed to delete group: name="${groupName}" error=${result.error}`)
        }
        setLoading(false)
    }

    return (
        <Button variant={"destructive"} className={"ml-auto cursor-pointer"} onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Group"}
        </Button>
    )
}
