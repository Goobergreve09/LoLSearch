// netlify/functions/player-stats.js
export async function handler(event) {
  const RIOT_API_KEY = process.env.RIOT_API_KEY;
  const { puuid, count = 5 } = event.queryStringParameters || {};

  if (!puuid) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Missing puuid parameter" }),
    };
  }

  try {
    // Get recent match IDs
    const idsRes = await fetch(
      `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`,
      { headers: { "X-Riot-Token": RIOT_API_KEY } }
    );

    const matchIds = await idsRes.json();

    // Fetch match details for each match
    const matches = await Promise.all(
      matchIds.map(async (id) => {
        const matchRes = await fetch(
          `https://americas.api.riotgames.com/lol/match/v5/matches/${id}`,
          { headers: { "X-Riot-Token": RIOT_API_KEY } }
        );
        const matchData = await matchRes.json();
        // Extract stats for this player
        const participant = matchData.info.participants.find(
          (p) => p.puuid === puuid
        );
        return {
          matchId: id,
          champion: participant.championName,
          kills: participant.kills,
          deaths: participant.deaths,
          assists: participant.assists,
          win: participant.win,
        };
      })
    );

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(matches),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
