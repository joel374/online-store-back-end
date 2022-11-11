const express = require("express")
const { userController } = require("../Controllers/userController")
const { body } = require("express-validator")
const { verifyToken } = require("../middlewares/userMiddleware")

const router = express.Router()

router.post(
  "/register",
  body(
    "username",
    "Username length has to be min 3, and only contain alphanumeric chars"
  )
    .isLength({ min: 3 })
    .isAlphanumeric(),
  body("email").isEmail(),
  body("password", "Password not strong enough").isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
    minLowercase: 1,
  }),
  userController.registerUser
)
router.post("/login", userController.loginUser)
router.get("/verification", userController.verifyUser)
router.post("/verification", verifyToken, userController.resendVerificate)
router.get("/refresh-token", verifyToken, userController.refreshToken)
router.get("/getAllUser", userController.getAllUser)

module.exports = router
