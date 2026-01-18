const mongoose = require("mongoose");

const contest2Schema = new mongoose.Schema(
  {
    platform: {
      type: String,
        enum: ["CODEFORCES", "CODECHEF", "LEETCODE", "ATCODER"],
      required: true
    },
    platformId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    durationMinutes: {
      type: Number,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

contest2Schema.index({ platform: 1, platformId: 1 }, { unique: true });
contest2Schema.index({ startTime: 1 });

module.exports = mongoose.model("Contest", contest2Schema);
