const express = require("express");
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const { getMyPermissions } = require("../controllers/permission.controller");
const { register, login, getRoles } = require("../controllers/auth.controller");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me/permissions", authenticate, getMyPermissions);
router.get("/getallrole", getRoles);

module.exports = router;
