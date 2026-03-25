"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { createGroupAction } from "@/lib/actions/group"
import createLogger from "@/lib/logger"

const logger = createLogger("CreateGroupSheet")

export function CreateGroupSheet() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "g" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault()
                setOpen(true)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim()) return
        setLoading(true)
        setError(null)
        logger.info(`attempting to create group: name="${name.trim()}"`)
        try {
            const result = await createGroupAction(name.trim())
            if (!result.success) throw new Error(result.error)
            logger.info(`successfully created group: name="${name.trim()}"`)
            setName("")
            setOpen(false)
            router.refresh()
        } catch (err) {
            logger.error(`failed to create group: name="${name.trim()}" error=${err}`)
            setError("Failed to create group. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="my-20 py-5 shadow-xl w-full justify-start gap-2"
                        onClick={() => setOpen(true)}
                    >
                        <Plus className="h-4 w-4" />
                        New Group
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    Create a new group <kbd className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-black">Ctrl+G</kbd>
                </TooltipContent>
            </Tooltip>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle>Create Group</SheetTitle>
                    </SheetHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="group-name" className="text-sm font-medium">
                                Group name
                            </label>
                            <Input
                                id="group-name"
                                placeholder="e.g. sensors"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus
                            />
                            {error && (
                                <p className="text-destructive text-sm">{error}</p>
                            )}
                        </div>

                        <SheetFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={!name.trim() || loading}>
                                {loading ? "Creating..." : "Create"}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </>
    )
}
