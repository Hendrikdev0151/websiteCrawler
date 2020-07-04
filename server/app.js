const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
//load env variables
const dotenv = require("dotenv");
dotenv.config();

//db conn
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("DB wurde verbunden."))
  .catch((err) => console.log(err));

mongoose.connection.on("error", (err) => {
  console.log(`Es ist ein Fehler aufgetreten: ${err.message}`);
});

//routes

const crawlingRoutes = require("./routes/crawling.js");

//Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

app.use("/", crawlingRoutes);
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "invalid token..." });
  }
});

const port = 8099;

app.listen(port, () => {
  console.log(`Die API läuft auf Port: ${port}`);
});
