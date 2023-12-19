require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/user");
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
