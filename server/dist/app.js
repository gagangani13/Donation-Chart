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
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(router_1.default);
mongoose_1.default
    .connect(`mongodb+srv://gagangani17:${process.env.MONGODB_PASSWORD}@donation.xgugeor.mongodb.net/master?retryWrites=true&w=majority`)
    .then((res) => app.listen(process.env.PORT))
    .catch((err) => console.error(err));
