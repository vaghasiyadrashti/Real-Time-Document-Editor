import { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SupplierContext = createContext();

export const SupplierProvider = ({ children }) => {
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [quill, setQuill] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_APP_SOCKET_URL || "http://localhost:8080", {
        transports: ["websocket", "polling"],  //  Ensures stable connection
        withCredentials: true
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      socketRef.current.on("disconnect", () => {
        console.warn("Disconnected from WebSocket server");
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("WebSocket Connection Error:", err.message);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const triggerUpdate = () => {
    setShouldUpdate((prev) => !prev);
  };

  return (
    <SupplierContext.Provider
      value={{
        darkMode,
        setDarkMode,
        shouldUpdate,
        triggerUpdate,
        loading,
        quill,
        setQuill,
        setLoading,
        currentDoc,
        setCurrentDoc,
        socket: socketRef.current, //  Use socketRef.current
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};

export const useSupplier = () => useContext(SupplierContext);
