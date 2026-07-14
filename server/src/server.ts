import "dotenv/config";
import http from "http";
import "./utils/cloudinary.js";
import { app } from "./app.js";
import connectDB from "./utils/db.js";
import { initSocketServer } from "../socketServer";

const server = http.createServer(app);

initSocketServer(server);

server.listen(process.env.PORT, async () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  await connectDB();
});
