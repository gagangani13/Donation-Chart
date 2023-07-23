import express from "express";
import bodyParser from "body-parser";
import router from "./router";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from 'http'
dotenv.config()
const app = express();
const server=http.createServer(app)

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST","DELETE","PATCH","PUT"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on('Donated',()=>{
    io.emit('updateChart')
    console.log('Donated')
  })
  socket.on("disconnect",()=>{
    console.log(`User disconnected:${socket.id}`);
  })
})

mongoose
  .connect(
    `mongodb+srv://gagangani17:${process.env.MONGODB_PASSWORD}@donation.xgugeor.mongodb.net/master?retryWrites=true&w=majority`
  )
  .then((res) => server.listen(process.env.PORT)
  )
  .catch((err) => console.error(err))

