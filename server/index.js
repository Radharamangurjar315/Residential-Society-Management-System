const express = require('express');
const dotenv = require("dotenv");
const app = express();
const mongoose = require('mongoose');

const compression = require("compression");
const morgan = require("morgan");

const eventRoutes = require('./routes/eventRoutes');
const pollRoutes = require('./routes/pollRoutes');
const helmet = require("helmet");
const mediaRoutes = require("./routes/mediaRoutes");
const noticeRoutes = require('./routes/noticeRoutes');
dotenv.config();

const port = 5000;
const cors = require('cors');
app.use(cors());

// database connection key fetch
const { MONGOURI } = require('./keys');
require('./models/user');
require('./models/society');
require('./models/user');  // Ensure the User model includes a 'role' field
require('./models/poll');
require('./models/event');
require('./models/notice');
require('./models/media');

const requireAuth = require('./middlewares/requiredLogin');  // Import the updated middleware
const notice = require('./models/notice');


app.use(express.json()); // to parse the incoming request with json payload
app.use(require('./routes/auth'));

app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Compress responses
app.use(morgan("combined")); // Logging

app.use('/api/events', eventRoutes); 
app.use('/api/notices', noticeRoutes); 
app.use('/api/polls', pollRoutes);  
app.use("/api/media", mediaRoutes);

mongoose.connect(MONGOURI);
mongoose.connection.on('connected', () => {
    console.log("Connected to mongoDB successfully");
});

mongoose.connection.on('error', (err) => {
    console.log("Error connecting to mongoDB");
});


app.get('/', (req, res) => {
    res.send("Hello minor project");
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});