const portfolio = `Kosala Daneshwara is a software engineering undergraduate
experienced in web, mobile, database, IoT, and desktop development. Projects:
Personal Financial Management System (PHP, Oracle, SQLite, PL/SQL), Hotel
Management System (Spring Boot, React, MySQL, microservices), Hostel Management
System, PizzaMania Android app, Landslide Early Warning IoT system, River Trash
Collector Robot, and C# Library Management System. Answer only questions about
Kosala's portfolio, skills, experience, projects, education, and contact. Keep
answers concise and professional. Say when the portfolio lacks an answer.`;

export default async (request) => {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "Assistant is not configured" }, { status: 503 });
  }
  try {
    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message || message.length > 500) {
      return Response.json({ error: "Message must be 1–500 characters" }, { status: 400 });
    }
    const result = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6-sol",
        instructions: `You are Kosala's portfolio assistant. ${portfolio}`,
        input: message,
        max_output_tokens: 220
      })
    });
    const data = await result.json();
    if (!result.ok) {
      console.error("OpenAI error", result.status, data?.error?.code);
      return Response.json({ error: "Assistant temporarily unavailable" }, { status: 502 });
    }
    const answer = data.output?.flatMap(item => item.content || [])
      .find(item => item.type === "output_text")?.text;
    return Response.json({ answer: answer || "I couldn't create an answer just now." });
  } catch (error) {
    console.error("Portfolio assistant error", error.message);
    return Response.json({ error: "Assistant temporarily unavailable" }, { status: 500 });
  }
};

export const config = { path: "/api/chat" };
