const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weekdaySchema = new Schema({
  weekday: {
    type: String,
    required: true,
  },
  vans: [
    {
      type: Schema.Types.ObjectId,
      ref: "Van",
    },
  ],
});

const Weekday = mongoose.model("Weekday", weekdaySchema);

module.exports = Weekday;
