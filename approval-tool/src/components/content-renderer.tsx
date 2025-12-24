"use client";

import type { ContentFormat } from "@prisma/client";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

interface ContentRendererProps {
  content: string;
  format: ContentFormat;
  className?: string;
  isStreaming?: boolean;
}

export function ContentRenderer({
  content,
  format,
  className = "",
  isStreaming = false,
}: ContentRendererProps) {
  return (
    <MarkdownRenderer
      content={content}
      format={format}
      className={className}
      isStreaming={isStreaming}
    />
  );
}
