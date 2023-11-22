const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vanSchema = new Schema({
  plate: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  employes: [{ type: Schema.Types.ObjectId, ref: "Employe" }],
});

const Van = mongoose.model("Van", vanSchema);

module.exports = Van;
