class ServerSideException implements Error {
    message: string;
    name: string = "ServerSideException";

    constructor(
        message: string,
    ) {
        this.message = message;
    }
}

export {ServerSideException}