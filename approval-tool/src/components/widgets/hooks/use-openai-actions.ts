"use client";

import { useCallback } from "react";
import type { DisplayMode } from "@/app/hooks/types";

type ExtendedOpenAiAPI = {
  callTool?: (name: string, args: Record<string, unknown>) => Promise<{ result: string }>;
  sendFollowUpMessage?: (args: { prompt: string }) => Promise<void>;
  requestDisplayMode?: (args: { mode: DisplayMode }) => Promise<{ mode: DisplayMode }>;
  requestClose?: () => void;
  openExternal?: (args: { href: string }) => void;
  uploadFile?: (file: File) => Promise<{ fileId: string }>;
  notifyIntrinsicHeight?: (height: number) => void;
};

function getOpenAi(): ExtendedOpenAiAPI | undefined {
  return window.openai as ExtendedOpenAiAPI | undefined;
}

export function useOpenAiActions() {
  const callTool = useCallback(
    async (name: string, args: Record<string, unknown>) => {
      const api = getOpenAi();
      if (!api?.callTool) {
        throw new Error("OpenAI API not available");
      }
      return api.callTool(name, args);
    },
    []
  );

  const sendFollowUpMessage = useCallback(async (prompt: string) => {
    const api = getOpenAi();
    if (!api?.sendFollowUpMessage) {
      throw new Error("OpenAI API not available");
    }
    return api.sendFollowUpMessage({ prompt });
  }, []);

  const requestDisplayMode = useCallback(async (mode: DisplayMode) => {
    const api = getOpenAi();
    if (!api?.requestDisplayMode) {
      throw new Error("OpenAI API not available");
    }
    return api.requestDisplayMode({ mode });
  }, []);

  const requestClose = useCallback(() => {
    const api = getOpenAi();
    if (api?.requestClose) {
      api.requestClose();
    }
  }, []);

  const openExternal = useCallback((href: string) => {
    const api = getOpenAi();
    if (api?.openExternal) {
      api.openExternal({ href });
    } else {
      window.open(href, "_blank");
    }
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    const api = getOpenAi();
    if (!api?.uploadFile) {
      throw new Error("OpenAI API not available");
    }
    return api.uploadFile(file);
  }, []);

  const notifyIntrinsicHeight = useCallback((height: number) => {
    const api = getOpenAi();
    if (api?.notifyIntrinsicHeight) {
      api.notifyIntrinsicHeight(height);
    }
  }, []);

  return {
    callTool,
    sendFollowUpMessage,
    requestDisplayMode,
    requestClose,
    openExternal,
    uploadFile,
    notifyIntrinsicHeight,
  };
}
