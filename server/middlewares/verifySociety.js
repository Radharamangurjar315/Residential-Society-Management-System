const jwt = require("jsonwebtoken");
const User = require("../models/user"); 

const verifySociety = (req, res, next) => {
    const userSocietyId = req.user.societyId; // From JWT after login
    const requestedSocietyId = req.params.societyId || req.body.societyId;

    if (!userSocietyId.equals(requestedSocietyId)) {
        return res.status(403).json({ message: "Access denied to this society's data." });
    }
    next();
};

module.exports = {verifySociety};
