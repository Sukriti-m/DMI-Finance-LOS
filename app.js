require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const loginRoute = require("./routers/login");
const registerRoute = require("./routers/register");
const loanBookingRoute = require('./routers/loanBooking.js');
const cibilscoreRoute = require("./routers/cibilscore");

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require("./config/dbconfig");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/", (req, res) => {
  res.send("Hi, the API is working.");
});

// Routers
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/cibil-score", cibilscoreRoute);
app.use('/loans', loanBookingRoute);

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'Loan Origination System API',
      version: '1.0.0',
      description: 'API documentation for LOS',
    },
    servers: [
      {
        url: 'https://dmi-finance-los.onrender.com/', // Update this with your server URL
      },
    ],
  },
  apis: ['./routers/*.js'], // Update this to include all route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const port = process.env.PORT || 4200;
app.listen(port, () => {
  console.log(`Server is running successfully on port: ${port}`);
});
