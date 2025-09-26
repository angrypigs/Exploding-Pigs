import React, { createContext } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

// inicjalizujemy socket TYLKO raz
const socket = io("http://localhost:4000");

export function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}