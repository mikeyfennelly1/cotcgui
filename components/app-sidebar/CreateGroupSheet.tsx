"use client"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { createGroup } from "@/lib/client/group/group"

export function CreateGroupSheet() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim()) return
        setLoading(true)
        setError(null)
        try {
            await createGroup(name.trim())
            setName("")
            setOpen(false)
            router.refresh()
        } catch {
            setError("Failed to create group. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => setOpen(true)}
            >
                <Plus className="h-4 w-4" />
                New Group
            </Button>

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
