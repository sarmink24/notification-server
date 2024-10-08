// server.js

const express = require("express");
const cors = require("cors");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Allow CORS from localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"], // Add methods if needed
    credentials: true, // Allow cookies if needed
  })
);

app.options("/subscribe", cors());

// Set your VAPID keys here (replace with the keys you generated)
const publicVapidKey =
  "BHR4uIH5k44R0-VkXZsVEv_HG8yz3uliPlb3opWVwuu6OtDKkKKVQM-tDSk6k2wkVN98E4jrd7zBZj7gUYZpJYU";
const privateVapidKey = "D8AER9JaNR4_IUqIWQdJ_yCunSWDVOOeLtSStiEJkRo";

// Configure web-push with your VAPID keys and email
webpush.setVapidDetails(
  "mailto:sarmin.khatun002@gmail.com", // Your contact email
  publicVapidKey,
  privateVapidKey
);

// Middleware to handle JSON request bodies
app.use(bodyParser.json());

// Subscribe Route - this endpoint is called by the client to subscribe to push notifications
app.post("/subscribe", (req, res) => {
  const subscription = req.body;

  // Send 201 status - resource created
  res.status(201).json({});

  // Create the payload for the notification
  const payload = JSON.stringify({
    title: "Push Notification Test",
    body: "This is a test notification from the backend!",
  });

  // Send the notification to the subscribed client
  webpush.sendNotification(subscription, payload).catch((error) => {
    console.error(error.stack);
  });
});

// Serve client (optional - if you want to serve the frontend from the same server)
app.use(express.static(path.join(__dirname, "client")));

// Start the server on port 5000
const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
