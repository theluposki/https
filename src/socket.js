import { Server } from "socket.io"

export const Socket = (server) => {
  const users = []

  const io = new Server(server)

  io.on('connection', (socket) => {
    socket.on("user_connected", (username) => {
        users[username] = socket.id
        io.emit("user_connected", username)
        console.log(users)
    })

    socket.on("send_message", (data) => {
        const socketId = users[data.receiver]
        io.to(socketId).emit("new_message", data)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
  })
}
