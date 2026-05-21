const mongoose = require("mongoose");

const StockInSchema = new mongoose.Schema({
  stockInQuantity: Number,
  stockInDate: Date,
  sparePart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SparePart"
  }
});

module.exports = mongoose.model("StockIn", StockInSchema);