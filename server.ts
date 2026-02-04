import { createServer } from 'http'; // Use node's http server
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io'; // Import socket.io

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    // 1. Create native HTTP server
    const httpServer = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url!, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    });

    // 2. Attach Socket.io to the HTTP server
    const io = new Server(httpServer, {
        cors: {
            origin: "*", // Allow all origins for dev (e.g., mobile app)
            methods: ["GET", "POST"]
        }
    });

    // 3. Socket Logic
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Join a "Room" (each booking is a room)
        socket.on('join_room', (bookingId) => {
            socket.join(bookingId);
            console.log(`User ${socket.id} joined room: ${bookingId}`);

            // Notify others in room
            socket.to(bookingId).emit('user_joined', { userId: socket.id });
        });

        // Handle sending messages
        socket.on('send_message', (data) => {
            const { bookingId, content, senderId, senderName } = data;
            console.log(`Message in ${bookingId}: ${content}`);

            // Broadcast to everyone in the room (including sender, for simple optimistic UI)
            io.to(bookingId).emit('receive_message', {
                id: Math.random().toString(), // Temp ID
                content,
                senderId,
                sender: { name: senderName },
                createdAt: new Date().toISOString(),
                type: 'TEXT'
            });

            // TODO: Ideally, save to DB here asynchronously
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    // 4. Start Server
    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
        console.log(`> Socket.io ready on same port`);
    });
});
