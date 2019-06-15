require("dotenv").config({ path: ".env" });
const cors = require("cors");
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

// TODO Use express middleware to handle cookies (JWT)
// TODO Use express middleware to populate current user

server.express.use("/*", cors({
  credentials: true,
  origin: process.env.FRONTEND_URL
})); // allow cors

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is now running on port http:/localhost:${deets.port}`);
  }
);
