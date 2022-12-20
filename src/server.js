const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { connectMongo } = require("./db/connection");
const { errorHandler } = require("./helpers/apiHelpers");

const { authRouter } = require("./routers/authRouter");

require("dotenv").config();

const app = express();
const PORT = 8082;

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);


app.use(errorHandler);

const start = async () => {
  try {
    await connectMongo();

    app.listen(PORT, (error) => {
      if (error) console.error("Error at a server launch", error.message);
      console.log(`Server running at port: ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to launch application with error ${error.message}`);
  }
};

start();

//TODO: for future calendar
function getCurrentDate() {
  const date = new Date();
  const currentDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  return currentDate;
}
