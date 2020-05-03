const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cors());

const dbUri = process.env.ATLAS_URI;

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Connected to MongoDB service");
});

const institutionRouter = require("./routes/institution");
const courseRouter = require("./routes/course");

app.use("/institutions", institutionRouter);
app.use("/courses", courseRouter);

app.listen(port, () => {
  console.log(`ratemyclasses-svc is running on port: ${port}`);
});
