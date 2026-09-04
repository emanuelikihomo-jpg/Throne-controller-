// Throne Hub MT5 Controller

const API_URL = "https://throne-controller.onrender.com";

const app = {
  name: "Throne Hub",
  status: "Disconnected",

  async connect() {
    try {
      const response = await fetch(`${API_URL}/status`);
      const data = await response.json();

      this.status = data.mt5;
      console.log("Server connected:", data);

      return data;
    } catch (error) {
      this.status = "Connection failed";
      console.error("Connection error:", error);
    }
  },

  async buy() {
    console.log("BUY request");
    return sendOrder("BUY");
  },

  async sell() {
    console.log("SELL request");
    return sendOrder("SELL");
  },

  async closeAll() {
    console.log("CLOSE ALL request");

    try {
      const response = await fetch(`${API_URL}/close-all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      return await response.json();
    } catch (error) {
      console.error("Close all error:", error);
    }
  }
};

async function sendOrder(type) {
  try {
    const response = await fetch(`${API_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: type
      })
    });

    const data = await response.json();
    console.log("Server response:", data);

    return data;
  } catch (error) {
    console.error("Order error:", error);
  }
}

console.log("Throne Hub connected to backend:", API_URL);
