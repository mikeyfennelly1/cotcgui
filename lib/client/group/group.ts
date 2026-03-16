import {Group} from "@/lib/types/Group";
import {revalidateOptions} from "@/lib/client/common";
import {ServerSideException} from "@/lib/client/exception/ServerSideException";
import createLogger, {Logger} from "@/lib/logger";

async function getGroups(): Promise<Group[]> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/group`
    try {
        const res = await fetch(url, revalidateOptions)
        if (!res.ok) return []
        return res.json()
    } catch {
        return []
    }
}

/**
 * @throws ClientSideException
 * @throws ServerSideException
 * @param groupName
 */
async function getGroupByName(groupName: string): Promise<Group> {
    const logger: Logger = createLogger("getGroupByName")
    const url = `http://localhost:8082/api/group?name=${groupName}`
    const res: Response = await fetch(url, revalidateOptions)
    if (!res.ok) {
        logger.warn("received non-200 response")
        throw new ServerSideException("unable to fetch by group name")
    } else {
        return res.json()
    }
}

export {getGroups, getGroupByName}