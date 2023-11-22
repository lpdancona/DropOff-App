require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const studentsRoutes = require("./routes/students");
const vansRoutes = require("./routes/vans");
const employesRoutes = require("./routes/employes");
const weekdaysRoutes = require("./routes/weekdays");
const cors = require("cors");
const bodyParser = require("body-parser");

// express app
const app = express();
// middlewares
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
//routes
app.use("/api/students", studentsRoutes);
app.use("/api/vans", vansRoutes);
app.use("/api/employes", employesRoutes);
app.use("/api/weekdays", weekdaysRoutes);
// connect to mongodb

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen
    app.listen(process.env.PORT, () => {
      console.log("connected to mongodb and server listening on port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
