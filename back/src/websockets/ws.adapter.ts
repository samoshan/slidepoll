import { IoAdapter } from '@nestjs/platform-socket.io';

export class SessionIoAdapter extends IoAdapter {

    static wrap = (middleware: (req: any, res: any, next: any) => any) => (socket: { request: any; }, next: any) => middleware(socket.request, {}, next);
    private sessionSettings: any;

    constructor(appOrHttpServer: any, sessionSettings: any) {
        super(appOrHttpServer);
        this.sessionSettings = sessionSettings;
    }

    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);

        server.use(SessionIoAdapter.wrap(this.sessionSettings));

        return server;
    }

}
