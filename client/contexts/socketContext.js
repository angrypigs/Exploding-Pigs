import React, { createContext } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

const socket = io("http://localhost:4000");

export function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}