const mongoose = require('mongoose');
// user schema for the mongodb database for user authentication and registration
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
},
);
mongoose.model("User", userSchema);