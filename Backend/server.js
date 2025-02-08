// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import { socketCtrl } from './controllers/socket.controller.js';
// import { fileURLToPath } from 'url';
// import path, { dirname } from 'path';
// import userRouter from './routes/user.routes.js';
// import documentRouter from './routes/document.routes.js';
// import dbConnect from './utils/dbConnect.js';
// import cors from 'cors';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 8080;

// app.use(express.json());
// app.use(cors());

// // app.use(express.static(path.join(__dirname, 'client', 'dist')));

// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/documents', documentRouter);

// // app.get('/*', (req, res) => {
// //   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// // });

// const server = app.listen(PORT, async () => {
//   await dbConnect();
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// const io = new Server(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST']
//   },
// });

// socketCtrl(io);

import express from "express";
import http from "http";
import { Server } from "socket.io";
import { socketCtrl } from "./controllers/socket.controller.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import userRouter from "./routes/user.routes.js";
import documentRouter from "./routes/document.routes.js";
import dbConnect from "./utils/dbConnect.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/documents", documentRouter);

// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });

// ✅ Ensure MongoDB is connected **before** starting the server
dbConnect()
  .then(() => {
    console.log("✅ Connected to MongoDB");

    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });

    // ✅ Setup WebSockets properly
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"], // Ensure full connection support
      },
    });

    socketCtrl(io); // ✅ Initialize Socket.io after setting up the server
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
