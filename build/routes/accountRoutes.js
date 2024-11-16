"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accountController_1 = require("../controllers/accountController");
const accountController_2 = require("../controllers/accountController");
const router = (0, express_1.Router)();
router.post("/submitKYC", accountController_1.handleKYCData);
// Route to update director details for a business
router.patch('/director/update', accountController_2.updateDirectorDetails);
// Route to update admin details for a user
router.patch('/admin/update', accountController_2.updateAdminDetails);
exports.default = router;
