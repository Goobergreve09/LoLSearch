// src/utils/LoLFetch.js
export async function fetchAccountByRiotId(gameName, tagLine = "NA1") {
  const res = await fetch(
    `http://localhost:5000/api/account?gameName=${encodeURIComponent(
      gameName
    )}&tagLine=${encodeURIComponent(tagLine)}`
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Summoner not found");
  return data;
}
