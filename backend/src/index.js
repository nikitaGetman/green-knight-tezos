const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const apiRoutes = require("./apiRoutes");

const dbClient = require("./dbClient");

dotenv.config();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  preflightContinue: true,
};

const app = express();
const port = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));

app.use("/api", apiRoutes);
// app.use("/*", express.static("public"));

dbClient.client.connect().then(() => {
  console.log("Database connected");
  app.listen(port, () => console.log(`Running on port ${port}`));
});
