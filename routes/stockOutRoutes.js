const express = require("express");
const router = express.Router();
const StockOut = require("../models/StockOut");

// CREATE
router.post("/add", async (req, res) => {
  try {
    const data = new StockOut(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ
router.get("/", async (req, res) => {
  try {
    const data = await StockOut.find().populate("sparePart");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await StockOut.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Stock out record not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await StockOut.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Stock out record not found" });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
