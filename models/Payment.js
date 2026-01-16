const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  credit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Credit",
    required: true
  },
  paymentNumber: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  },
  principalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  interestAmount: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  remainingBalance: {
    type: Number,
    required: true,
    min: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  actualPaymentDate: {
    type: Date
  }
});

module.exports = mongoose.model("Payment", paymentSchema);
