// src/utils/LoLFetch.js
export async function fetchAccountByRiotId(gameName, tagLine = "NA1") {
  const FUNCTION_URL = "https://lolsearchdata.netlify.app/.netlify/functions/account-by-riot-id";

  const url = `${FUNCTION_URL}?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`;

  const res = await fetch(url);

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Account not found");
  return data;
}

