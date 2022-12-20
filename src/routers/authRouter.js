const express = require("express");

const {
  registrationController,
  loginController,
  addUserWishController,
  addUserSantaForController,
  getUserWishController,
} = require("../controllers/authController");

const { asyncWrapper } = require("../helpers/apiHelpers");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/registration", asyncWrapper(registrationController));

router.post("/login", asyncWrapper(loginController));

router.use(authMiddleware);

router.get("/wish", asyncWrapper(getUserWishController));
router.patch("/wish", asyncWrapper(addUserWishController));
router.patch("/santaFor", asyncWrapper(addUserSantaForController));

module.exports = { authRouter: router };
