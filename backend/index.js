const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require('cors');

const connectDB = require('./config/db');
const questRoutes = require('./routes/quests');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//  Enable CORS for cookies (IMPORTANT)
app.use(cors({
  origin: "http://localhost:5173", // your Vite frontend
  credentials: true
}));

// Parse JSON
app.use(express.json());

//  Enable cookie parsing (ADD HERE)
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use('/api', questRoutes);

// Connect DB
connectDB();

app.get('/', (req, res) => {
  res.send('Habit quest api running');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});