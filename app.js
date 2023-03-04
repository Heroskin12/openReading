if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const engine = require("ejs-mate");
const path = require("path");
const sass = require("sass");
const mongoose = require("mongoose");
const Story = require("./models/stories");
const methodOverride = require("method-override");
const { Configuration, OpenAIApi } = require("openai");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", engine);
app.use(methodOverride("_method"));
const dbURL = process.env.DB_URL;
const languages = require("./seeds/languages.js");
const ages = require("./seeds/age.js");
const levels = require("./seeds/level.js");
mongoose.set("strictQuery", true);

mongoose.connect(dbURL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected!");
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Tells the app to find templates in the views folder and static assets in the public folder.
app.set("views", path.join(__dirname + "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/readings", async (req, res) => {
  const readings = await Story.find({});
  res.render("readings/readings", { readings });
});

app.post("/readings", async (req, res) => {
  const reading = new Story(req.body.reading);
  const visiblePrompt = `You requested a ${reading.words}-word text about ${reading.title} in ${reading.language}. This text will be for suitable for ${reading.age} of ${reading.level} level.`;
  const prompt = `Write a text about ${reading.title} in ${reading.language}. The text should be suitable for ${reading.age}. The people reading the text will have an ${reading.level} level of English. The text will have a total of ${reading.words} words.`;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 1,
      max_tokens: 3000,
    });
    reading.body = completion.data.choices[0].text;
    reading.image = "https://source.unsplash.com/collection/483251";
    reading.date = Date.now();
    reading.lastUpdate = Date.now();
    await reading.save();
    res.redirect(`/readings/${reading._id}`);
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
});

app.get("/readings/new", (req, res) => {
  res.render("readings/new");
});

app.get("/readings/:id", async (req, res) => {
  const reading = await Story.findById(req.params.id);
  res.render("readings/show", { reading });
});

app.put("/readings/:id", async (req, res) => {
  console.log("I am editing!");
  const { id } = req.params;
  const reading = await Story.findByIdAndUpdate(
    id,
    { ...req.body.reading },
    { runValidators: true, new: true }
  );
  //reading.lastUpdate = Date.now();
  if (!reading) {
    //req.flash('error', "Sorry, that reading does not exist!");
    res.redirect("/readings");
  }
  await reading.save();
  res.redirect(`/readings/${reading._id}`);
});

app.get("/readings/:id/edit", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const reading = await Story.findById(id);
  console.log(languages);
  res.render("readings/edit", { reading, ages, levels, languages });
});

app.delete("/readings/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const reading = await Story.findByIdAndDelete(id);
  res.redirect("/readings");
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
