const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const apiRoutes = require("./apiRoutes");

dotenv.config();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  preflightContinue: true,
};

const app = express();
const port = process.env.PORT;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));

app.use("/api", apiRoutes);
// app.use("/*", express.static("public"));

app.listen(port, () => console.log(`Running on port ${port}`));
