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
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
</svg>`,
      },
      {
        title: "Earth & Science",
        description:
          "Dive into geoscience, climate, and Earth’s natural wonders.",
        icon: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
</svg>
`,
      },
      {
        title: "Dark Energy Portals",
        description: "Unveil the hidden forces shaping our universe’s fate.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
</svg>
`,
      },
      {
        title: "Human Biology",
        description: "Understand the design and function of the human body.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
</svg>
`,
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
