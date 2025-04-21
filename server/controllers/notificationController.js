const createNotification = require("../utils/createNotification");

// Inside your event/poll/notice/complaint creation controller
await createNotification({
    message: `${req.user.name} posted a new ${type}`,
    type: "poll",
    societyId: req.user.societyId,
    createdBy: req.user._id
});
