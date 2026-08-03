const context = `Kosala Daneshwara provides software project development services across web,
mobile, database, IoT, and desktop development. Projects include a Personal
Financial Management System (PHP, Oracle, SQLite, PL/SQL), Hotel Management
System (Spring Boot, React, MySQL, microservices), Hostel Management System,
PizzaMania Android app, Landslide Early Warning IoT system, River Trash
Collector Robot, and C# Library Management System. The portfolio also includes
CAAD Gate for adaptive ESP32/Arduino edge intelligence,
the Supun Group Wholesale and Retail ERP with advance payments and Excel bulk
product imports, and an Online Payments Fraud Detection ML project using Python,
SMOTE, scikit-learn, and Random Forest. Answer only from this
portfolio context. Help potential clients understand his services and project fit. Be concise and professional. If unsure, say so.`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "Assistant is not configured" });
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message || message.length > 500) return res.status(400).json({ error: "Message must be 1–500 characters" });
  try {
    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {"Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}`},
      body: JSON.stringify({
        model: "gpt-5.6-sol",
        instructions: `You are Kosala's portfolio assistant. ${context}`,
        input: message,
        max_output_tokens: 220
      })
    });
    const data = await apiResponse.json();
    if (!apiResponse.ok) throw new Error(data?.error?.message || "OpenAI request failed");
    const answer = data.output?.flatMap(item => item.content || []).find(item => item.type === "output_text")?.text;
    return res.status(200).json({ answer: answer || "I couldn't create an answer just now." });
  } catch (error) {
    console.error("Assistant error:", error.message);
    return res.status(500).json({ error: "Assistant temporarily unavailable" });
  }
};
