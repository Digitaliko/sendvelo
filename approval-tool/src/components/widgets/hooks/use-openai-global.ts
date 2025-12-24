"use client";

import { useSyncExternalStore } from "react";
import type { OpenAIGlobals } from "@/app/hooks/types";

const SET_GLOBALS_EVENT = "openai:set_globals";

export function useOpenAiGlobal<K extends keyof OpenAIGlobals>(
  key: K
): OpenAIGlobals[K] | undefined {
  return useSyncExternalStore(
    (onChange) => {
      const handleSetGlobals = (event: CustomEvent<{ globals: Partial<OpenAIGlobals> }>) => {
        const value = event.detail.globals[key];
        if (value !== undefined) {
          onChange();
        }
      };

      window.addEventListener(SET_GLOBALS_EVENT, handleSetGlobals as EventListener, {
        passive: true,
      });

      return () => {
        window.removeEventListener(SET_GLOBALS_EVENT, handleSetGlobals as EventListener);
      };
    },
    () => window.openai?.[key],
    () => undefined
  );
}

export function useTheme() {
  return useOpenAiGlobal("theme") ?? "light";
}

export function useDisplayMode() {
  return useOpenAiGlobal("displayMode") ?? "inline";
}

export function useLocale() {
  return useOpenAiGlobal("locale") ?? "en-US";
}

export function useMaxHeight() {
  return useOpenAiGlobal("maxHeight");
}

export function useSafeArea() {
  return useOpenAiGlobal("safeArea");
}

export function useToolInput<T = Record<string, unknown>>() {
  return useOpenAiGlobal("toolInput") as T | null;
}

export function useToolOutput<T = Record<string, unknown>>() {
  return useOpenAiGlobal("toolOutput") as T | null;
}

export function useToolResponseMetadata() {
  return useOpenAiGlobal("toolResponseMetadata");
}
