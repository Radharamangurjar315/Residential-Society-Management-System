// GET /api/notifications/:societyId
router.get("/api/notifications/:societyId", requireLogin, async (req, res) => {
    try {
        const notifications = await Notification.find({ societyId: req.params.societyId })
            .populate("createdBy", "name email role")
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.error("Fetch notifications error:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
});
