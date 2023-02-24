require("dotenv").config();
const express = require("express");
const engine = require("ejs-mate");
const path = require("path");

const app = express();

app.engine("ejs", engine);

// Tells the app to find templates in the views folder and static assets in the public folder.
app.set("views", path.join(__dirname + "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/readings", (req, res) => {
  res.send("Congratulations. You submitted a get request for schools.");
});

app.get("/readings/new", (req, res) => {
  res.send("So, you want to create a new text?");
});

app.get("/readings/:id", (req, res) => {
  res.send("Here is the specific school you have selected!");
});

app.get("/readings/:id/edit", (req, res) => {
  res.send("Now you can edit the reading too!");
});

app.get("/register", (req, res) => {
  res.send(req.body);
});

app.get("/login", (req, res) => {
  res.send(res.body);
});

app.listen(3000, () => {
  console.log(`Listening on Port ${process.env.PORT}`);
});
