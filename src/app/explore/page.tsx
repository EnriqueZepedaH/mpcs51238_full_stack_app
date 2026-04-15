"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/page-header";
import { CommunityFavorite, WgerSearchSuggestion } from "@/lib/types";
import { saveExercise, getCommunityFavorites } from "@/lib/actions";
import { useWorkouts } from "@/lib/workout-context";

export default function ExplorePage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { state, dispatch } = useWorkouts();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WgerSearchSuggestion[]>([]);
  const [favorites, setFavorites] = useState<CommunityFavorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Saved IDs come from context so the picker stays in sync.
  const savedIds = new Set(state.savedExercises.map((s) => s.apiExerciseId));

  // Load community favorites on mount (works for guests too).
  useEffect(() => {
    getCommunityFavorites()
      .then(setFavorites)
      .catch((err) => console.error("Failed to load community favorites:", err));
  }, []);

  // Debounced wger search.
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

  const handleSaveSuggestion = useCallback(
    async (suggestion: WgerSearchSuggestion) => {
      if (!isSignedIn) {
        router.push("/sign-in?redirect_url=/explore");
        return;
      }

      const exerciseId = suggestion.data.id;
      if (savingIds.has(exerciseId)) return;
      setSavingIds((prev) => new Set(prev).add(exerciseId));

      try {
        // Fetch full details for muscles, equipment, description.
        const detailRes = await fetch(`/api/exercises/${exerciseId}`);
        const detail = detailRes.ok
          ? await detailRes.json()
          : { muscles: [], equipment: [], description: "" };

        const imageUrl = suggestion.data.image
          ? `https://wger.de${suggestion.data.image}`
          : null;
        const muscleGroup =
          detail.muscles?.[0]?.name_en || suggestion.data.category || null;

        await saveExercise({
          apiExerciseId: exerciseId,
          name: suggestion.data.name,
          description: detail.description || "",
          muscleGroup,
          muscles: detail.muscles || [],
          equipment: detail.equipment || [],
          imageUrl,
        });

        // Mirror to context so the workout picker sees it immediately.
        await dispatch({
          type: "ADD_SAVED_EXERCISE",
          payload: {
            id: `local-${exerciseId}`,
            apiExerciseId: exerciseId,
            name: suggestion.data.name,
            description: detail.description || "",
            muscleGroup,
            muscles: detail.muscles || [],
            equipment: detail.equipment || [],
            imageUrl,
            savedAt: new Date().toISOString(),
          },
        });
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
    [savingIds, isSignedIn, router, dispatch]
  );

  const handleSaveFavorite = useCallback(
    async (fav: CommunityFavorite) => {
      if (!isSignedIn) {
        router.push("/sign-in?redirect_url=/explore");
        return;
      }
      if (savingIds.has(fav.apiExerciseId)) return;
      setSavingIds((prev) => new Set(prev).add(fav.apiExerciseId));

      try {
        // Get full detail for muscles/equipment/description we don't have on the favorite row.
        const detailRes = await fetch(`/api/exercises/${fav.apiExerciseId}`);
        const detail = detailRes.ok
          ? await detailRes.json()
          : { muscles: [], equipment: [], description: "" };

        await saveExercise({
          apiExerciseId: fav.apiExerciseId,
          name: fav.name,
          description: detail.description || "",
          muscleGroup: fav.muscleGroup,
          muscles: detail.muscles || [],
          equipment: detail.equipment || [],
          imageUrl: fav.imageUrl,
        });

        await dispatch({
          type: "ADD_SAVED_EXERCISE",
          payload: {
            id: `local-${fav.apiExerciseId}`,
            apiExerciseId: fav.apiExerciseId,
            name: fav.name,
            description: detail.description || "",
            muscleGroup: fav.muscleGroup,
            muscles: detail.muscles || [],
            equipment: detail.equipment || [],
            imageUrl: fav.imageUrl,
            savedAt: new Date().toISOString(),
          },
        });
      } catch (err) {
        console.error("Failed to save:", err);
        setError("Failed to save exercise.");
      } finally {
        setSavingIds((prev) => {
          const next = new Set(prev);
          next.delete(fav.apiExerciseId);
          return next;
        });
      }
    },
    [savingIds, isSignedIn, router, dispatch]
  );

  const handleUnsave = useCallback(
    async (exerciseId: number) => {
      if (savingIds.has(exerciseId)) return;
      setSavingIds((prev) => new Set(prev).add(exerciseId));

      try {
        await dispatch({
          type: "REMOVE_SAVED_EXERCISE",
          payload: { apiExerciseId: exerciseId },
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
    [savingIds, dispatch]
  );

  const showFavorites =
    !loading && !query.trim() && favorites.length > 0;
  const showStartTyping =
    !loading && !query.trim() && favorites.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Explore Exercises"
        subtitle="Search 800+ exercises from the wger database"
      />

      {!isSignedIn && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">Browsing as guest.</span>{" "}
            Sign in to save exercises to your account.
          </p>
          <Link
            href="/sign-in?redirect_url=/explore"
            className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-800"
          >
            Sign in
          </Link>
        </div>
      )}

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
              <ExerciseCard
                key={`${exerciseId}-${suggestion.value}`}
                name={suggestion.data.name}
                category={suggestion.data.category}
                imageUrl={imageUrl}
                isSaved={isSaved}
                isSaving={isSaving}
                onSave={() => handleSaveSuggestion(suggestion)}
                onUnsave={() => handleUnsave(exerciseId)}
              />
            );
          })}
        </div>
      )}

      {showFavorites && (
        <section>
          <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">
            Community Favorites
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            Most-saved exercises across all users
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((fav) => {
              const isSaved = savedIds.has(fav.apiExerciseId);
              const isSaving = savingIds.has(fav.apiExerciseId);
              return (
                <ExerciseCard
                  key={fav.apiExerciseId}
                  name={fav.name}
                  category={fav.muscleGroup ?? undefined}
                  imageUrl={fav.imageUrl}
                  saveCount={fav.saveCount}
                  isSaved={isSaved}
                  isSaving={isSaving}
                  onSave={() => handleSaveFavorite(fav)}
                  onUnsave={() => handleUnsave(fav.apiExerciseId)}
                />
              );
            })}
          </div>
        </section>
      )}

      {showStartTyping && (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-sm text-gray-500">
            Start typing to search for exercises
          </p>
        </div>
      )}
    </div>
  );
}

function ExerciseCard({
  name,
  category,
  imageUrl,
  saveCount,
  isSaved,
  isSaving,
  onSave,
  onUnsave,
}: {
  name: string;
  category?: string;
  imageUrl: string | null;
  saveCount?: number;
  isSaved: boolean;
  isSaving: boolean;
  onSave: () => void;
  onUnsave: () => void;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="relative h-32 w-full bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
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
          <p className="font-medium text-gray-900">{name}</p>
          {category && (
            <p className="mt-0.5 text-xs text-gray-500">{category}</p>
          )}
          {typeof saveCount === "number" && saveCount > 0 && (
            <p className="mt-1 text-xs text-gray-400">
              Saved by {saveCount} {saveCount === 1 ? "person" : "people"}
            </p>
          )}
        </div>
        <div className="mt-auto pt-2">
          {isSaved ? (
            <button
              onClick={onUnsave}
              disabled={isSaving}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {isSaving ? "..." : "✓ Saved"}
            </button>
          ) : (
            <button
              onClick={onSave}
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
}
