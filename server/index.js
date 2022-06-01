const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const http = require("http");
const app = express();
const cors = require("cors");

const path = "./db.json";

const storeData = (data) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

const loadData = () => {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (err) {
    console.error(err);
    return false;
  }
};

app.use(bodyParser.json());
app.use(cors());

app.post("/address", (req, res) => {
  let data = req.body;
  console.log(data);

  console.log("loadData()", loadData());

  const l = loadData();
  storeData({ accounts: [...new Set([...data["accounts"], ...l["accounts"]])] });

  res.send("200");
});

app.use(function (req, res, next) {
  next();
});

app.listen(3002, function () {
  console.log("Server started on port 3002...");
});
