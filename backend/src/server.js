import dotenv from "dotenv";
dotenv.config();

import dns from "dns";

dns.setServers([
    '1.1.1.1',
    '8.8.8.1'
]);

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;
import http from "http";
import { initializeSocket } from "./socket/socket.js";
import registerChatSocket from "./socket/chat.socket.js";

const server = http.createServer(app);
const io = initializeSocket(server);
registerChatSocket(io);



const startServer = async () => {
    try {
        await connectDB();

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error(error);
    }
};

startServer();