require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const studentsRoutes = require("./routes/students");
const vansRoutes = require("./routes/vans");
// express app
const app = express();
// middlewares
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
//routes
app.use("/api/students", studentsRoutes);
app.use("/api/vans", vansRoutes);

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
