const styles = {
  futuristic: "futuristic cinematic technology, electric blue and warm amber lighting, premium glass interfaces, subtle circuit patterns",
  minimal: "minimal premium technology, deep navy background, clean geometric forms, elegant blue and gold accents",
  cyber: "cyberpunk software engineering studio, neon cyan and magenta light, holographic dashboards, cinematic depth",
};

export default async (request) => {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
  if (!process.env.REPLICATE_API_TOKEN) {
    return Response.json({ error: "Image generator is not configured" }, { status: 503 });
  }
  try {
    const body = await request.json();
    const selectedStyle = styles[body?.style] || styles.futuristic;
    const prompt = `A professional 16:9 desktop wallpaper for Kosala Daneshwara, a software engineer. ${selectedStyle}. Include tasteful visual references to React, Java, cloud APIs, databases, IoT dashboards and renewable energy monitoring. Spacious composition, highly polished, no logos, no people, no unreadable text, suitable as a modern developer desktop background.`;
    const response = await fetch("https://api.replicate.com/v1/models/prunaai/p-image/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        Prefer: "wait=30",
      },
      body: JSON.stringify({
        input: {
          prompt,
          aspect_ratio: "16:9",
          seed: Math.floor(Math.random() * 2147483647),
        },
      }),
    });
    const prediction = await response.json();
    if (!response.ok) {
      console.error("Replicate image error", response.status, prediction?.detail);
      return Response.json({ error: "Image generation failed" }, { status: 502 });
    }
    if (prediction.status !== "succeeded" || !prediction.output) {
      return Response.json({ error: "Image generation did not finish in time" }, { status: 504 });
    }
    const image = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
    return Response.json({ image });
  } catch (error) {
    console.error("Image generation error", error.message);
    return Response.json({ error: "Image generator temporarily unavailable" }, { status: 500 });
  }
};

export const config = { path: "/api/generate-image" };
