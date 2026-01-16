import { createContext } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

const socket = io(process.env.EXPO_PUBLIC_API_URL, {
    auth: {
        token: process.env.EXPO_PUBLIC_GAME_SECRET,
    },
    autoConnect: true,
    reconnection: true,
});

export function SocketProvider({ children }) {
    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
