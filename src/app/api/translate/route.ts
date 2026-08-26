import { NextResponse } from "next/server";
import { translate } from "bing-translate-api";

export async function POST(request: Request) {
  // 1. Declare 'text' outside the try-catch block so the catch block can read it if it fails
  let textToTranslate = "";

  try {
    const body = await request.json();
    textToTranslate = body.text;
    const targetLanguage = body.targetLanguage;

    // Bing requires the parameters in a specific order: (text, from, to)
    const res = await translate(textToTranslate, null, targetLanguage);

    // 2. Use optional chaining (?.) to safely handle 'res' if Bing returns undefined
    const translatedText = res?.translation || textToTranslate;

    return NextResponse.json({ translatedText });
    
  } catch (error: unknown) {
    // 3. Changed 'any' to 'unknown' to satisfy strict TypeScript rules
    console.error("Bing Translation error:", error);

    // Now 'textToTranslate' is safely accessible here
    return NextResponse.json({ 
      translatedText: `[Translation Error]\n\n\n${textToTranslate}` 
    });
  }
}