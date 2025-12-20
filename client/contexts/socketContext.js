import { createContext } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

const socket = io(process.env.EXPO_PUBLIC_API_URL);

export function SocketProvider({ children }) {
    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
