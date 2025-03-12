const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

const verifyDate = (req, res, next) => {
    const {dateStart, dateEnd} = req.body;
    const format = "YYYY-MM-DD";
    const datePlusTwoYears = (date) => {
    }

    if (!dayjs(dateStart, format, true).isValid()) {
      return res.status(400).json({ error: "Invalid start date format." });
    }
    if (!dayjs(dateEnd, format, true).isValid()) {
      return res.status(400).json({ error: "Invalid end date format." });
    }

    if (dayjs(dateEnd).isSameOrBefore(dateStart)) {
      return res.status(400).json({ error: "Start date needs to be before end date." });
    }

    // dayjs('2010-10-20').isBetween('2010-10-19', dayjs('2010-10-25')) 
    if (dayjs(dateStart).isBetween(dateStart + dateStartPlusTwoYears)) {
      return res.status(400).json({ error: "Start date needs to be before end date." });
    }
      
      next();
    };
    
    module.exports = verifyDate;
    
    // 1. date within 2 years +/- current
    // 3. date not booked yet
// https://day.js.org/docs/en/parse/is-valid