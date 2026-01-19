import { Socket, Server as SocketIOServer } from "socket.io"
import User from "../modals/User";
import { generateToken } from "../ultis/token";

export function registerUserEvents(io: SocketIOServer, socket: Socket) {
    socket.on("testSocket", (data: any) => {
        socket.emit("TestSocketEventResponse", { msg: "Realtime updated!" });
    });

    socket.on('updateProfile', async (data: { name?: string; avatar?: string }) => {
        console.log('Updateprofile event:', data);

        const userId = socket.data.userId;
        if (!userId) {
            return socket.emit('updateProfile', {
                success: false,
                msg: "Unauthorized"
            })
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    name: data.name,
                    avatar: data.avatar
                }, { new: true }
            );
            if (!updatedUser) {
                return socket.emit('updateProfile', {
                    success: false,
                    msg: "User not found"
                });
            };

            //Gen token with updated values
            const newToken = generateToken(updatedUser);

            socket.emit('updateProfile', {
                success: true,
                data: { token: newToken },
                msg: "Profile updated successfully",
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            socket.emit('updateProfile', {
                success: false,
                msg: "Error updating profile"
            });
        }
    })
} 