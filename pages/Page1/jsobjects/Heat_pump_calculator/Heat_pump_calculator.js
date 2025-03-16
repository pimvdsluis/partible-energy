export default {
  // Functie om de terugverdientijd te berekenen
  calculatePaybackTime: function (investmentCost, subsidies, gasUsage, boilerEfficiency, gasEnergy, scopValue, electricityPrice, gasPrice) {
    // Zet invoer om naar numerieke waarden en voorkom NaN
    investmentCost = parseFloat(investmentCost) || 0;
    subsidies = parseFloat(subsidies) || 0;
    gasUsage = parseFloat(gasUsage) || 0;
    boilerEfficiency = parseFloat(boilerEfficiency) / 100 || 0;
    gasEnergy = parseFloat(gasEnergy) || 0;
    scopValue = parseFloat(scopValue) || 1;
    electricityPrice = parseFloat(electricityPrice) || 0;
    gasPrice = parseFloat(gasPrice) || 0;

    // Bereken nettokosten
    const netInvestment = investmentCost - subsidies;

    // Bereken huidige gaskosten per jaar
    const currentGasCosts = gasUsage * gasPrice;

    // Bereken effectieve energie uit gas
    const effectiveGasEnergy = gasUsage * gasEnergy * boilerEfficiency;

    // Bereken stroomverbruik warmtepomp
    const heatpumpConsumption = effectiveGasEnergy / scopValue;

    // Bereken stroomkosten warmtepomp per jaar
    const heatpumpCosts = heatpumpConsumption * electricityPrice;

    // Bereken jaarlijkse besparing
    const yearlySavings = currentGasCosts - heatpumpCosts;

    // Bereken terugverdientijd in jaren
    let paybackTime = yearlySavings > 0 ? netInvestment / yearlySavings : Infinity;

    // Update resultaten in Appsmith store
    storeValue("netInvestment", `€${netInvestment.toFixed(2)}`);
    storeValue("currentGasCosts", `€${currentGasCosts.toFixed(2)} per jaar`);
    storeValue("heatpumpConsumption", `${heatpumpConsumption.toFixed(2)} kWh per jaar`);
    storeValue("heatpumpCosts", `€${heatpumpCosts.toFixed(2)} per jaar`);
    storeValue("yearlySavings", `€${yearlySavings.toFixed(2)} per jaar`);

    let paybackTimeFormatted = paybackTime === Infinity ? "Geen besparing" : `${paybackTime.toFixed(1)} jaar`;
    storeValue("paybackTime", paybackTimeFormatted);

    // Bereken CO2-besparing
    const gasCO2 = gasUsage * 1.8; // kg CO2 per jaar
    const electricityCO2 = heatpumpConsumption * 0.4; // kg CO2 per jaar
    const co2Savings = gasCO2 - electricityCO2;
    storeValue("co2Savings", `${co2Savings.toFixed(0)} kg CO2 per jaar`);

    return {
      netInvestment,
      currentGasCosts,
      heatpumpConsumption,
      heatpumpCosts,
      yearlySavings,
      paybackTime,
      co2Savings
    };
  },

  // Functie voor het instellen van standaardwaarden
  initializeDefaultValues: function () {
    // Sla standaardwaarden op in Appsmith store
    storeValue("investmentCost", "15000");
    storeValue("subsidies", "2500");
    storeValue("gasUsage", "1500");
    storeValue("boilerEfficiency", "80");
    storeValue("gasEnergy", "8.8");
    storeValue("scopValue", "4.0");
    storeValue("electricityPrice", "0.40");
    storeValue("gasPrice", "1.50");

    // Voer een initiële berekening uit met standaardwaarden
    return this.calculatePaybackTime("15000", "2500", "1500", "80", "8.8", "4.0", "0.40", "1.50");
  }
};
