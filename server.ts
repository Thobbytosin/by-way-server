import { app } from "./app";
import dotenv from "dotenv";
import connectDB from "./utils/db";
import http from "http";
import { initSocketServer } from "./socketServer";

// create server
const server = http.createServer(app);

// to access environment variables in server
dotenv.config();

const PORT = parseInt(process.env.PORT || "8000", 10);
const HOST = "0.0.0.0" as string; // for calling mobile

// start socket server
initSocketServer(server);

// create server
server.listen(PORT, HOST, () => {
  console.log(`Application is running on port ${PORT}`);
  connectDB();
});
