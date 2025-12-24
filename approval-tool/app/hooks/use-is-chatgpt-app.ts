import { useSyncExternalStore } from "react";

export function useIsChatGptApp(): boolean {
  return useSyncExternalStore(
    () => {
      return () => {};
    },
    () => {
      if (typeof window === "undefined") return false;
      return (window as Window & { __isChatGptApp?: boolean }).__isChatGptApp ?? false;
    },
    () => {
      return false;
    }
  );
}
