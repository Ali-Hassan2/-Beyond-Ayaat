const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { connectDB, disconnectDB } = require("./Config/db");
const colors = require("colors");
const app = express();
dotenv.config();

const port = process.env.PORT || 3005;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello this is the / route.");
});
let server;
const startServer = () => {
  return new Promise((resolve, reject) => {
    try {
      connectDB();
      server = app.listen(port, () => {
        console.log(colors.bgGreen(`Server is running at the port: ${port}`));
      });
      resolve(server);
    } catch (error) {
      console.log(colors.bgRed("Error while starting the server: ", error));
      reject(error);
      process.exit(1);
    }
  });
};

const shuttingdown_server = async () => {
  console.log(colors.bgBlue("Gracefully shutting down Server...."));
  if (server) {
    server.close(() => {
      console.log(colors.bgYellow("HTTP server closed."));
    });
  }

  await disconnectDB();
};

process.on("SIGINT", shuttingdown_server);
process.on("SIGTERM", shuttingdown_server);

startServer();
