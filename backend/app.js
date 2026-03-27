const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = YAML.load('./docs/swagger.yaml');

const authRoutes = require("./routes/authRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");
const medicalRoutes = require("./routes/medicalRoutes");
const express = require("express");
const cors = require("cors");
const pool = require("./db/database");

const animalsRoutes = require("./routes/animalsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json({
    message: "Animal Sanctuary API running",
    time: result.rows[0]
  });
});

app.use("/api/v1", animalsRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", medicalRoutes);
app.use("/api/v1", adoptionRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;