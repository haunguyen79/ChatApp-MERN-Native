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
    });

    socket.on('getContacts', async () => {
        // Check user authentication
        try {
            const currentUserId = socket.data.userId;
            if (!currentUserId) {
                socket.emit('getContacts', {
                    success: false,
                    msg: "Unauthorized"
                });
                return;

            }
            const users = await User.find({ _id: { $ne: currentUserId } }, { password: 0 }) // Exclude password field
                .lean();  // Will fetch is objects

            const contacts = users.map((user) => ({
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                avatar: user.avatar || '',
            }));

            socket.emit('getContacts', {
                success: true,
                data: contacts,
            });


        } catch (error: any) {
            console.log('getContacts error: ', error);
            socket.emit('getContacts', {
                success: false,
                msg: 'Failed to fetch contacts',
            });
        }
    })

}
