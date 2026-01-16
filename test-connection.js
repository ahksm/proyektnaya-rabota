// Скрипт для проверки подключения к MongoDB
const mongoose = require("mongoose");
require("dotenv/config");

console.log("Попытка подключения к MongoDB...");
console.log("Строка подключения:", process.env.ConnectionString);

mongoose.set('strictQuery', false);

mongoose.connect(process.env.ConnectionString)
.then(() => {
  console.log("✓ MongoDB подключена успешно!");
  console.log("База данных готова к работе.");
  process.exit(0);
})
.catch((err) => {
  console.error("✗ Ошибка подключения к MongoDB:");
  console.error(err.message);
  console.log("\nПроверьте:");
  console.log("1. MongoDB запущена (команда: net start MongoDB или sudo systemctl start mongod)");
  console.log("2. Строка подключения в файле .env корректна");
  console.log("3. Порт MongoDB доступен (по умолчанию 27017)");
  process.exit(1);
});
