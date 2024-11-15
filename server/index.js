const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 5000;

const { MONGOURI } = require('./keys');
require('./models/user');


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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});