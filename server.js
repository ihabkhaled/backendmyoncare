const express = require("express");
const cors = require("cors");
const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors());
app.get("/", (req, res) => {
  return res.json({ status: 1 });
});

let port = 8000;

const server = app.listen(port, () => {
  console.warn(`App is running at: http://localhost:${server.address().port}`);
});

require('./mongo');

const router = require("./routes");
app.use("/api/", router);

module.exports = app;
