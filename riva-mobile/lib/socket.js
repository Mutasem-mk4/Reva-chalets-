import io from 'socket.io-client';

// Use localhost for emulator/simulator.
// Note: Android Emulator usually needs 10.0.2.2 instead of localhost, 
// but if using 'expo start' on same wifi, IP is best.
// For now, defaulting to localhost for web/iOS sim.
const SOCKET_URL = 'https://riva-jo.me';

export const socket = io(SOCKET_URL, {
    transports: ['websocket'], // Force websocket
    autoConnect: false,
});

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};
