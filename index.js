require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

// list of short urls
var shortUrls = [];

app.use(cors());

app.use(bodyParser.urlencoded());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", (req, res) => {
  var url = req.body.url;

  console.log(url);

  const { hostname } = new URL(url);

  dns.lookup(hostname, (err, address, family) => {
    if (err) {
      console.log(err);
      res.json({
        error: "invalid url",
      });
    } else {
      shortUrls.push({
        url: url,
        shorturl: shortUrls.length + 1,
      });

      console.log(shortUrls);

      var current_url = shortUrls.find((short_url) => short_url.url == url);
      console.log(current_url);

      res.json({
        original_url: current_url.url,
        short_url: current_url.shorturl,
      });
    }
  });
});

app.get("/api/shorturl/:url", (req, res) => {
  var url = req.params.url;

  console.log(shortUrls);

  var target_url = shortUrls.find((short_url) => short_url.shorturl == url);

  if (!target_url) res.json({ error: "Non-existent url" });

  res.redirect(target_url.url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
