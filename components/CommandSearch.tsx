"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Activity, Layers } from "lucide-react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { getGroupsAction } from "@/lib/actions/group"
import { Group } from "@/lib/types/Group"

function flattenGroups(groups: Group[], prefix = ""): { name: string; href: string }[] {
    return groups.flatMap((g) => {
        const fullName = prefix ? `${prefix} / ${g.name}` : g.name
        return [
            { name: fullName, href: `/stream/${encodeURIComponent(g.name)}` },
            ...flattenGroups(g.children, fullName),
        ]
    })
}

export function CommandSearch() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [groups, setGroups] = useState<{ name: string; href: string }[]>([])

    // Double-Shift detection
    useEffect(() => {
        let lastShift = 0
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Shift") {
                const now = Date.now()
                if (now - lastShift < 300) {
                    setOpen((o) => !o)
                    lastShift = 0
                } else {
                    lastShift = now
                }
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    // Fetch groups when dialog opens
    useEffect(() => {
        if (!open) return
        getGroupsAction().then((data) => setGroups(flattenGroups(data)))
    }, [open])

    const runCommand = useCallback((href: string) => {
        setOpen(false)
        router.push(href)
    }, [router])

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search groups and pages..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Pages">
                    <CommandItem onSelect={() => runCommand("/nats")}>
                        <Activity className="mr-2 h-4 w-4" />
                        NATS
                    </CommandItem>
                </CommandGroup>
                {groups.length > 0 && (
                    <CommandGroup heading="Groups">
                        {groups.map((g) => (
                            <CommandItem key={g.href} onSelect={() => runCommand(g.href)}>
                                <Layers className="mr-2 h-4 w-4" />
                                {g.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
            </CommandList>
        </CommandDialog>
    )
}
