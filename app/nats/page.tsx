import { getNatsHealth } from "@/lib/client/nats/nats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"

export default async function NatsPage() {
    let health
    try {
        health = await getNatsHealth()
    } catch {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">NATS</h1>
                        <p className="text-muted-foreground">Unable to reach NATS server</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">NATS</h1>
                    <p className="text-muted-foreground text-sm">
                        {health.server_id} &mdash; {new Date(health.now).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard title="Streams" value={health.streams} />
                <StatCard title="Consumers" value={health.consumers} />
                <StatCard title="Messages" value={health.messages} />
                <StatCard title="Bytes" value={health.bytes} />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">API</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-4">
                        <Metric label="Level" value={health.api.level} />
                        <Metric label="Total" value={health.api.total} />
                        <Metric label="Errors" value={health.api.errors} highlight={health.api.errors > 0} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Memory & Storage</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Metric label="Memory" value={health.memory} />
                        <Metric label="Storage" value={health.storage} />
                        <Metric label="Reserved Memory" value={health.reserved_memory} />
                        <Metric label="Reserved Storage" value={health.reserved_storage} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Cluster</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Metric label="Accounts" value={health.accounts} />
                        <Metric label="HA Assets" value={health.ha_assets} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function StatCard({ title, value }: { title: string; value: number }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            </CardContent>
        </Card>
    )
}

function Metric({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className={`text-lg font-semibold ${highlight ? "text-destructive" : ""}`}>
                {value.toLocaleString()}
            </span>
        </div>
    )
}
