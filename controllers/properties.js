const express = require("express");
const router = express.Router();
const Property = require("../models/property");
const verifyToken = require("../middleware/verify-token");

router.post("/new", verifyToken, async (req, res) => {
  try {
    const addressLineInDatabase = await Property.findOne({
      addressLine: req.body.addressLine,
    });

    if (addressLineInDatabase) {
      return res.status(409).json({ err: "Property already listed." });
    }

    const property = await Property.create({
      hostId: req.user._id,
      propertyName: req.body.propertyName,
      countryOfProperty: req.body.countryOfProperty,
      postcode: req.body.postcode,
      addressLine: req.body.addressLine,
    });

    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const propertiesByHostId = await Property.find({
      hostId: req.user._id,
    }).populate({ path: "hostId", select: "hostId firstName lastName" });

    res.json({ propertiesByHostId });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { propertyLocation } = req.query;
    
    const propertiesByLocation = await Property.find({
      countryOfProperty: propertyLocation,
    })
    .populate({
      path: "hostId",
      select: "_id firstName lastName gender",
    });

    res.json({ propertiesByLocation });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/:propertyId", verifyToken, async (req, res) => {
  try {
    const propertyById = await Property.findById(
      req.params.propertyId
    ).populate({ path: "hostId", select: "hostId firstName lastName" });

    if (!propertyById) {
      return res.status(404).json({ err: "Property not found." });
    }

    res.json({ propertyById });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
