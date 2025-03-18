const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 4007;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const logToFile = (logData) => {
    const logFilePath = path.join(__dirname, "webhook_logs.txt");
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - ${JSON.stringify(logData)}\n`;

    //Append the log entry to the file
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error("Failed to write to log File:", err);
        }
    });
}

// Handle POST requests to /webhook
app.post("/webhook", (req, res) => {
    const response = req.body;

    console.log("Received Webhook Headers:", req.headers);
    console.log("Received Webhook Body:", req.body);

    //Log Response body
    logToFile(response)

    if (!response) {
        return res.status(400).json({
            status: "error",
            message: "Bad Request: No body found"
        });
    }

    if (response.message === "Successful") {
        res.status(201).json({
            status: "success",
            message: "Webhook Notification Successful",
            data: response
        });
    } else if (response.message === "Failed") {
        res.status(500).json({
            status: "error",
            message: "Transaction failed",
            data: response
        });
    } else if (response.message === "Pending") {
        res.status(202).json({
            status: "pending",
            message: "Transaction is pending",
            data: response
        });
    } else if (response.Payload != null) {
        res.status(201).json({
            status: "success",
            message: "Webhook Notification Successful",
            data: response
        });
    }else {
        res.status(404).json({
            status: "error",
            message: "Transaction status not recognized"
        });
    }
});

app.get("/webhook", (req, res) => {
    res.send("My webhook")
})

app.get("/", (req, res) => {
    res.send("Welcome to my webhook")
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})

// "https://webhook-test-sigma.vercel.app/webhook"
