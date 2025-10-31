const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: [
    "https://healthmate-frontend-gules.vercel.app",
    "http://localhost:5173",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Connect Database
connectDB();

// Init Middleware

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/vitals", require("./routes/vitals"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
