"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.donations = exports.addAmount = void 0;
const model_1 = require("./model");
const addAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { place, amount, date } = req.body;
    if (!place || !amount || !date) {
        throw new Error();
    }
    const addAmount = new model_1.Donation({
        place, amount, date
    });
    const saveAmount = yield addAmount.save();
    try {
        res.send({ ok: true, content: saveAmount });
    }
    catch (error) {
        res.send({ ok: false, error: 'Failed to add amount' });
    }
});
exports.addAmount = addAmount;
const donations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getDonations = yield model_1.Donation.find();
    try {
        res.send(getDonations);
    }
    catch (error) {
        res.send(Error);
    }
});
exports.donations = donations;
