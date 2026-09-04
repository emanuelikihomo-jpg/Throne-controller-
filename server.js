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
    status: "online",
    mt5: "disconnected",
    message: "MT5 bridge is not connected yet"
  });
});

app.post("/order", (req, res) => {
  const { type, symbol, lot } = req.body;

  if (!["BUY", "SELL"].includes(type)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order type"
    });
  }

  console.log("ORDER:", {
    type,
    symbol,
    lot
  });

  res.json({
    success: true,
    message: `${type} command received`,
    symbol,
    lot
  });
});

app.post("/close-all", (req, res) => {
  console.log("CLOSE ALL command received");

  res.json({
    success: true,
    message: "CLOSE_ALL command received"
  });
});

app.post("/robot", (req, res) => {
  const { action } = req.body;

  if (!["START", "STOP"].includes(action)) {
    return res.status(400).json({
      success: false,
      message: "Invalid robot action"
    });
  }

  console.log("ROBOT:", action);

  res.json({
    success: true,
    message: `Robot ${action} command received`
  });
});

app.listen(PORT, () => {
  console.log(`Throne Controller running on port ${PORT}`);
});
