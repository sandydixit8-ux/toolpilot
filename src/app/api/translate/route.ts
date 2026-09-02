import { NextRequest, NextResponse } from "next/server";

const MAX_TEXT_LENGTH = 5000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text : "";
    const sourceLang = typeof body?.sourceLang === "string" ? body.sourceLang : "en";
    const targetLang = typeof body?.targetLang === "string" ? body.targetLang : "hi";

    if (!text.trim()) {
      return NextResponse.json({ error: "No text provided." }, { status: 400 });
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Text is too long. Maximum ${MAX_TEXT_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const langPair = `${sourceLang}|${targetLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${encodeURIComponent(langPair)}`;

    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) {
      return NextResponse.json(
        { error: "Translation service unavailable. Please try again later." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const translated =
      data?.responseData?.translatedText ||
      (Array.isArray(data?.matches) && data.matches.length > 0
        ? data.matches[0]?.translation
        : "");

    if (!translated) {
      return NextResponse.json(
        { error: "No translation returned. The text may be too short or unsupported." },
        { status: 422 }
      );
    }

    return NextResponse.json({ translatedText: translated, sourceLang, targetLang });
  } catch (err) {
    console.error("Translation error:", err);
    return NextResponse.json(
      { error: "Failed to translate. Please try again." },
      { status: 500 }
    );
  }
}
