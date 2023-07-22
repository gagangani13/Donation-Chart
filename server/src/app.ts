import express from "express";
import bodyParser from "body-parser";
import router from "./router";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config()
const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(router);
mongoose
  .connect(
    `mongodb+srv://gagangani17:${process.env.MONGODB_PASSWORD}@donation.xgugeor.mongodb.net/master?retryWrites=true&w=majority`
  )
  .then((res) => app.listen(process.env.PORT))
  .catch((err) => console.error(err))
  