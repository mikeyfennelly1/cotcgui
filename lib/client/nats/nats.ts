import {revalidateOptions} from "@/lib/client/common";
import {ServerSideException} from "@/lib/client/exception/ServerSideException";
import createLogger, {Logger} from "@/lib/logger";

interface NatsApiStats {
    level: number
    total: number
    errors: number
}

interface NatsHealth {
    memory: number
    storage: number
    accounts: number
    api: NatsApiStats
    now: string
    config: unknown
    limits: Record<string, unknown>
    streams: number
    consumers: number
    messages: number
    bytes: number
    total: number
    reserved_memory: number
    reserved_storage: number
    ha_assets: number
    server_id: string
}

/**
 * @throws ServerSideException
 */
async function getNatsHealth(): Promise<NatsHealth> {
    const logger: Logger = createLogger("getNatsHealth")
    const url = `http://localhost:8082/api/nats/health`
    const res: Response = await fetch(url, revalidateOptions)
    if (!res.ok) {
        logger.warn("received non-200 response")
        throw new ServerSideException("unable to fetch NATS health")
    }
    return res.json()
}

export {getNatsHealth}
export type {NatsHealth, NatsApiStats}
