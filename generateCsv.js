const fs = require("fs");
const { parse } = require("json2csv");

/**
 * Generates a CSV file from the processed stock data with a fixed header row.
 * @param {Object} data - The processed stock data.
 * @param {string} filePath - The path to save the CSV file.
 */
function generateCSV(data, filePath) {
  const flattenedData = [];

  for (const stockName in data) {
    const stock = data[stockName];
    const organizations = Array.isArray(stock.organizations)
      ? stock.organizations
          .map(
            (org) =>
              `${org.name} (Target: ${org.targetPrice}, Returns: ${org.potentialReturns}%)`
          )
          .join("; ")
      : stock.organizations;

    flattenedData.push({
      StockName: stockName,
      TargetPriceRange:
        stock.targetPriceRange.min === stock.targetPriceRange.max
          ? stock.targetPriceRange.min
          : `${stock.targetPriceRange.min}-${stock.targetPriceRange.max}`,
      PotentialReturnsRange:
        stock.potentialReturnsRange.min === stock.potentialReturnsRange.max
          ? stock.potentialReturnsRange.min
          : `${stock.potentialReturnsRange.min}-${stock.potentialReturnsRange.max}`,
      TargetPriceDateRange:
        stock.targetPriceDateRange.min === stock.targetPriceDateRange.max
          ? stock.targetPriceDateRange.min
          : `${stock.targetPriceDateRange.min}-${stock.targetPriceDateRange.max}`,
      RecommendedPriceRange:
        stock.recommendedPriceRange.min === stock.recommendedPriceRange.max
          ? stock.recommendedPriceRange.min
          : `${stock.recommendedPriceRange.min}-${stock.recommendedPriceRange.max}`,
      Organizations: organizations,
      RecommendedFlag: stock.recommendedFlag,
      CMP: stock.cmp,
      AverageReturns: stock.averageReturns,
    });
  }

  // Define the fixed header row
  const fields = [
    { label: "Stock Name", value: "StockName" },
    { label: "Target Price Range", value: "TargetPriceRange" },
    { label: "Potential Returns Range", value: "PotentialReturnsRange" },
    { label: "Target Price Date Range", value: "TargetPriceDateRange" },
    { label: "Recommended Price Range", value: "RecommendedPriceRange" },
    { label: "Organizations", value: "Organizations" },
    { label: "Recommended Flag", value: "RecommendedFlag" },
    { label: "CMP", value: "CMP" },
    { label: "Average Returns", value: "AverageReturns" },
  ];

  // Generate the CSV content
  const csv = parse(flattenedData, { fields });
  fs.writeFileSync(filePath, csv);
  console.log(`CSV file generated at ${filePath}`);
}

module.exports = generateCSV;
