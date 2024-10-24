const express = require("express");

const app = express();
const port = 4007;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Handle POST requests to /webhook
app.post("/webhook", (req, res) => {
    const response = req.body;

    console.log("Body", response)
    
    if (!response) {
        return res.status(400).json({
            status: "error",
            message: "Bad Request: No body found"
        });
    }

    if (response.TransactionStatus === "Successful") {
        res.status(201).json({
            status: "success",
            message: "Webhook notified Successfully",
            data: response
        });
    } else if (response.TransactionStatus === "Failed") {
        res.status(500).json({
            status: "error",
            message: "Transaction failed",
            data: response
        });
    } else if (response.TransactionStatus === "Pending") {
        res.status(202).json({
            status: "pending",
            message: "Transaction is pending",
            data: response
        });
    } else {
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
