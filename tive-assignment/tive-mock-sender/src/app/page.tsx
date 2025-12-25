"use client";

import { useState } from "react";
import samples from "@/data/sample-tive-payloads.json";

type SendResult = { status: number; body: string };

export default function Home() {
  const [result, setResult] = useState<SendResult | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_INTEGRATION_URL!;
  const apiKey = process.env.NEXT_PUBLIC_WEBHOOK_API_KEY!;

  async function send(payload: any) {
    setResult(null);
    try {
      const res = await fetch(`${baseUrl}/api/webhook/tive`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      setResult({ status: res.status, body: text });
    } catch (e: any) {
      setResult({ status: 0, body: String(e) });
    }
  }

  const valid = (samples as any).payloads;
  const invalid = (samples as any).invalid_payloads;

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Mock Tive Sender</h1>

      <h2>Valid payloads</h2>
      {valid.map((item: any) => (
        <div key={item.name} style={{ marginBottom: 8 }}>
          <button onClick={() => send(item.payload)}>
            Send: {item.name}
          </button>
          <span style={{ marginLeft: 8, color: "#555" }}>
            {item.description}
          </span>
        </div>
      ))}

      <h2>Invalid payloads</h2>
      {invalid.map((item: any) => (
        <div key={item.name} style={{ marginBottom: 8 }}>
          <button onClick={() => send(item.payload)}>
            Send: {item.name}
          </button>
          <span style={{ marginLeft: 8, color: "#555" }}>
            {item.description}
          </span>
        </div>
      ))}

      <h2>Response</h2>
      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 12,
          minHeight: 120,
          whiteSpace: "pre-wrap",
        }}
      >
        {result
          ? `HTTP ${result.status}\n${result.body}`
          : "Click a button above to send a payload."}
      </pre>
    </main>
  );
}
