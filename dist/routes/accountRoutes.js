"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accountController_1 = require("../controllers/accountController");
const router = (0, express_1.Router)();
router.post("/submitKYC", accountController_1.handleKYCData);
exports.default = router;
