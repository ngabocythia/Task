const mongoose = require("mongoose");

const SparePartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Spare part name is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"]
  },
  unitPrice: {
    type: Number,
    required: [true, "Unit price is required"],
    min: [0, "Unit price cannot be negative"]
  },
  totalPrice: {
    type: Number,
    min: [0, "Total price cannot be negative"],
    default: 0
  }
});

module.exports = mongoose.model("SparePart", SparePartSchema);
