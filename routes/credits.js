const express = require("express");
const router = express.Router();
const Credit = require("../models/Credit");
const Client = require("../models/Client");
const Payment = require("../models/Payment");

// Вспомогательная функция расчета аннуитетного платежа
function calculateAnnuityPayment(amount, rate, months) {
  const monthlyRate = rate / 100 / 12;
  if (monthlyRate === 0) return amount / months;
  const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
                  (Math.pow(1 + monthlyRate, months) - 1);
  return payment;
}

// Показать все кредиты
router.get("/", async (req, res) => {
  try {
    const credits = await Credit.find().populate("client").sort({ startDate: -1 });
    res.render("credits/index", { credits });
  } catch (err) {
    res.status(500).send("Ошибка при получении кредитов");
  }
});

// Форма добавления нового кредита
router.get("/new", async (req, res) => {
  try {
    const clients = await Client.find().sort({ lastName: 1 });
    res.render("credits/new", { clients });
  } catch (err) {
    res.status(500).send("Ошибка при получении клиентов");
  }
});

// Создать новый кредит
router.post("/", async (req, res) => {
  try {
    const amount = parseFloat(req.body.amount);
    const interestRate = parseFloat(req.body.interestRate);
    const termMonths = parseInt(req.body.termMonths);
    const paymentType = req.body.paymentType;

    let monthlyPayment, totalPayment, totalInterest;

    if (paymentType === "annuity") {
      monthlyPayment = calculateAnnuityPayment(amount, interestRate, termMonths);
      totalPayment = monthlyPayment * termMonths;
      totalInterest = totalPayment - amount;
    } else {
      // Дифференцированный платеж (упрощенный расчет)
      const principalPayment = amount / termMonths;
      const firstMonthInterest = (amount * interestRate / 100) / 12;
      monthlyPayment = principalPayment + firstMonthInterest;
      totalInterest = (amount * interestRate / 100 / 12) * (termMonths + 1) / 2 * termMonths;
      totalPayment = amount + totalInterest;
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + termMonths);

    const credit = new Credit({
      client: req.body.client,
      creditType: req.body.creditType,
      amount: amount,
      interestRate: interestRate,
      termMonths: termMonths,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      startDate: startDate,
      endDate: endDate,
      paymentType: paymentType
    });

    await credit.save();

    // Создание графика платежей
    await createPaymentSchedule(credit._id, amount, interestRate, termMonths, paymentType);

    res.redirect("/credits");
  } catch (err) {
    console.error(err);
    res.status(400).send("Ошибка при создании кредита");
  }
});

// Функция создания графика платежей
async function createPaymentSchedule(creditId, amount, rate, months, type) {
  const monthlyRate = rate / 100 / 12;
  let remainingBalance = amount;
  const startDate = new Date();

  for (let i = 1; i <= months; i++) {
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + i);

    let principalAmount, interestAmount, totalAmount;

    if (type === "annuity") {
      totalAmount = calculateAnnuityPayment(amount, rate, months);
      interestAmount = remainingBalance * monthlyRate;
      principalAmount = totalAmount - interestAmount;
    } else {
      principalAmount = amount / months;
      interestAmount = remainingBalance * monthlyRate;
      totalAmount = principalAmount + interestAmount;
    }

    remainingBalance -= principalAmount;

    const payment = new Payment({
      credit: creditId,
      paymentNumber: i,
      paymentDate: paymentDate,
      principalAmount: Math.round(principalAmount * 100) / 100,
      interestAmount: Math.round(interestAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      remainingBalance: Math.max(0, Math.round(remainingBalance * 100) / 100)
    });

    await payment.save();
  }
}

// Показать конкретный кредит
router.get("/:id", async (req, res) => {
  try {
    const credit = await Credit.findById(req.params.id).populate("client");
    const payments = await Payment.find({ credit: req.params.id }).sort({ paymentNumber: 1 });
    res.render("credits/show", { credit, payments });
  } catch (err) {
    res.status(500).send("Ошибка при получении кредита");
  }
});

// Удалить кредит
router.delete("/:id", async (req, res) => {
  try {
    await Payment.deleteMany({ credit: req.params.id });
    await Credit.findByIdAndDelete(req.params.id);
    res.redirect("/credits");
  } catch (err) {
    res.status(500).send("Ошибка при удалении кредита");
  }
});

module.exports = router;
