const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const morgan = require("morgan")
const colors = require("colors")
const cookieParser = require("cookie-parser")
const cloudinary = require("cloudinary").v2
const fileUpload = require("express-fileupload")
const { connectDB, disconnectDB } = require("./settings/db")
const userRouter = require("./endpoints/userRoute")
const adminRouter = require("./endpoints/adminRoute")
const topicRouter = require("./endpoints/topicRoute")
const subtopicRouter = require("./endpoints/subtopics")
const blogRouter = require("./endpoints/blogsRoute")
const userProfileRouter = require("./endpoints/user-profile")
const reportsRouter = require("./endpoints/reportRoute")
const roomsRouter = require("./endpoints/roomRoute")
const messsagesRouter = require("./endpoints/messageRouter")
const userAnalyticsRouter = require("./endpoints/user-analytics.route")
const blogsAnalyticsRouter = require("./endpoints/blogs-analytics.route")
const roomAnalyticsRouter = require("./endpoints/rooms-analytics")

const app = express()
dotenv.config()

const port = process.env.PORT || 3005

app.use(morgan("dev"))
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 },
  })
)

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// routes
app.use("/user", userRouter)
app.use("/admin", adminRouter)
app.use("/topics", topicRouter)
app.use("/subtopic", subtopicRouter)
app.use("/blogs", blogRouter)
app.use("/userprofile/ba", userProfileRouter)
app.use("/reports/rc", reportsRouter)
app.use("/rooms/mdmr", roomsRouter)
app.use("/msg", messsagesRouter)
app.use("/analytics/user", userAnalyticsRouter)
app.use("/analytics/blogs", blogsAnalyticsRouter)
app.use("/analytics/rooms", roomAnalyticsRouter)

// server setup
app.get("/", (req, res) => {
  const db = {
    username: "Hello",
    password: "lplp",
  }
  res.send({
    username: "pipipip",
  })
})
let server
const startServer = () => {
  return new Promise((resolve, reject) => {
    try {
      connectDB()
      server = app.listen(port, () => {
        console.log(
          colors.bgGreen(`Server is running at the pppppppppppport: ${port}`)
        )
      })
      resolve(server)
    } catch (error) {
      console.log(colors.bgRed("Error while starting the server: ", error))
      reject(error)
      process.exit(1)
    }
  })
}

const shuttingdown_server = async () => {
  console.log(colors.bgBlue("Gracefully shutting down Server...."))
  if (server) {
    server.close(() => {
      console.log(colors.bgYellow("HTTP server closed."))
    })
  }

  await disconnectDB()
}

process.on("SIGINT", shuttingdown_server)
process.on("SIGTERM", shuttingdown_server)

startServer()
