import { getStore } from "@netlify/blobs";

const VISITOR_ID = /^[a-zA-Z0-9_-]{16,80}$/;
const headers = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

export default async (request) => {
  if (!["GET", "POST"].includes(request.method)) {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  }

  try {
    const store = getStore("portfolio-profile-views");

    if (request.method === "POST") {
      const { visitorId = "" } = await request.json();
      if (!VISITOR_ID.test(visitorId)) {
        return new Response(
          JSON.stringify({ error: "Invalid visitor identifier" }),
          { status: 400, headers },
        );
      }
      const day = new Date().toISOString().slice(0, 10);
      await store.set(`views/${day}/${visitorId}`, "1");
    }

    const { blobs } = await store.list({ prefix: "views/" });
    return new Response(JSON.stringify({ views: blobs.length }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Profile view counter error:", error);
    return new Response(
      JSON.stringify({ error: "View counter temporarily unavailable" }),
      { status: 500, headers },
    );
  }
};

export const config = { path: "/api/views" };
