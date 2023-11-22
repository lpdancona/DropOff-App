const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Employe = mongoose.model("Employe", employeSchema);

module.exports = Employe;
