"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { Workout, Routine } from "./types";
import { seedWorkouts, seedRoutines } from "./seed-data";

type WorkoutAction =
  | { type: "ADD_WORKOUT"; payload: Workout }
  | { type: "DELETE_WORKOUT"; payload: { id: string } }
  | { type: "UPDATE_WORKOUT"; payload: Workout }
  | { type: "ADD_ROUTINE"; payload: Routine }
  | { type: "DELETE_ROUTINE"; payload: { id: string } }
  | { type: "UPDATE_ROUTINE"; payload: Routine };

interface WorkoutState {
  workouts: Workout[];
  routines: Routine[];
}

function workoutReducer(
  state: WorkoutState,
  action: WorkoutAction
): WorkoutState {
  switch (action.type) {
    case "ADD_WORKOUT":
      return { ...state, workouts: [action.payload, ...state.workouts] };
    case "DELETE_WORKOUT":
      return {
        ...state,
        workouts: state.workouts.filter((w) => w.id !== action.payload.id),
      };
    case "UPDATE_WORKOUT":
      return {
        ...state,
        workouts: state.workouts.map((w) =>
          w.id === action.payload.id ? action.payload : w
        ),
      };
    case "ADD_ROUTINE":
      return { ...state, routines: [action.payload, ...state.routines] };
    case "DELETE_ROUTINE":
      return {
        ...state,
        routines: state.routines.filter((r) => r.id !== action.payload.id),
      };
    case "UPDATE_ROUTINE":
      return {
        ...state,
        routines: state.routines.map((r) =>
          r.id === action.payload.id ? action.payload : r
        ),
      };
    default:
      return state;
  }
}

const WorkoutContext = createContext<{
  state: WorkoutState;
  dispatch: React.Dispatch<WorkoutAction>;
} | null>(null);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workoutReducer, {
    workouts: seedWorkouts,
    routines: seedRoutines,
  });

  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkouts() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkouts must be used within a WorkoutProvider");
  }
  return context;
}
