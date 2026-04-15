import { NextRequest, NextResponse } from "next/server";

const WGER_API = "https://wger.de/api/v2";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("q") || "";

  if (!term.trim()) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const url = `${WGER_API}/exercise/search/?term=${encodeURIComponent(term)}&language=2`;
    const response = await fetch(url, {
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch exercises" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("wger search error:", error);
    return NextResponse.json(
      { error: "Failed to search exercises" },
      { status: 500 }
    );
  }
}
