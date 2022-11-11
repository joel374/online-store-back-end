const exress = require("express")
const dotenv = require("dotenv")
const db = require("./models")
const cors = require("cors")

dotenv.config()

const PORT = 2000

const app = exress()

app.use(cors())
app.use(exress.json())

const userRoute = require("./Routes/userRoute")
const imageSliderRoute = require("./Routes/imageSliderRoute")
const sellerRoute = require("./Routes/sellerRoute")
const productRoute = require("./Routes/productRoute")
const cartRoute = require("./Routes/cartRoute")
const { verifyToken } = require("./middlewares/userMiddleware")
app.use("/user", userRoute)
app.use("/image", imageSliderRoute)
app.use("/seller", verifyToken, sellerRoute)
app.use("/product", productRoute)
app.use("/cart", cartRoute)

app.listen(PORT, async () => {
  db.sequelize.sync({ alter: true })
  console.log("Listening in port", PORT)
})
