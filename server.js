const express = require("express");
const cors = require("cors");
const fetchRawData = require("./fetchRawData");
const processStockData = require("./processStockData");
const generateExcel = require("./generateExcel");
const path = require("path");

const app = express();
const PORT = 3001; // Your backend port

// Enable CORS
app.use(cors()); // Allows requests from any origin by default

// Example: Restrict CORS to specific localhost origins (optional)
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:4000"], // Allowed origins
  methods: ["GET", "POST"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type"], // Allowed headers
};
app.use(cors(corsOptions));

// Endpoint to get JSON data
app.get("/get-json", async (req, res) => {
  const { start = 0, limit = 24 } = req.query;

  try {
    const rawData = await fetchRawData(parseInt(start), parseInt(limit));
    const processedData = processStockData(rawData);
    res.json(processedData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch and process stock data." });
  }
});

// Endpoint to download the generated Excel file
app.get("/download-excel", async (req, res) => {
  const { start = 0, limit = 24 } = req.query;

  try {
    const rawData = await fetchRawData(parseInt(start), parseInt(limit));
    const processedData = processStockData(rawData);
    const excelFilePath = path.join(__dirname, "stock_data.xlsx");

    // Generate the Excel file
    await generateExcel(processedData, excelFilePath);

    // Serve the Excel file for download
    res.download(excelFilePath, "stock_data.xlsx", (err) => {
      if (err) {
        console.error("Error sending the file:", err.message);
        res.status(500).send("Failed to download the file.");
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate and download Excel." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
