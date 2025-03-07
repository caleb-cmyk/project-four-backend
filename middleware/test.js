const jwt = require('jsonwebtoken');

function verify(req, res, next) {

    const email = req.body.email;
    if (email[0] !== "a") {
      return     res.status(401).json({ err: 'Invalid email.' });
    }


    next();

}

module.exports = verify;
