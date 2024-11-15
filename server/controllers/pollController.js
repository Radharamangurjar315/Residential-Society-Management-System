const Poll = require('../models/poll');

exports.createPoll = async (req, res) => {
    const { question, options } = req.body;
    const newPoll = new Poll({ question, options, votes: Array(options.length).fill(0), createdBy: req.user.id });
    await newPoll.save();
    res.json(newPoll);
};

exports.getPolls = async (req, res) => {
    const polls = await Poll.find();
    res.json(polls);

};