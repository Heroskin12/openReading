require("dotenv").config();
const express = require("express");
const engine = require("ejs-mate");
const path = require("path");
const sass = require("sass");

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
  res.render("readings/readings");
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

app.get("/lessons", (req, res) => {
  res.send("Here you can view all lesson plans!");
});

app.get("/lessons/new", (req, res) => {
  res.send("Here you can create a new lesson plan!");
});

app.get("/lessons/:id", (req, res) => {
  res.send("Here you can view a specific lesson plan!");
});

app.get("lessons/:id/edit", (req, res) => {
  res.send("Here you can edit a lesson plan!");
});

app.get("/all", (req, res) => {
  res.send("This page will display both texts and plans!");
});

app.get("/surprise", (req, res) => {
  res.send("This text will give you a random text or lesson plan!");
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
