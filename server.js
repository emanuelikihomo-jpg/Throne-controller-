const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.THRONE_API_KEY;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// ===============================
// AUTHENTICATION
// ===============================

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

// ===============================
// ROBOTS
// ===============================

let robots = [
  {
    id: 1,
    name: "Gold Master 5",
    symbol: "XAUUSD",
    magicNumber: 10001,
    lot: 0.01,
    status: "STOPPED",
    profit: 0,
    trades: 0
  },
  {
    id: 2,
    name: "Dark Moon",
    symbol: "XAUUSD",
    magicNumber: 10002,
    lot: 0.01,
    status: "STOPPED",
    profit: 0,
    trades: 0
  },
  {
    id: 3,
    name: "Trend Catcher",
    symbol: "XAUUSD",
    magicNumber: 10003,
    lot: 0.01,
    status: "STOPPED",
    profit: 0,
    trades: 0
  }
];

let nextRobotId = 4;

// ===============================
// HEALTH
// ===============================

app.get("/health", (req, res) => {

  res.json({
    status: "online",
    message: "Throne Hub MT5 Controller is running"
  });

});

// ===============================
// STATUS
// ===============================

app.get("/status", authenticate, (req, res) => {

  res.json({

    status: "online",

    mt5: "disconnected",

    message: "MT5 bridge is not connected yet",

    robots: robots.length

  });

});

// ===============================
// GET ROBOTS
// ===============================

app.get("/robots", authenticate, (req, res) => {

  res.json({
    success: true,
    robots
  });

});

// ===============================
// ADD ROBOT
// ===============================

app.post("/robots", authenticate, (req, res) => {

  const {
    name,
    symbol,
    magicNumber,
    lot
  } = req.body;

  if (!name || !symbol || !magicNumber || !lot) {

    return res.status(400).json({
      success: false,
      message:
        "name, symbol, magicNumber and lot are required"
    });

  }

  const existingMagic =
    robots.find(
      robot =>
        Number(robot.magicNumber) ===
        Number(magicNumber)
    );

  if (existingMagic) {

    return res.status(400).json({
      success: false,
      message:
        "Magic Number already exists"
    });

  }

  const newRobot = {

    id: nextRobotId++,

    name: String(name),

    symbol: String(symbol).toUpperCase(),

    magicNumber: Number(magicNumber),

    lot: Number(lot),

    status: "STOPPED",

    profit: 0,

    trades: 0

  };

  robots.push(newRobot);

  console.log(
    "ROBOT ADDED:",
    newRobot
  );

  res.json({

    success: true,

    message:
      `${newRobot.name} added successfully`,

    robot: newRobot

  });

});

// ===============================
// START / STOP ROBOT
// ===============================

app.post("/robots/:id", authenticate, (req, res) => {

  const id = Number(req.params.id);

  const { action } = req.body;

  const robot =
    robots.find(r => r.id === id);

  if (!robot) {

    return res.status(404).json({
      success: false,
      message: "Robot not found"
    });

  }

  if (!["START", "STOP"].includes(action)) {

    return res.status(400).json({
      success: false,
      message: "Invalid robot action"
    });

  }

  robot.status =
    action === "START"
      ? "RUNNING"
      : "STOPPED";

  console.log(
    `ROBOT ${robot.name}: ${action}`
  );

  res.json({

    success: true,

    message:
      `${robot.name} ${action}`,

    robot

  });

});

// ===============================
// DELETE ROBOT
// ===============================

app.delete("/robots/:id", authenticate, (req, res) => {

  const id = Number(req.params.id);

  const index =
    robots.findIndex(
      robot => robot.id === id
    );

  if (index === -1) {

    return res.status(404).json({
      success: false,
      message: "Robot not found"
    });

  }

  const removedRobot =
    robots.splice(index, 1)[0];

  res.json({

    success: true,

    message:
      `${removedRobot.name} deleted`,

    robot: removedRobot

  });

});

// ===============================
// UPDATE ROBOT
// ===============================

app.put("/robots/:id", authenticate, (req, res) => {

  const id = Number(req.params.id);

  const robot =
    robots.find(r => r.id === id);

  if (!robot) {

    return res.status(404).json({
      success: false,
      message: "Robot not found"
    });

  }

  const {
    name,
    symbol,
    magicNumber,
    lot
  } = req.body;

  if (name !== undefined)
    robot.name = String(name);

  if (symbol !== undefined)
    robot.symbol =
      String(symbol).toUpperCase();

  if (magicNumber !== undefined)
    robot.magicNumber =
      Number(magicNumber);

  if (lot !== undefined)
    robot.lot = Number(lot);

  res.json({

    success: true,

    message:
      `${robot.name} updated successfully`,

    robot

  });

});

// ===============================
// BUY / SELL
// ===============================

app.post("/order", authenticate, (req, res) => {

  const {
    type,
    symbol,
    lot
  } = req.body;

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

    message:
      `${type} command received`,

    symbol,

    lot

  });

});

// ===============================
// CLOSE ALL
// ===============================

app.post("/close-all", authenticate, (req, res) => {

  console.log(
    "CLOSE ALL command received"
  );

  res.json({

    success: true,

    message:
      "CLOSE_ALL command received"

  });

});

// ===============================
// LEGACY ROBOT CONTROL
// ===============================

app.post("/robot", authenticate, (req, res) => {

  const { action } = req.body;

  if (!["START", "STOP"].includes(action)) {

    return res.status(400).json({
      success: false,
      message: "Invalid robot action"
    });

  }

  console.log(
    "ROBOT:",
    action
  );

  res.json({

    success: true,

    message:
      `Robot ${action} command received`

  });

});

// ===============================
// SERVER
// ===============================

app.listen(PORT, () => {

  console.log(
    `Throne Controller running on port ${PORT}`
  );

});
