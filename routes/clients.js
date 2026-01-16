const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

// Показать всех клиентов
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.render("clients/index", { clients });
  } catch (err) {
    res.status(500).send("Ошибка при получении клиентов");
  }
});

// Форма добавления нового клиента
router.get("/new", (req, res) => {
  res.render("clients/new");
});

// Создать нового клиента
router.post("/", async (req, res) => {
  try {
    const client = new Client({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      middleName: req.body.middleName,
      passportSeries: req.body.passportSeries,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      address: req.body.address,
      monthlyIncome: req.body.monthlyIncome,
      employmentStatus: req.body.employmentStatus
    });
    await client.save();
    res.redirect("/clients");
  } catch (err) {
    res.status(400).send("Ошибка при создании клиента");
  }
});

// Показать конкретного клиента
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    const Credit = require("../models/Credit");
    const credits = await Credit.find({ client: req.params.id });
    res.render("clients/show", { client, credits });
  } catch (err) {
    res.status(500).send("Ошибка при получении клиента");
  }
});

// Форма редактирования клиента
router.get("/:id/edit", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    res.render("clients/edit", { client });
  } catch (err) {
    res.status(500).send("Ошибка при получении клиента");
  }
});

// Обновить клиента
router.put("/:id", async (req, res) => {
  try {
    await Client.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      middleName: req.body.middleName,
      passportSeries: req.body.passportSeries,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      address: req.body.address,
      monthlyIncome: req.body.monthlyIncome,
      employmentStatus: req.body.employmentStatus
    });
    res.redirect("/clients/" + req.params.id);
  } catch (err) {
    res.status(400).send("Ошибка при обновлении клиента");
  }
});

// Удалить клиента
router.delete("/:id", async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.redirect("/clients");
  } catch (err) {
    res.status(500).send("Ошибка при удалении клиента");
  }
});

module.exports = router;
