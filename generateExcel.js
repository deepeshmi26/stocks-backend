const ExcelJS = require("exceljs");

/**
 * Generates an Excel file from the processed stock data with fixed headers and explicit data types.
 * @param {Object} data - The processed stock data.
 * @param {string} filePath - The path to save the Excel file.
 */
async function generateExcel(data, filePath) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Stock Data");

  // Define the headers
  const headers = [
    { header: "Stock Name", key: "stockName", width: 25 },
    { header: "Recommended Flag", key: "recommendedFlag", width: 10 },
    { header: "Target Price Range", key: "targetPriceRange", width: 20 },
    {
      header: "Potential Returns Range",
      key: "potentialReturnsRange",
      width: 15,
    },
    { header: "Average Returns", key: "averageReturns", width: 15 },
    { header: "CMP", key: "cmp", width: 10 },
    {
      header: "Recommended Price Range",
      key: "recommendedPriceRange",
      width: 25,
    },
    {
      header: "Target Price Date Range",
      key: "targetPriceDateRange",
      width: 25,
    },

    { header: "No. of orgs", key: "organizationCount", width: 10 },
    { header: "Organizations", key: "organizations", width: 40 },
  ];

  // Add the headers to the worksheet
  worksheet.columns = headers;

  // Add data rows
  for (const stockName in data) {
    const stock = data[stockName];
    const organizations = stock.organizations
      .map(
        (org) =>
          `${org.name} (Target: ${org.targetPrice}, Returns: ${org.potentialReturns}%)`
      )
      .join("; ");

    worksheet.addRow({
      stockName,
      targetPriceRange:
        stock.targetPriceRange.min === stock.targetPriceRange.max
          ? stock.targetPriceRange.min
          : `${stock.targetPriceRange.min}-${stock.targetPriceRange.max}`,
      potentialReturnsRange:
        stock.potentialReturnsRange.min === stock.potentialReturnsRange.max
          ? stock.potentialReturnsRange.min
          : `${stock.potentialReturnsRange.min}-${stock.potentialReturnsRange.max}`,
      targetPriceDateRange:
        stock.targetPriceDateRange.min === stock.targetPriceDateRange.max
          ? stock.targetPriceDateRange.min
          : `${stock.targetPriceDateRange.min}-${stock.targetPriceDateRange.max}`,
      recommendedPriceRange:
        stock.recommendedPriceRange.min === stock.recommendedPriceRange.max
          ? stock.recommendedPriceRange.min
          : `${stock.recommendedPriceRange.min}-${stock.recommendedPriceRange.max}`,
      organizations,
      recommendedFlag: stock.recommendedFlag,
      cmp: stock.cmp,
      averageReturns: stock.averageReturns,
      organizationCount: stock.organizations.length,
    });
  }

  // Format numeric columns
  worksheet.getColumn("cmp").numFmt = "0.00"; // Format CMP as a number with 2 decimal places
  worksheet.getColumn("averageReturns").numFmt = "0.00"; // Format Average Returns similarly

  // Freeze the first row (header row)
  worksheet.views = [{ state: "frozen", xSplit: 0, ySplit: 1 }];

  // Save the workbook to the specified file path
  await workbook.xlsx.writeFile(filePath);
  console.log(`Excel file generated at ${filePath}`);
}

module.exports = generateExcel;
