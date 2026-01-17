import { Socket, Server as SocketIOServer } from "socket.io"

export function registerUserEvents(io: SocketIOServer, socket: Socket) {
    socket.on("testSocket", (data: any) => {
        socket.emit("TestSocketEventResponse", { msg: "Realtime updated!" });
    })
}