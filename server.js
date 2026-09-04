const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// API security
const API_KEY = process.env.THRONE_API_KEY;

app.use(cors());
app.use(express.json());

// Health check — public
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Throne Hub MT5 Controller is running"
  });
});

// API key middleware
function authenticate(req, res, next) {
  const key = req.headers["x-api-key"];

  if (!API_KEY) {
    return res.status(500).json({
      success: false,
      message: "API key is not configured"
    });
  }

  if (key !== API_KEY) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  next();
}

// MT5 status
app.get("/status", authenticate, (req, res) => {
  res.json({
    status: "online",
    mt5: "disconnected",
    message: "MT5 bridge is not connected yet"
  });
});

// Send BUY / SELL order
app.post("/order", authenticate, (req, res) => {
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

// Close all trades
app.post("/close-all", authenticate, (req, res) => {
  console.log("CLOSE ALL command received");

  res.json({
    success: true,
    message: "CLOSE_ALL command received"
  });
});

// Start / Stop robot
app.post("/robot", authenticate, (req, res) => {
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
