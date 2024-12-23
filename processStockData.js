/**
 * Processes the stock ideas data and organizes it as per the requirements.
 * @param {Array} data - The array of stock data from the API.
 * @returns {Object} - The processed stock data.
 */
function processStockData(data) {
  const stockDetails = {};

  data.forEach((stock) => {
    const stockName = stock.stkname;
    const organization = stock.organization;
    const isExisting =
      stockDetails?.[stockName] &&
      stockDetails?.[stockName]?.organizations.find(
        (org) => org.name == organization
      );
    if (isExisting) return;
    const targetPrice = parseFloat(stock.target_price);
    const potentialReturns = parseFloat(stock.potential_returns_per);
    const targetPriceDate = stock.target_price_date;
    const recommendedPrice = parseFloat(stock.recommended_price);
    const currentMarketPrice = parseFloat(stock.cmp);
    const recommendedFlag = stock.recommend_flag;

    if (!stockDetails[stockName]) {
      const existingStockDetails = stockDetails[stockName];
      stockDetails[stockName] = {
        targetPriceRange: { min: targetPrice, max: targetPrice },
        potentialReturnsRange: { min: potentialReturns, max: potentialReturns },
        targetPriceDateRange: { min: targetPriceDate, max: targetPriceDate },
        recommendedPriceRange: { min: recommendedPrice, max: recommendedPrice },
        organizations: [],
        cmp: currentMarketPrice,
        recommendedFlag: recommendedFlag,
        averageReturns: potentialReturns,
      };
    } else {
      const details = stockDetails[stockName];

      // Update target price range
      details.targetPriceRange.min = Math.min(
        details.targetPriceRange.min,
        targetPrice
      );
      details.targetPriceRange.max = Math.max(
        details.targetPriceRange.max,
        targetPrice
      );

      // Update potential returns range
      details.potentialReturnsRange.min = Math.min(
        details.potentialReturnsRange.min,
        potentialReturns
      );
      details.potentialReturnsRange.max = Math.max(
        details.potentialReturnsRange.max,
        potentialReturns
      );

      // Update target price date range
      details.targetPriceDateRange.min =
        details.targetPriceDateRange.min < targetPriceDate
          ? details.targetPriceDateRange.min
          : targetPriceDate;
      details.targetPriceDateRange.max =
        details.targetPriceDateRange.max > targetPriceDate
          ? details.targetPriceDateRange.max
          : targetPriceDate;

      // Update recommended price range
      details.recommendedPriceRange.min = Math.min(
        details.recommendedPriceRange.min,
        recommendedPrice
      );
      details.recommendedPriceRange.max = Math.max(
        details.recommendedPriceRange.max,
        recommendedPrice
      );
      details.averageReturns =
        (details.potentialReturnsRange.max +
          details.potentialReturnsRange.min) /
        2;
      details.recommendedFlag =
        details.recommendedFlag == recommendedFlag ? recommendedFlag : "BOTH";
    }

    // Add organization details
    stockDetails[stockName].organizations.push({
      name: organization,
      targetPrice,
      potentialReturns,
    });

    stockDetails[stockName].cmp = currentMarketPrice;
  });

  return stockDetails;
}

module.exports = processStockData;
