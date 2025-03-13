import express from "express";

const router = express.Router();


const latestVersion = "1.1.1";

router.get("/latest-version", (req, res) => {
  res.json({ latestVersion });
});

export default router;
