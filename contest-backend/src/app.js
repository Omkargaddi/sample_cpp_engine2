const express = require("express");
const cors = require("cors");
const contestRoutes = require("./routes/contest.routes");
const calendarRoutes = require("./routes/calendar.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/contests", contestRoutes);
app.use("/api/contests", calendarRoutes);

module.exports = app;
