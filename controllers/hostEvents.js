const express = require("express");
const router = express.Router();
const HostEvent = require("../models/hostEvent");
const verifyToken = require("../middleware/verify-token");
const verifyDate = require("../middleware/verify-date");

router.post("/new", verifyToken, verifyDate, async (req, res) => {
  try {
    const hostEvent = await HostEvent.create({
      hostId: req.body.hostId,
      guestId: req.user._id,
      propertyId: req.body.propertyId,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      status: req.body.status,
    });

    res.status(201).json(hostEvent);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


// ============= correct .post below ===============
// router.post("/new", verifyToken, async (req, res) => {
//   try {
//     const hostEvent = await HostEvent.create({
//       hostId: req.body.hostId,
//       guestId: req.user._id,
//       propertyId: req.body.propertyId,
//       dateStart: req.body.dateStart,
//       dateEnd: req.body.dateEnd,
//       status: req.body.status,
//     });

//     res.status(201).json(hostEvent);
//   } catch (err) {
//     res.status(500).json({ err: err.message });
//   }
// });

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

// router.get("/:propertyId", verifyToken, async (req, res) => {
//   try {
//     const hostEventsByPropertyId = await HostEvent.find({
//       propertyId: req.params.propertyId,
//     }).populate({
//       path: "guestId",
//       select: "_id firstName lastName gender countryOfResidence",
//     });

//     res.json({ hostEventsByPropertyId });
//   } catch (err) {
//     res.status(500).json({ err: err.message });
//   }
// });

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
