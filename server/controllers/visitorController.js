const Visitor = require('../models/visitor');

exports.createVisitor = async (req, res) => {
  try {
    const visitor = new Visitor({
      ...req.body,
      createdBy: req.user._id,
    });
    await visitor.save();
    res.status(201).json(visitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVisitors = async (req, res) => {
  try {
    const { societyId } = req.params;

    // Build query based on role
    let query = { societyId };

    // Restrict residents to only see visitors to their flat
    if (req.user.role === 'resident') {
      query.flatNumber = req.user.flatNumber;
    }

    const visitors = await Visitor.find(query).sort({ createdAt: -1 });
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateVisitorStatus = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markVisitorExit = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, { status: 'exited', exitTime: new Date() }, { new: true });
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
