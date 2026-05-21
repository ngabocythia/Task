const express = require("express");
const router = express.Router();

const StockIn = require("../models/StockIn");
const StockOut = require("../models/StockOut");

// DAILY STOCK STATUS REPORT
router.get("/daily-status", async (req, res) => {
  try {
    const stockIn = await StockIn.find().populate("sparePart");
    const stockOut = await StockOut.find().populate("sparePart");

    let report = {};

    // PROCESS STOCK IN
    stockIn.forEach(item => {
      if (!item.sparePart) return;
      const name = item.sparePart.name;

      if (!report[name]) {
        report[name] = {
          spareName: name,
          totalIn: 0,
          totalOut: 0,
          remaining: 0
        };
      }

      report[name].totalIn += item.stockInQuantity;
    });

    // PROCESS STOCK OUT
    stockOut.forEach(item => {
      if (!item.sparePart) return;
      const name = item.sparePart.name;

      if (!report[name]) {
        report[name] = {
          spareName: name,
          totalIn: 0,
          totalOut: 0,
          remaining: 0
        };
      }

      report[name].totalOut += item.stockOutQuantity;
    });

    // CALCULATE REMAINING
    Object.keys(report).forEach(key => {
      report[key].remaining =
        report[key].totalIn - report[key].totalOut;
    });

    res.json(Object.values(report));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
