// import libraries
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const multer = require("multer");
// Azure SDK packages
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
const msRest = require("@azure/ms-rest-js");

// express
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// multer - image upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// retreive environment variables
const predictionKey = process.env.VISION_PREDICTION_KEY;
const predictionEndpoint = process.env.VISION_PREDICTION_ENDPOINT;
const projectId = process.env.VISION_PROJECT_ID;
const publishName = process.env.VISION_PUBLISH_NAME;

// added this bc I mixed up the .env SEVERAL times
if (!predictionKey || !predictionEndpoint || !projectId || !publishName) {
  console.error("Missing env:", {
    predictionKey: !!predictionKey,
    predictionEndpoint: !!predictionEndpoint,
    projectId: !!projectId,
    publishName: !!publishName,
  });
}

// credentials to Azure
const creds = new msRest.ApiKeyCredentials({
  inHeader: { "Prediction-key": predictionKey },
});
const predictor = new PredictionApi.PredictionAPIClient(
  creds,
  predictionEndpoint
);

// API endpoint for prediction
app.post("/api/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });
    const results = await predictor.classifyImage(
      projectId,
      publishName,
      req.file.buffer
    );
    const predictions = (results.predictions || [])
      .map((p) => ({
        tag: p.tagName,
        probability: Number((p.probability * 100).toFixed(2)),
      }))
      .sort((a, b) => b.probability - a.probability);

    res.json({ predictions, top: predictions[0] ?? null });
  } catch (err) {
    console.error("Error", err.message);
    res.status(500).json({ error: "prediction error", details: err.message });
  }
});

// port
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
