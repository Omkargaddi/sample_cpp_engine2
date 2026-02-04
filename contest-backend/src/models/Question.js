const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  sequenceIndex: {
    type: Number, // 0, 1, 2... used to determine order
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    default: "Medium"
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Question", questionSchema);