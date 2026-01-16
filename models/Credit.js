const mongoose = require("mongoose");

const creditSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },
  creditType: {
    type: String,
    enum: ["consumer", "mortgage", "car", "business"],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  termMonths: {
    type: Number,
    required: true,
    min: 1
  },
  monthlyPayment: {
    type: Number,
    required: true
  },
  totalPayment: {
    type: Number,
    required: true
  },
  totalInterest: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["active", "closed", "overdue"],
    default: "active"
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  paymentType: {
    type: String,
    enum: ["annuity", "differentiated"],
    default: "annuity"
  }
});

module.exports = mongoose.model("Credit", creditSchema);
