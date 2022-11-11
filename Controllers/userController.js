const db = require("../models")
const { Op } = require("sequelize")
const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const { signToken } = require("../lib/jwt")
const fs = require("fs")
const handlebars = require("handlebars")
const {
  createVerificationToken,
  validateVerificationToken,
} = require("../lib/verification")
const emailer = require("../lib/emailer")

const User = db.User

const userController = {
  registerUser: async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid fields",
        })
      }
      const { username, phone_number, email, password } = req.body

      const findUserByUsernameOrPhoneNumberOrEmail = await User.findOne({
        where: {
          [Op.or]: {
            username,
            phone_number,
            email,
          },
        },
      })

      if (findUserByUsernameOrPhoneNumberOrEmail) {
        return res.status(400).json({
          message: "Username or phone number or email already registered",
        })
      }

      const hashedPassword = bcrypt.hashSync(password, 5)

      const newUser = await User.create({
        username,
        phone_number,
        email,
        password: hashedPassword,
      })

      const verification_token = createVerificationToken({
        id: newUser.id,
      })

      const verificationLink = `http://localhost:2000/user/verification?verification_token=${verification_token}`

      const rawHTML = fs.readFileSync(
        "templates/verification-user.html",
        "utf-8"
      )

      const compiledHTML = handlebars.compile(rawHTML)

      const htmlResult = compiledHTML({
        username,
        verificationLink,
      })

      await emailer({
        to: email,
        html: htmlResult,
        subject: "Verify your account",
        text: "please verify your account",
      })

      return res.status(200).json({
        message: "User Registered",
        data: newUser,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  loginUser: async (req, res) => {
    try {
      const { emailOrPhoneNumber, password } = req.body

      const findUserByEmailOrPhoneNumber = await db.User.findOne({
        where: {
          [Op.or]: {
            email: emailOrPhoneNumber,
            phone_number: emailOrPhoneNumber,
          },
        },
        include: [{ model: db.Seller }],
      })

      if (!findUserByEmailOrPhoneNumber) {
        return res.status(400).json({
          message: "Email or Phone Number not found ",
        })
      }

      const passwordValid = bcrypt.compareSync(
        password,
        findUserByEmailOrPhoneNumber.password
      )

      if (!passwordValid) {
        return res.status(400).json({
          message: "Wrong Password",
        })
      }

      delete findUserByEmailOrPhoneNumber.dataValues.password

      const token = signToken({
        id: findUserByEmailOrPhoneNumber.id,
      })

      return res.status(201).json({
        message: "Login Succesful",
        data: findUserByEmailOrPhoneNumber,
        token: token,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  refreshToken: async (req, res) => {
    try {
      const findUserById = await User.findByPk(req.user.id)

      const renewedToken = signToken({
        id: req.user.id,
      })

      return res.status(200).json({
        message: "Renewed user token",
        data: findUserById,
        token: renewedToken,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  verifyUser: async (req, res) => {
    try {
      const { verification_token } = req.query

      const validateToken = validateVerificationToken(verification_token)

      if (!validateToken) {
        return res.status(401).json({
          message: "Token Invalid",
        })
      }

      await User.update(
        { is_verified: true },
        { where: { id: validateToken.id } }
      )
      return res.redirect("http://localhost:3000/login")
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error or Token Expired",
      })
    }
  },
  resendVerificate: async (req, res) => {
    try {
      const findUserById = await User.findByPk(req.user.id)

      const verificationToken = createVerificationToken({
        id: req.user.id,
      })

      const verificationLink = `http://localhost:2000/user/verification?verification_token=${verificationToken}`

      const rawHTML = fs.readFileSync(
        "templates/verification-user.html",
        "utf-8"
      )

      const compiledHTML = handlebars.compile(rawHTML)

      const result = compiledHTML({
        username: findUserById.username,
        verificationLink,
      })

      await emailer({
        to: findUserById.email,
        html: result,
        subject: "Test email",
        text: "Halo Dunia",
      })

      return res.status(200).json({
        message: "Email sent",
      })
    } catch (error) {
      console.log(error)
    }
  },
  refreshToken: async (req, res) => {
    try {
      const findUserById = await User.findByPk(req.user.id)

      const renewedToken = signToken({
        id: req.user.id,
      })

      return res.status(200).json({
        message: "Renewed user token",
        data: findUserById,
        token: renewedToken,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error ",
      })
    }
  },
  getAllUser: async (req, res) => {
    try {
      const response = await User.findAll()

      return res.status(200).json({
        message: "Get All User",
        data: response,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
}

module.exports = {
  userController,
}
