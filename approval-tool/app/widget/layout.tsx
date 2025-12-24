"use client";

import { useEffect, useRef } from "react";
import { useTheme, useOpenAiActions, useSafeArea } from "@/components/widgets/hooks";

export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const safeArea = useSafeArea();
  const { notifyIntrinsicHeight } = useOpenAiActions();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        notifyIntrinsicHeight(height);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [notifyIntrinsicHeight]);

  const paddingStyle = safeArea
    ? {
        paddingTop: safeArea.insets.top,
        paddingBottom: safeArea.insets.bottom,
        paddingLeft: safeArea.insets.left,
        paddingRight: safeArea.insets.right,
      }
    : {};

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background text-foreground antialiased"
      style={paddingStyle}
    >
      {children}
    </div>
  );
}
