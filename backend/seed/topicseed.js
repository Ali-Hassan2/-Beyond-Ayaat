const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");
const Topics = require("../Models/topic-model");
const topicvalidation = require("../Validations/topics.validations");
dotenv.config();

const connection_db = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("The uri is", uri);
    if (!uri) {
      throw new Error(colors.bgRed("There is an error while getting uri"));
      process.exit(1);
    }
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(colors.green("MONGODB CONNECTED SUCCESSFULLY"));
  } catch (error) {
    console.log(colors.bgRed("There is an error and the error is:", error));
    process.exit(1);
  }
};

async function seeding_Data() {
  try {
    const topics = [
      {
        title: "Space & Time",
        description:
          "Explore the mysteries of time, relativity, and the vast cosmos.",
        icon: "IoMdTimer",
      },
      {
        title: "Earth & Science",
        description:
          "Dive into geoscience, climate, and Earth’s natural wonders.",
        icon: "FaEarthAfrica",
      },
      {
        title: "Dark Energy Portals",
        description: "Unveil the hidden forces shaping our universe’s fate.",
        icon: "TbGalaxy",
      },
      {
        title: "Human Biology",
        description: "Understand the design and function of the human body.",
        icon: "GiHumanPyramid",
      },
    ];

    for (let topic of topics) {
      let isvalid = topicvalidation.safeParse(topic);
      if (!isvalid.success) {
        console.log(
          colors.red(`The validation failed for this topic: ${topic.title}`)
        );
        console.dir(result.error.format(), { depth: null });
        return;
      }
    }
    await Topics.insertMany(topics);
    console.log("Topics added.");
  } catch (error) {
    console.log("Error in seeding the data.", error);
  }
}

async function execute_both() {
  await connection_db();
  await seeding_Data();
}

execute_both();
