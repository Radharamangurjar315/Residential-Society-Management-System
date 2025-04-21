// utils/createNotification.js
const Notification = require("../models/notification");

const createNotification = async ({ message, type, societyId, createdBy }) => {
    try {
        const notification = new Notification({
            message,
            type,
            societyId,
            createdBy,
        });
        await notification.save();
    } catch (error) {
        console.error("Notification error:", error);
    }
};

module.exports = createNotification;
