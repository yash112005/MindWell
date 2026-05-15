const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Testing API Key:", apiKey);
  
  if (!apiKey) {
    console.error("No API Key found in .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log("Listing models...");
    // Try to list models to see if the key works for general discovery
    // Note: listModels might not be available directly on genAI in some versions, 
    // but we can try to generate content with gemini-pro which is very stable.
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hello");
    const response = await result.response;
    console.log("Gemini-pro Response:", response.text());
    console.log("API Key is VALID");
  } catch (error) {
    console.error("Gemini-pro test FAILED");
    console.error("Error Message:", error.message);
  }
}

testApiKey();
