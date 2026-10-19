export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    service: "Reviewly AI Hardware Intelligence Engine",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production"
  });
}
