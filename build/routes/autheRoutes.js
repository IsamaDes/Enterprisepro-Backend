"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autheController_1 = require("../controllers/autheController");
const router = (0, express_1.Router)();
router.post('/register', autheController_1.register);
router.post('/login', autheController_1.login);
exports.default = router;
