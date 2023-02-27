if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const { beginnings, endings } = require("./stories");
const { lessons } = require("./lessons");
const { age } = require("./age");
const { level } = require("./level");
const Story = require("../models/stories");

function random50() {
  const random50 = Math.floor(Math.random() * 50);
  return random50;
}

mongoose.connect("mongodb://localhost:27017/openReading");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected!");
});

async function seedDB() {
  await Story.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const story = new Story({
      title: `${beginnings[random50()]} ${endings[random50()]}`,
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis beatae quis culpa voluptatibus dignissimos autem placeat blanditiis officia, deleniti nesciunt qui odio velit reiciendis molestiae tempora quidem. Cupiditate nobis unde excepturi porro, dolores sit repudiandae error quaerat, beatae adipisci ducimus maxime quisquam est quo minus nulla eveniet. Nam, ullam dolorem?",
      image: "https://source.unsplash.com/collection/483251",
      date: Date.now(),
      age: age[Math.floor(Math.random() * 5)],
      level: level[Math.floor(Math.random() * 6)],
    });
    await story.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});
