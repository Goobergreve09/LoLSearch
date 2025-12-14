import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow all origins for local testing
app.use(cors());

// Route to fetch Riot account by Riot ID
app.get("/api/account", async (req, res) => {
  const { gameName, tagLine = "NA1" } = req.query;

  if (!gameName) {
    return res.status(400).json({ error: "Missing gameName parameter" });
  }

  try {
    const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      gameName
    )}/${encodeURIComponent(tagLine)}`;

    const response = await fetch(url, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching Riot API:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

