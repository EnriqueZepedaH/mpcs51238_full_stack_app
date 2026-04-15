"use client";

import { useState, useRef, useEffect } from "react";
import { ComboboxExercise, MuscleGroup, SavedExercise } from "@/lib/types";
import { searchAllExercises } from "@/lib/exercise-library";

interface ExerciseComboboxProps {
  value: string;
  onChange: (
    name: string,
    muscleGroup?: MuscleGroup,
    libraryExerciseId?: string
  ) => void;
  placeholder?: string;
  /**
   * The user's saved wger exercises (from WorkoutContext). When provided,
   * they appear in a separate "Your saved exercises" section at the bottom
   * of the dropdown. Library results take priority on name collisions.
   */
  savedExercises?: SavedExercise[];
}

export default function ExerciseCombobox({
  value,
  onChange,
  placeholder = "Search exercises...",
  savedExercises = [],
}: ExerciseComboboxProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { library, saved } = searchAllExercises(query, savedExercises);
  const totalResults = library.length + saved.length;

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleInputChange(val: string) {
    setQuery(val);
    setOpen(true);
    onChange(val, undefined, undefined);
  }

  function handleSelect(exercise: ComboboxExercise) {
    setQuery(exercise.name);
    setOpen(false);
    onChange(
      exercise.name,
      exercise.muscleGroup,
      exercise.source === "library" ? exercise.id : undefined
    );
  }

  // Cap each section so the dropdown stays scannable.
  const libraryShown = library.slice(0, 6);
  const savedShown = saved.slice(0, 4);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
      {open && query.length > 0 && totalResults > 0 && (
        <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {libraryShown.map((exercise) => (
            <li key={exercise.id}>
              <button
                type="button"
                onClick={() => handleSelect(exercise)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                <span className="text-gray-900">{exercise.name}</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {exercise.muscleGroup}
                </span>
              </button>
            </li>
          ))}
          {savedShown.length > 0 && (
            <>
              <li className="border-t border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
                Your saved exercises
              </li>
              {savedShown.map((exercise) => (
                <li key={exercise.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(exercise)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    <span className="text-gray-900">{exercise.name}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      {exercise.muscleGroup}
                    </span>
                  </button>
                </li>
              ))}
            </>
          )}
        </ul>
      )}
    </div>
  );
}
