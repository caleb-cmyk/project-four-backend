const express = require("express");
const router = express.Router();
const HostEvent = require("../models/hostEvent");
const verifyToken = require("../middleware/verify-token");

router.post("/new", verifyToken, async (req, res) => {
  try {

  // check if dates requested are within dates already requested && unavailable

  //   const hostEventInDatabase = await HostEvent.findOne({
  //       propertyId: req.body.propertyId,
  //   });

  //   if (hostEventInDatabase) {
  //     return res.status(409).json({ err: "Stay already requested." });
  //   }

    const hostEvent = await HostEvent.create({
      hostId: req.body.hostId,
      guestId: req.user._id,
      propertyId: req.body.propertyId,
      postcode: req.body.postcode,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      confirmed: req.body.confirmed,
    });

    res.status(201).json(hostEvent);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/:propertyId", verifyToken, async (req, res) => {
  try {
    const hostEventsByPropertyId = await HostEvent.find({ propertyId: req.params.propertyId }).populate("guestId");

    res.json({ hostEventsByPropertyId });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
