"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const router_1 = __importDefault(require("./router"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(router_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "https://donation-chart.vercel.app",
        methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    },
});
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    socket.on('Donated', () => {
        io.emit('updateChart');
        console.log('Donated');
    });
    socket.on("disconnect", () => {
        console.log(`User disconnected:${socket.id}`);
    });
});
mongoose_1.default
    .connect(`mongodb+srv://gagangani17:${process.env.MONGODB_PASSWORD}@donation.xgugeor.mongodb.net/master?retryWrites=true&w=majority`)
    .then((res) => server.listen(process.env.PORT))
    .catch((err) => console.error(err));
