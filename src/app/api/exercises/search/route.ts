import { NextRequest, NextResponse } from "next/server";

const WGER_API = "https://wger.de/api/v2";

interface WgerTranslation {
  language: number;
  name: string;
  description: string;
}

interface WgerImageRaw {
  image: string;
  is_main: boolean;
}

interface WgerExerciseInfoResult {
  id: number;
  category: { id: number; name: string } | null;
  images: WgerImageRaw[];
  translations: WgerTranslation[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("q") || "";
  const limit = searchParams.get("limit") || "20";

  if (!term.trim()) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const url = `${WGER_API}/exerciseinfo/?name__search=${encodeURIComponent(
      term
    )}&language__code=en&limit=${limit}`;
    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch exercises" },
        { status: response.status }
      );
    }

    const data = (await response.json()) as {
      results: WgerExerciseInfoResult[];
    };

    // Normalize to the suggestion shape the Explore page expects.
    const suggestions = (data.results || []).map((ex) => {
      const englishTrans = ex.translations.find((t) => t.language === 2);
      const mainImage = ex.images.find((i) => i.is_main) || ex.images[0];
      return {
        value: englishTrans?.name || `Exercise ${ex.id}`,
        data: {
          id: ex.id,
          base_id: ex.id,
          name: englishTrans?.name || `Exercise ${ex.id}`,
          category: ex.category?.name || "",
          image: mainImage?.image || null,
          image_thumbnail: mainImage?.image || null,
        },
      };
    });

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("wger search error:", error);
    return NextResponse.json(
      { error: "Failed to search exercises" },
      { status: 500 }
    );
  }
}
