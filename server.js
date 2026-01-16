const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
require("dotenv/config");

const app = express();

// Настройка Mongoose
mongoose.set('strictQuery', false);

// Подключение к MongoDB
mongoose.connect(process.env.ConnectionString)
.then(() => console.log("MongoDB подключена успешно"))
.catch((err) => console.error("Ошибка подключения к MongoDB:", err));

// Настройка middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// Подключение маршрутов
const clientRoutes = require("./routes/clients");
const creditRoutes = require("./routes/credits");
const calculatorRoutes = require("./routes/calculator");

app.use("/clients", clientRoutes);
app.use("/credits", creditRoutes);
app.use("/calculator", calculatorRoutes);

// Главная страница
app.get("/", (req, res) => {
  res.render("index");
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
