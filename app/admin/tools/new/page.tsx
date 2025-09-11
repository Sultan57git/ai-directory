"use client";
import { useState } from "react";

export default function NewManualToolPage() {
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setOut("");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/tools/manual/create", {
      method: "POST",
      headers: { "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_UI_KEY || "" }, // optional
      body: form
    });
    const json = await res.json();
    setLoading(false);
    setOut(JSON.stringify(json, null, 2));
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Add Manual Tool</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Name *</label>
          <input name="name" required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug (optional)</label>
          <input name="slug" className="w-full border rounded p-2" placeholder="auto from name if empty" />
        </div>
        <div>
          <label className="block text-sm font-medium">Website URL</label>
          <input name="website_url" className="w-full border rounded p-2" placeholder="https://example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium">Tagline</label>
          <input name="tagline" className="w-full border rounded p-2" placeholder="Short description" />
        </div>
        <div>
          <label className="block text-sm font-medium">Logo</label>
          <input type="file" name="logo" accept="image/*" className="w-full border rounded p-2" />
        </div>
        <button disabled={loading} className="px-4 py-2 rounded bg-black text-white disabled:opacity-60">
          {loading ? "Saving..." : "Save Tool"}
        </button>
      </form>

      {out && <pre className="bg-gray-100 rounded p-3 text-sm whitespace-pre-wrap">{out}</pre>}
    </main>
  );
}
