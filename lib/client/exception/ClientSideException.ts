class ClientSideException implements Error {
    message: string;
    name: string = "ClientSideException";

    constructor(message: string,) {
        this.message = message;
    }
}

export {ClientSideException}
