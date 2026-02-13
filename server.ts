import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const prisma = new PrismaClient();

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
            origin: "*", // Allow all origins for dev
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
        socket.on('send_message', async (data) => {
            const { bookingId, content, senderId } = data;
            console.log(`Message in ${bookingId}: ${content}`);

            try {
                // Save to Database
                const savedMessage = await prisma.message.create({
                    data: {
                        groupId: bookingId, // We use bookingId as groupId
                        content,
                        senderId,
                        type: 'TEXT'
                    },
                    include: {
                        sender: {
                            select: { id: true, name: true, image: true }
                        }
                    }
                });

                // Broadcast to everyone in the room (including sender)
                io.to(bookingId).emit('receive_message', {
                    id: savedMessage.id,
                    content: savedMessage.content,
                    senderId: savedMessage.senderId,
                    sender: savedMessage.sender,
                    createdAt: savedMessage.createdAt.toISOString(),
                    type: savedMessage.type
                });

            } catch (error) {
                console.error('Failed to save message:', error);
                // Optionally emit error back to sender
                socket.emit('message_error', { error: 'Failed to send message' });
            }
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
