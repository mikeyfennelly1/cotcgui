"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { deleteGroupAction } from "@/lib/actions/group"
import createLogger from "@/lib/logger"

const logger = createLogger("DeleteGroupButton")

export function DeleteGroupButton({ groupName }: { groupName: string }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [confirm, setConfirm] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "d" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault()
                handleOpen()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    function handleOpen() {
        setConfirm("")
        setOpen(true)
    }

    async function handleDelete() {
        setLoading(true)
        logger.info(`attempting to delete group: name="${groupName}"`)
        const result = await deleteGroupAction(groupName)
        if (result.success) {
            logger.info(`successfully deleted group: name="${groupName}"`)
            toast.success(`Group ${groupName} deleted`)
            router.push("/")
        } else {
            logger.error(`failed to delete group: name="${groupName}" error=${result.error}`)
        }
        setLoading(false)
        setOpen(false)
    }

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="destructive" className="ml-auto cursor-pointer" onClick={handleOpen}>
                        Delete Group
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    Delete this group <kbd className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-black">Ctrl+D</kbd>
                </TooltipContent>
            </Tooltip>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete &ldquo;{groupName}&rdquo;?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        This action cannot be undone. Type <span className="font-mono font-semibold text-foreground">{groupName}</span> to confirm.
                    </p>
                    <Input
                        placeholder={groupName}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        autoFocus
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={confirm !== groupName || loading}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
