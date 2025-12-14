export async function handler(event, context) {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API_KEY is missing");
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "API_KEY is not defined in the environment variables",
      }),
    };
  }

  try {
    const response = await fetch("https://api.uptimerobot.com/v2/getMonitors", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        api_key: apiKey,
        format: "json",
        response_times: "1",
      }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching uptime data" }),
    };
  }
}
