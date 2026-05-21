const mongoose = require("mongoose");

const StockOutSchema = new mongoose.Schema({
  stockOutQuantity: Number,
  stockOutUnitPrice: Number,
  stockOutTotalPrice: Number,
  stockOutDate: Date,
  sparePart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SparePart"
  }
});

module.exports = mongoose.model("StockOut", StockOutSchema);