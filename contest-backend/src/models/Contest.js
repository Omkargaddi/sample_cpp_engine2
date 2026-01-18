const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
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

contestSchema.index({ platform: 1, platformId: 1 }, { unique: true });
contestSchema.index({ startTime: 1 });

module.exports = mongoose.model("Contest", contestSchema);
