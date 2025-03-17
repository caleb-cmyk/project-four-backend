const express = require("express");
const router = express.Router();
const HostEvent = require("../models/hostEvent");
const verifyToken = require("../middleware/verify-token");
const verifyDate = require("../middleware/verify-date");

router.post("/new", verifyToken, verifyDate, async (req, res) => {
  try {
    // https://www.geeksforgeeks.org/how-to-find-objects-between-two-dates-mongodb/
    // https://expressjs.com/en/guide/error-handling.html
    
    const { hostId, propertyId, dateStart, dateEnd } = req.body;
    const guestId = req.user._id;

    const existingHostEvent = await HostEvent.findOne({
      propertyId,
      $or: [
        { dateStart: { $lt: dateEnd }, dateEnd: { $gt: dateStart } },
      ],
    });

    if (existingHostEvent) {
      return res.status(400).json({ message: "These dates are unavailable." });
    }

    const hostEvent = await HostEvent.create({
      hostId,
      guestId,
      propertyId,
      dateStart,
      dateEnd
    });

    res.status(201).json(hostEvent);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/property/:propertyId", verifyToken, async (req, res) => {
  try {
    const { status } = req.query;
    const hostEventsByPropertyIdAndStatus = await HostEvent.find({
      propertyId: req.params.propertyId,
      ...(status && { status })
    }).populate({
      path: "guestId",
      select: "_id firstName lastName gender countryOfResidence",
    }).populate({
      path: "propertyId",
      select: "propertyName countryOfProperty addressLine Postcode",
    });

    res.json({ hostEventsByPropertyIdAndStatus });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/trips/:guestId", verifyToken, async (req, res) => {
  try {
    const { status } = req.query;
    const hostEventsByGuestIdAndStatus = await HostEvent.find({
      guestId: req.params.guestId,
      ...(status && { status })
    }).populate({
      path: "hostId",
      select: "_id firstName lastName gender countryOfResidence",
    }).populate({
      path: "propertyId",
      select: "propertyName countryOfProperty addressLine Postcode",
    });

    res.json({ hostEventsByGuestIdAndStatus });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document

router.put("/:hostEventId/edit", verifyToken, async (req, res) => {
  try {
    const hostEvent = await HostEvent.findByIdAndUpdate(
      req.params.hostEventId,
      { status: req.body.status },
      { new : true }
    );

    if (!hostEvent) {
      return res.status(404).json({ err: "Event not found" });
    }
    
    res.json({ hostEvent });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
