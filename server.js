const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Throne Hub MT5 Controller is running"
  });
});

app.get("/status", (req, res) => {
  res.json({
    mt5: "disconnected",
    message: "MT5 connection will be added next"
  });
});

app.listen(PORT, () => {
  console.log(`Throne Hub server running on port ${PORT}`);
});
