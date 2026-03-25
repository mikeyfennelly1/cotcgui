class ClientSideException extends Error {
    override name: string = "ClientSideException";

    constructor(message: string) {
        super(message);
    }
}

export {ClientSideException}
