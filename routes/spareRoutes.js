const express = require("express");
const router = express.Router();
const SparePart = require("../models/SparePart");

router.get("/", async (req, res) => {
  try {
    const spares = await SparePart.find();
    res.json(spares);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    const quantity = Number(req.body.quantity);
    const unitPrice = Number(req.body.unitPrice);
    const spare = new SparePart({
      ...req.body,
      quantity,
      unitPrice,
      totalPrice: quantity * unitPrice
    });
    await spare.save();
    res.status(201).json(spare);
  } catch (err) {
    const status = err.name === "ValidationError" ? 400 : 500;
    const message = err.name === "ValidationError"
      ? Object.values(err.errors).map(error => error.message).join(", ")
      : err.message;
    res.status(status).json({ message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const quantity = Number(req.body.quantity);
    const unitPrice = Number(req.body.unitPrice);
    const updated = await SparePart.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice
      },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Spare part not found" });
    }
    res.json(updated);
  } catch (err) {
    const status = err.name === "ValidationError" ? 400 : 500;
    const message = err.name === "ValidationError"
      ? Object.values(err.errors).map(error => error.message).join(", ")
      : err.message;
    res.status(status).json({ message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await SparePart.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Spare part not found" });
    }
    res.json({ message: "Spare part deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
