const express = require('express');
const app = express();
const mongoose = require('mongoose');

const port = 5000;
const cors = require('cors');
app.use(cors());

// database connection key fetch
const { MONGOURI } = require('./keys');
require('./models/user');

require('./models/user');  // Ensure the User model includes a 'role' field
const requireAuth = require('./middlewares/requiredLogin');  // Import the updated middleware

app.use(express.json()); // to parse the incoming request with json payload
app.use(require('./routes/auth'));


mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log("Connected to mongoDB successfully");
});

mongoose.connection.on('error', (err) => {
    console.log("Error connecting to mongoDB");
});


app.get('/', (req, res) => {
    res.send("Hello minor project");
});

// Example of role-based routes
app.get('/admin-dashboard', requireAuth('admin'), (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard!' });
});

app.get('/resident-dashboard', requireAuth('resident'), (req, res) => {
    res.json({ message: 'Welcome to the resident dashboard!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

