const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StorySchema = new Schema({
  title: String,
  description: String,
  body: String,
  image: String,
  date: Date,
  lastUpdate: Date,
  age: String,
  level: String,
  language: String,
  words: Number,
});

module.exports = mongoose.model("Story", StorySchema);
