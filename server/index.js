

const cors = require("cors");
const express = require('express');
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json()); // to parse the incoming request with json payload


const mongoose = require('mongoose');

const compression = require("compression");
const morgan = require("morgan");

const eventRoutes = require('./routes/eventRoutes');
const pollRoutes = require('./routes/pollRoutes');
const helmet = require("helmet");
const mediaRoutes = require("./routes/mediaRoutes");
const noticeRoutes = require('./routes/noticeRoutes');
const complaintRoutes = require('./routes/complaintRoutes'); // Import the complaint routes
const contactRoutes = require('./routes/contactRoutes'); // Import the contact routes
const visitorRoutes = require('./routes/visitorRoutes'); // Import the visitor routes
const maintenanceRoutes = require('./routes/maintenanceRoutes'); // Import the maintenance routes



const port = 5000;


const allowedOrigins = [
    "http://localhost:5173",  // for local development
    "https://societyy-rsms-rg.vercel.app",
    "https://residential-society-management-systemfrontend-4hkhc63lz.vercel.app",
    "https://residential-society-managem-git-f5dea8-ramans-projects-f78a9e3f.vercel.app"
  ];

  app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }));





// database connection key fetch
const { MONGOURI } = process.env;
require('./models/user');
require('./models/society');
require('./models/user');  // Ensure the User model includes a 'role' field
require('./models/poll');
require('./models/event');
require('./models/notice');
require('./models/media');
require('./models/complaint');  // Import the Complaint model
require('./models/contact');  // Import the Contact model
require('./models/visitor');  // Import the Visitor model

const requireAuth = require('./middlewares/requiredLogin');  // Import the updated middleware
const notice = require('./models/notice');



app.use(require('./routes/auth'));

app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Compress responses
app.use(morgan("combined")); // Logging

app.use('/api/events', eventRoutes); 
app.use('/api/notices', noticeRoutes); 
app.use('/api/polls', pollRoutes);  
app.use("/api/media", mediaRoutes);
app.use('/api/contacts', contactRoutes); // Use the contact routes
app.use('/api/visitors', visitorRoutes);
app.use('/api/maintenance', maintenanceRoutes);

app.use((req, res, next) => {
    console.log(`🔹 Incoming ${req.method} request to ${req.url}`);
    next();
  });
app.use('/api/complaints', complaintRoutes); // Use the complaint routes

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
app.get("/api/test", (req, res) => {
    res.json({
      message: "CORS test successful",
      origin: req.headers.origin,
    });
  });
  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});