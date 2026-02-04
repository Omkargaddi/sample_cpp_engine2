require("dotenv").config();
const mongoose = require("mongoose");
const Question = require("./models/Question");
const fs = require("fs");

const connectDB = require("./config/db"); 

const importData = async () => {
  try {
    await connectDB();

    const jsonFile = JSON.parse(fs.readFileSync("./questions.json", "utf-8"));
    console.log(`Read ${jsonFile.length} questions from file.`);

    let count = 0;
    
    for (let i = 0; i < jsonFile.length; i++) {
      const q = jsonFile[i];
      
      await Question.updateOne(
        { sequenceIndex: i }, 
        {
          $set: {
            title: q.title,
            url: q.url,
            difficulty: q.difficulty || "Medium"
          },
          $setOnInsert: { isCompleted: false } 
        },
        { upsert: true }
      );
      count++;
    }

    console.log(`Processed ${count} questions.`);
    process.exit();
  } catch (error) {
    console.error("Error with data import:", error);
    process.exit(1);
  }
};

importData();