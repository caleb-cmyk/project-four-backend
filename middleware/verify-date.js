const dayjs = require("dayjs");

const verifyDate = (req, res, next) => {
    const {dateStart, dateEnd} = req.body;
    const format = "YYYY-MM-DD";


    if (!dayjs(dateStart, format, true).isValid()) {
      return res.status(400).json({ error: "Invalid format" });
    }
  
    if (!dayjs(dateEnd, format, true).isValid()) {
      return res.status(400).json({ error: "Invalid format" });
    }


    next();
};

module.exports = verifyDate;

// https://day.js.org/docs/en/parse/is-valid