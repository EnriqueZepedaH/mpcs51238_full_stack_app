"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@clerk/nextjs";
import { Workout, Routine } from "./types";
import * as db from "./actions";

type WorkoutAction =
  | { type: "SET_DATA"; payload: { workouts: Workout[]; routines: Routine[] } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "ADD_WORKOUT"; payload: Workout }
  | { type: "DELETE_WORKOUT"; payload: { id: string } }
  | { type: "UPDATE_WORKOUT"; payload: Workout }
  | { type: "ADD_ROUTINE"; payload: Routine }
  | { type: "DELETE_ROUTINE"; payload: { id: string } }
  | { type: "UPDATE_ROUTINE"; payload: Routine };

interface WorkoutState {
  workouts: Workout[];
  routines: Routine[];
  loading: boolean;
}

function workoutReducer(
  state: WorkoutState,
  action: WorkoutAction
): WorkoutState {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        workouts: action.payload.workouts,
        routines: action.payload.routines,
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
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

type DispatchAction = Exclude<WorkoutAction, { type: "SET_DATA" } | { type: "SET_LOADING" }>;

const WorkoutContext = createContext<{
  state: WorkoutState;
  dispatch: (action: DispatchAction) => Promise<void>;
} | null>(null);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const [state, localDispatch] = useReducer(workoutReducer, {
    workouts: [],
    routines: [],
    loading: true,
  });

  useEffect(() => {
    if (!isLoaded) return;

    // Guests have nothing to load — skip Supabase calls entirely.
    if (!isSignedIn) {
      localDispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    async function load() {
      try {
        const [workouts, routines] = await Promise.all([
          db.getWorkouts(),
          db.getRoutines(),
        ]);
        localDispatch({ type: "SET_DATA", payload: { workouts, routines } });
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        localDispatch({ type: "SET_LOADING", payload: false });
      }
    }
    load();
  }, [isLoaded, isSignedIn]);

  const dispatch = useCallback(async (action: DispatchAction) => {
    switch (action.type) {
      case "ADD_WORKOUT":
        await db.addWorkout(action.payload);
        localDispatch(action);
        break;
      case "DELETE_WORKOUT":
        await db.deleteWorkout(action.payload.id);
        localDispatch(action);
        break;
      case "ADD_ROUTINE":
        await db.addRoutine(action.payload);
        localDispatch(action);
        break;
      case "DELETE_ROUTINE":
        await db.deleteRoutine(action.payload.id);
        localDispatch(action);
        break;
      default:
        localDispatch(action);
    }
  }, []);

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
