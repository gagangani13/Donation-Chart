"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.get('/donations', controller_1.donations);
router.post('/addAmount', controller_1.addAmount);
exports.default = router;
