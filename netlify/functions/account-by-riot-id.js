// netlify/functions/account-by-riot-id.js

export async function handler(event) {
  const RIOT_API_KEY = process.env.RIOT_API_KEY;
  const { gameName, tagLine = "NA1" } = event.queryStringParameters || {};

  if (!gameName) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Missing gameName parameter" }),
    };
  }

  try {
    const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      gameName
    )}/${encodeURIComponent(tagLine)}`;

    const res = await fetch(url, {
      headers: {
        "X-Riot-Token": RIOT_API_KEY,
      },
    });

    const data = await res.json();

    return {
      statusCode: res.ok ? 200 : res.status,
      headers: {
        "Access-Control-Allow-Origin": "*", // <- important
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
