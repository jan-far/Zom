import { NextRequest, NextResponse } from "next/server";
import { analyzePaperWithGemini } from "@/lib/api/gemini";

export async function POST(req: NextRequest) {
  try {
    const { paperText } = await req.json();

    if (!paperText) {
      return NextResponse.json({ error: "No paper text provided" }, { status: 400 });
    }

    const synthesis = await analyzePaperWithGemini(paperText);
    return NextResponse.json(synthesis);
  } catch (error: any) {
    console.error("Error analyzing paper:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze paper" },
      { status: 500 }
    );
  }
}
