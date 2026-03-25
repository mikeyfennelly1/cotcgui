class ServerSideException extends Error {
    override name: string = "ServerSideException";

    constructor(message: string) {
        super(message);
    }
}

export {ServerSideException}