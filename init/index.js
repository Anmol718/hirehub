const mongoose = require("mongoose");
const initData = require("./data.js");
const Job = require("../models/jobs.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/hirehub";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
  await Job.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "69ad78e4d0395481ed98dffc",
  }));
  await Job.insertMany(initData.data);
  console.log("Data was initialised");
};

initDb();
