// models/Notification.js
const notificationSchema = new mongoose.Schema({
    message: String,
    type: String, // 'poll', 'notice', 'event', 'complaint'
    societyId: { type: mongoose.Schema.Types.ObjectId, ref: "Society" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
