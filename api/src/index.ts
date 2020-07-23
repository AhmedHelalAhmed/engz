import express from "express";
const app = express();
import cors from "cors";
// const tasks = fs.readFileSync("./data/tasks.json", "utf8"); //todo get it from db
import morgan from "morgan";
import * as bodyParser from "body-parser";
import moment from "moment";
import methodOverride from "method-override";
import dotenv from "dotenv";
dotenv.config();
import routes from "./routes";
import { connection } from "./db";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connection(() => {
  app.listen(process.env.PORT);
});

app.get("/", (req, res) =>
  res.status(200).send({ message: "Welcome to our restful API" })
);

// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

app.use(morgan("dev"));
app.use(express.static("public"));
app.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});

// Tasks
app.use("/api", routes);

/**
 * Error handler middleware
 */
app.use((err, req, res, next) => {
  console.log("err");
  console.log(err);
  res.status(500).send(err.message);
});

app.use((req, res, next) => {
  res.json({ error: "404" });
});
