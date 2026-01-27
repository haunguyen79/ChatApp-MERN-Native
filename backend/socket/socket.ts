import { error } from 'console';
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer, Socket } from "socket.io";
import { registerUserEvents } from "./userEvents";
import { registerChatEvents } from "./chatEvents";
import Conversation from "../modals/Conversation";

dotenv.config();

export function initializeSocket(server: any): SocketIOServer {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "*",  // Allow all rigins
        },
    }); // Socket io server instance

    //Auth middleware
    io.use((socket: Socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
            if (err) {
                return next(new Error("Authentication error: Invalid token"));
            }

            // Attach user info data to socket
            let userData = decoded.user;
            socket.data = userData;
            socket.data.userId = userData.id;
            next();
        });
    });

    // When Socket connects, resgister events
    io.on("connection", async (socket: Socket) => {

        const userId = socket.data.userId;
        console.log(`User connected: ${userId}, username: ${socket.data.name}`);

        //Register event handlers
        registerChatEvents(io, socket);
        registerUserEvents(io, socket);

        // Join all the conversations rooms that the user is part of
        try {
            const conversations = await Conversation.find({
                participants: userId,
            }).select('_id');

            conversations.forEach((conversation) => {
                socket.join(conversation._id.toString());
            });
        } catch (error: any) {
            console.log('Error joining conversations: ', error)
        }

        socket.on("disconnect", () => {
            // User logs out
            console.log(`User disconnected: ${userId}`);
        });
    });

    return io;
}