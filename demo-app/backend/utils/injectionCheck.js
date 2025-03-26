const axios = require("axios");

async function isInjection(query) {
  try {
    const response = await axios.post("http://127.0.0.1:5000/predict", {
      query: query,
    });

    return response.data.prediction === "injection";
  } catch (error) {
    console.error("❌ Error calling model API:", error.message);
    return false;
  }
}

module.exports = isInjection;
