const BASE_FUNCTION_URL = "https://lolsearchdata.netlify.app/.netlify/functions";

// Fetch account info
export async function fetchAccountByRiotId(gameName, tagLine = "NA1") {
  const res = await fetch(
    `${BASE_FUNCTION_URL}/account-by-riot-id?gameName=${encodeURIComponent(
      gameName
    )}&tagLine=${encodeURIComponent(tagLine)}`
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Account not found");
  return data;
}

// Fetch last N match stats by PUUID
export async function fetchPlayerMatches(puuid, count = 5) {
  const res = await fetch(
    `${BASE_FUNCTION_URL}/player-stats?puuid=${encodeURIComponent(puuid)}&count=${count}`
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Matches not found");
  return data;
}
