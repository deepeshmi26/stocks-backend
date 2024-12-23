const axios = require("axios");
// Fetch raw stock data from the Moneycontrol API
async function fetchRawData(start = 0, limit = 24) {
  const url =
    "https://api.moneycontrol.com/mcapi/v1/broker-research/stock-ideas";
  const params = {
    start,
    limit,
    deviceType: "W",
  };

  try {
    const response = await axios.get(url, { params });
    if (
      response.status === 200 &&
      response.data &&
      response.data.success === 1
    ) {
      return response.data.data;
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    throw error;
  }
}

module.exports = fetchRawData;
