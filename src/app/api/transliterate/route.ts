import { NextRequest, NextResponse } from "next/server";

const GOOGLE_TRANSLITERATE_URL = "https://www.google.com/inputtools/request";
const MAX_TEXT_LENGTH = 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text : "";

    if (!text.trim()) {
      return NextResponse.json({ error: "No text provided." }, { status: 400 });
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Text is too long. Maximum ${MAX_TEXT_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const url = `${GOOGLE_TRANSLITERATE_URL}?text=${encodeURIComponent(
      text
    )}&itc=hi-t-i0-und&num=5`;

    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) {
      return NextResponse.json(
        { error: "Transliteration service unavailable. Please try again later." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const candidates =
      data?.[0] === "SUCCESS" &&
      Array.isArray(data?.[1]) &&
      data[1].length > 0 &&
      Array.isArray(data[1][0]?.[1])
        ? data[1][0][1]
        : [];

    if (!candidates.length) {
      return NextResponse.json(
        { error: "No transliteration returned. Please try again." },
        { status: 422 }
      );
    }

    return NextResponse.json({ transliterated: candidates[0], candidates, input: text });
  } catch (err) {
    console.error("Transliteration error:", err);
    return NextResponse.json(
      { error: "Failed to transliterate. Please try again." },
      { status: 500 }
    );
  }
}