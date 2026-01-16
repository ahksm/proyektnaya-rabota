const express = require("express");
const router = express.Router();

// Показать калькулятор
router.get("/", (req, res) => {
  res.render("calculator/index");
});

// Рассчитать кредит
router.post("/calculate", (req, res) => {
  const amount = parseFloat(req.body.amount);
  const interestRate = parseFloat(req.body.interestRate);
  const termMonths = parseInt(req.body.termMonths);
  const paymentType = req.body.paymentType;

  const monthlyRate = interestRate / 100 / 12;
  let schedule = [];
  let remainingBalance = amount;
  let totalPayment = 0;
  let totalInterest = 0;

  for (let i = 1; i <= termMonths; i++) {
    let principalAmount, interestAmount, monthlyPayment;

    if (paymentType === "annuity") {
      if (monthlyRate === 0) {
        monthlyPayment = amount / termMonths;
      } else {
        monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
                        (Math.pow(1 + monthlyRate, termMonths) - 1);
      }
      interestAmount = remainingBalance * monthlyRate;
      principalAmount = monthlyPayment - interestAmount;
    } else {
      principalAmount = amount / termMonths;
      interestAmount = remainingBalance * monthlyRate;
      monthlyPayment = principalAmount + interestAmount;
    }

    remainingBalance -= principalAmount;
    totalPayment += monthlyPayment;
    totalInterest += interestAmount;

    schedule.push({
      month: i,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      principalAmount: Math.round(principalAmount * 100) / 100,
      interestAmount: Math.round(interestAmount * 100) / 100,
      remainingBalance: Math.max(0, Math.round(remainingBalance * 100) / 100)
    });
  }

  const result = {
    amount: amount,
    interestRate: interestRate,
    termMonths: termMonths,
    paymentType: paymentType,
    monthlyPayment: Math.round(schedule[0].monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    schedule: schedule
  };

  res.render("calculator/result", { result });
});

module.exports = router;
