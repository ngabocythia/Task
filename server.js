const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const spareRoutes = require("./routes/spareRoutes");
const stockInRoutes = require("./routes/stockInRoutes");
const stockOutRoutes = require("./routes/stockOutRoutes");
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();


// middleware
app.use(cors());
app.use(express.json());

// connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/SIMS")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
// routes
app.use("/sparepart", spareRoutes);
app.use("/stockin", stockInRoutes);
app.use("/stockout", stockOutRoutes);
app.use("/reports", reportRoutes);
app.use("/users", userRoutes);

// start server
app.listen(5001, () => {
  console.log("Server running on port 5001");
});