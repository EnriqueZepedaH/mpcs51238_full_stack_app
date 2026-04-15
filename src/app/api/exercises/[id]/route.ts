import { NextRequest, NextResponse } from "next/server";

const WGER_API = "https://wger.de/api/v2";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const url = `${WGER_API}/exerciseinfo/${id}/?language=2`;
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Find English translation
    const englishTranslation = data.translations?.find(
      (t: { language: number }) => t.language === 2
    );

    return NextResponse.json({
      id: data.id,
      name: englishTranslation?.name || data.name || "Unknown",
      description: englishTranslation?.description || "",
      category: data.category?.name || "",
      muscles: data.muscles || [],
      muscles_secondary: data.muscles_secondary || [],
      equipment: data.equipment || [],
      images: data.images || [],
    });
  } catch (error) {
    console.error("wger exercise detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercise" },
      { status: 500 }
    );
  }
}
