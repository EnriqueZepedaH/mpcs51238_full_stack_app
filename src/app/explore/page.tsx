"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import PageHeader from "@/components/page-header";
import { WgerSearchSuggestion } from "@/lib/types";
import { saveExercise, unsaveExercise, getSavedExercises } from "@/lib/actions";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WgerSearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Load already-saved exercise IDs on mount
  useEffect(() => {
    getSavedExercises()
      .then((saved) => setSavedIds(new Set(saved.map((s) => s.apiExerciseId))))
      .catch((err) => console.error("Failed to load saved exercises:", err));
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/exercises/search?q=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setResults(data.suggestions || []);
      } catch (err) {
        console.error(err);
        setError("Failed to search exercises. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  const handleSave = useCallback(
    async (suggestion: WgerSearchSuggestion) => {
      const exerciseId = suggestion.data.id;
      if (savingIds.has(exerciseId)) return;

      setSavingIds((prev) => new Set(prev).add(exerciseId));

      try {
        // Fetch full details for muscles, equipment, description
        const detailRes = await fetch(`/api/exercises/${exerciseId}`);
        const detail = detailRes.ok
          ? await detailRes.json()
          : { muscles: [], equipment: [], description: "" };

        await saveExercise({
          apiExerciseId: exerciseId,
          name: suggestion.data.name,
          description: detail.description || "",
          muscleGroup: detail.muscles?.[0]?.name_en || suggestion.data.category,
          muscles: detail.muscles || [],
          equipment: detail.equipment || [],
          imageUrl: suggestion.data.image
            ? `https://wger.de${suggestion.data.image}`
            : null,
        });

        setSavedIds((prev) => new Set(prev).add(exerciseId));
      } catch (err) {
        console.error("Failed to save:", err);
        setError("Failed to save exercise.");
      } finally {
        setSavingIds((prev) => {
          const next = new Set(prev);
          next.delete(exerciseId);
          return next;
        });
      }
    },
    [savingIds]
  );

  const handleUnsave = useCallback(
    async (exerciseId: number) => {
      if (savingIds.has(exerciseId)) return;
      setSavingIds((prev) => new Set(prev).add(exerciseId));

      try {
        await unsaveExercise(exerciseId);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(exerciseId);
          return next;
        });
      } catch (err) {
        console.error("Failed to unsave:", err);
        setError("Failed to unsave exercise.");
      } finally {
        setSavingIds((prev) => {
          const next = new Set(prev);
          next.delete(exerciseId);
          return next;
        });
      }
    },
    [savingIds]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Explore Exercises"
        subtitle="Search 800+ exercises from the wger database"
      />

      <div>
        <input
          type="text"
          placeholder="Search exercises (e.g. bench press, squat)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      )}

      {!loading && query.trim() && results.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm text-gray-500">No exercises found</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((suggestion) => {
            const exerciseId = suggestion.data.id;
            const isSaved = savedIds.has(exerciseId);
            const isSaving = savingIds.has(exerciseId);
            const imageUrl = suggestion.data.image_thumbnail
              ? `https://wger.de${suggestion.data.image_thumbnail}`
              : suggestion.data.image
              ? `https://wger.de${suggestion.data.image}`
              : null;

            return (
              <div
                key={`${exerciseId}-${suggestion.value}`}
                className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <div className="relative h-32 w-full bg-gray-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={suggestion.data.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <svg
                        className="h-10 w-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 7.5h-.75a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5h.75m10.5-9h.75a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5h-.75M3 9v6m18-6v6M6.75 7.5v9m10.5-9v9M6.75 12h10.5"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {suggestion.data.name}
                    </p>
                    {suggestion.data.category && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {suggestion.data.category}
                      </p>
                    )}
                  </div>
                  <div className="mt-auto pt-2">
                    {isSaved ? (
                      <button
                        onClick={() => handleUnsave(exerciseId)}
                        disabled={isSaving}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                      >
                        {isSaving ? "..." : "✓ Saved"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSave(suggestion)}
                        disabled={isSaving}
                        className="w-full rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !query.trim() && (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-sm text-gray-500">
            Start typing to search for exercises
          </p>
        </div>
      )}
    </div>
  );
}
