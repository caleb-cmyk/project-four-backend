const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    propertyName: {
      type: String,
      required: true,
    },
    countryOfProperty: {
      type: String,
      required: true,
    },
    postcode: {
      type: Number,
      required: true,
    },
    addressLine: {
      type: String,
      required: true,
    },
    validated: {
      type: Boolean,
      required: true,
      default: false,
    },
    listed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
