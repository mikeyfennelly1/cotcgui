import {Group} from "@/lib/types/Group";
import {revalidateOptions} from "@/lib/client/common";
import {ServerSideException} from "@/lib/client/exception/ServerSideException";
import createLogger, {Logger} from "@/lib/logger";
import {ClientSideException} from "@/lib/client/exception/ClientSideException";

async function getGroups(): Promise<Group[]> {
    const url = `http://localhost:8082/api/group`
    try {
        const res = await fetch(url, { next: { revalidate: 60, tags: ['groups'] } })
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
    let url: string
    if (groupName) {
        url = `http://localhost:8082/api/group?name=${groupName}`;
    } else {
            throw new ClientSideException("groupName must not be null");
    }
    const res: Response = await fetch(url, revalidateOptions)
    if (!res.ok) {
        logger.warn("received non-200 response")
        throw new ServerSideException("unable to fetch by group name")
    } else {
        return res.json()
    }
}

/**
 * @throws ServerSideException
 * @param name
 */
async function createGroup(name: string): Promise<void> {
    const logger: Logger = createLogger("createGroup")
    const url = `http://localhost:8082/api/group?name=${encodeURIComponent(name)}`
    const res: Response = await fetch(url, { method: "POST" })
    if (!res.ok) {
        logger.warn("received non-200 response")
        throw new ServerSideException("unable to create group")
    }
}

/**
 * @throws ServerSideException
 * @param name
 */
async function deleteGroup(name: string): Promise<void> {
    const logger: Logger = createLogger("deleteGroup")
    const url = `http://localhost:8082/api/group?name=${encodeURIComponent(name)}`
    const res: Response = await fetch(url, { method: "DELETE" })
    if (!res.ok) {
        logger.warn("received non-200 response")
        throw new ServerSideException("unable to delete group")
    }
}

export {getGroups, getGroupByName, createGroup, deleteGroup}