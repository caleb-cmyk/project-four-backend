const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

const verifyDate = (req, res, next) => {
  const { dateStart, dateEnd } = req.body;
  const format = "YYYY-MM-DD";

  if (!dayjs(dateStart, format, true).isValid()) {
    return res.status(400).json({ message: "Invalid start date format." });
  }
  if (!dayjs(dateEnd, format, true).isValid()) {
    return res.status(400).json({ message: "Invalid end date format." });
  }

  if (dayjs(dateEnd).isSameOrBefore(dateStart)) {
    return res
      .status(400)
      .json({ message: "Start date needs to be before end date." });
  }

  if (
    !dayjs(dateStart).isBetween(dayjs().subtract(1,"day"), dayjs().add(1, "year"))
  ) {
    return res
      .status(400)
      .json({ message: "You can only book a year in advance." });
  }

  if (!dayjs(dateEnd).isBetween(dayjs().subtract(1,"day"), dayjs().add(1, "year"))) {
    return res
      .status(400)
      .json({ message: "You can only book a year in advance." });
  }

  next();
};

module.exports = verifyDate;

// https://day.js.org/docs/en/parse/is-valid
