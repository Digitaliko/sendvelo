"use client";

import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";
import type { ContentFormat } from "@prisma/client";
import { sanitizeHtml } from "@/lib/sanitization";
import { MediaEmbed, isEmbeddableUrl } from "./media-embed";
import { ExternalLink } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  format?: ContentFormat;
  className?: string;
  isStreaming?: boolean;
}

function CustomLink(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { node?: unknown }
) {
  const { href, children, node, ...rest } = props;
  if (!href) return <>{children}</>;

  // Check if it's an embeddable URL (video, design tool, etc.)
  if (isEmbeddableUrl(href)) {
    return (
      <div className="my-4">
        <MediaEmbed url={href} />
      </div>
    );
  }

  // Check if it's a standalone image URL
  const isImageUrl = /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(href);
  if (isImageUrl && (!children || children === href)) {
    return (
      <img
        src={href}
        alt="Image"
        className="max-w-full h-auto rounded-lg my-4"
        loading="lazy"
      />
    );
  }

  // Regular link with external indicator
  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="text-primary underline underline-offset-2 hover:text-primary/80 inline-flex items-center gap-1"
    >
      {children}
      {isExternal && <ExternalLink className="w-3 h-3 inline-block" />}
    </a>
  );
}

function CustomImage(
  props: React.ImgHTMLAttributes<HTMLImageElement> & { node?: unknown }
) {
  const { src, alt, node, ...rest } = props;
  if (!src || typeof src !== "string") return null;

  return (
    <figure className="my-4">
      <img
        src={src}
        alt={alt || "Image"}
        className="max-w-full h-auto rounded-lg"
        loading="lazy"
        {...rest}
      />
      {alt && alt !== "Image" && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}

export function MarkdownRenderer({
  content,
  format = "MARKDOWN",
  className,
  isStreaming = false,
}: MarkdownRendererProps) {
  if (!content) {
    return null;
  }

  if (format === "PLAIN_TEXT") {
    return (
      <pre
        className={cn(
          "whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200 leading-relaxed",
          className
        )}
      >
        {content}
      </pre>
    );
  }

  if (format === "HTML") {
    const sanitizedHTML = sanitizeHtml(content, true);
    return (
      <div
        className={cn(
          "prose prose-sm sm:prose-base dark:prose-invert max-w-none",
          className
        )}
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />
    );
  }

  return (
    <div
      className={cn(
        "prose prose-sm sm:prose-base dark:prose-invert max-w-none",
        "[&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto",
        "[&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
        "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4",
        "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3",
        "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2",
        "[&_ul]:list-disc [&_ul]:list-inside [&_ul]:my-4",
        "[&_ol]:list-decimal [&_ol]:list-inside [&_ol]:my-4",
        "[&_li]:my-1",
        "[&_p]:my-3 [&_p]:leading-relaxed",
        "[&_hr]:my-6 [&_hr]:border-border",
        "[&_table]:w-full [&_table]:border-collapse [&_table]:my-4",
        "[&_th]:border [&_th]:border-border [&_th]:px-4 [&_th]:py-2 [&_th]:bg-muted [&_th]:font-semibold [&_th]:text-left",
        "[&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-2",
        className
      )}
    >
      <Streamdown
        mode={isStreaming ? "streaming" : "static"}
        parseIncompleteMarkdown={isStreaming}
        shikiTheme={["github-light", "github-dark"]}
        controls={{
          table: true,
          code: true,
          mermaid: {
            download: true,
            copy: true,
            fullscreen: true,
          },
        }}
        components={{
          a: CustomLink,
          img: CustomImage,
        }}
      >
        {content}
      </Streamdown>
    </div>
  );
}
