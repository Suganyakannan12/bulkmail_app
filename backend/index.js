require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Root route for health check
app.get("/", (req, res) => {
  res.send("Bulk Email API is running!");
});

// Bulk Email Endpoint
app.post("/send-bulk-email", async (req, res) => {
  try {
    const { emailList, subject, text } = req.body;

    if (!Array.isArray(emailList) || emailList.length === 0 || !subject || !text) {
      return res.status(400).json({
        status: "Failed",
        message: "Please provide 'emailList' array, 'subject', and 'text'.",
      });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        status: "Failed",
        message: "Server configuration error: EMAIL_USER or EMAIL_PASS missing on Vercel.",
      });
    }

    // Transporter created on-demand inside endpoint
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailPromises = emailList.map((recipient) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: subject,
        text: text,
      };
      return transporter.sendMail(mailOptions).then(() => recipient);
    });

    const outcomes = await Promise.allSettled(emailPromises);

    const results = {
      successful: [],
      failed: [],
    };

    outcomes.forEach((outcome, index) => {
      if (outcome.status === "fulfilled") {
        results.successful.push(outcome.value);
      } else {
        results.failed.push({
          recipient: emailList[index],
          error: outcome.reason?.message || "Failed to send",
        });
      }
    });

    return res.status(200).json({
      status: "Completed",
      totalSent: results.successful.length,
      totalFailed: results.failed.length,
      details: results,
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      status: "Failed",
      message: error.message || "Internal server error",
    });
  }
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

module.exports = app;