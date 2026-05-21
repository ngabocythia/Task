const express = require("express");
const router = express.Router();
const StockIn = require("../models/StockIn");

// Get all stock in records
router.get("/", async (req, res) => {
  try {
    const stockIn = await StockIn.find().populate("sparePart");
    res.json(stockIn);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add stock in record
router.post("/add", async (req, res) => {
  try {
    const stock = new StockIn(req.body);
    await stock.save();
    await stock.populate("sparePart");
    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;