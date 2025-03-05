const mongoose = require("mongoose");

const hostEventSchema = new mongoose.Schema(
  {
    hostId: {
      type: String,
      required: true,
    },
    guestId: {
      type: String,
      required: true,
    },
    propertyId: {
      type: String,
      required: true,
    },
    dateStart: {
      type: String,
      required: true,
    },
    dateEnd: {
      type: String,
      required: true,
    },
    confirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HostEvent", hostEventSchema);
