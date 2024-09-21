require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
//const loginRoute = require("./router/login");
const registerRoute = require("./routers/register");
// const feedbackIns = require("./router/feedback");
// const addquestionRoute = require("./router/addquestion");
// const answer = require("./router/answer");
// const totalCandidates = require("./router/totalcandidates");
// const responseAns = require("./router/feedresponse");
// const ansMarking = require("./services/ansmarking");
require("./config/dbconfig");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTION,GET,POST,PUT,PATCH,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/", (req, res) => { 
  res.send("Hi,the API is working.");
});

//Middlewares
app.use(express.json());
app.use(cookieParser());

// routers -------------------

app.use("/register", registerRoute);
// app.use("/", loginRoute);

const port = process.env.PORT || 4200;
app.listen(port, () => {
  console.log(`Server is running successfully on port : ${port}`);
});
