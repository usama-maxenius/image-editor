import { BaseURL } from "../../constants";

export async function getSummary(scrapURL: string) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    url: scrapURL,
    vibe: "positive",
    format: "text",
    emojis: false,
    hashtags: ["summary", ""],
    social_media: "twitter",
    char_count: 280,
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${BaseURL}/api/get-summary`, requestOptions);
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
