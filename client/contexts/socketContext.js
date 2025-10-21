import React, { createContext } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

// const socket = io("http://192.168.0.109:4000");
const socket = io("http://127.0.0.1:4000"); //localhost

export function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}