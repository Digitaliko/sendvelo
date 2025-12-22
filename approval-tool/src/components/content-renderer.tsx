"use client";

import type { ContentFormat } from "@prisma/client";
import DOMPurify from "isomorphic-dompurify";

interface ContentRendererProps {
  content: string;
  format: ContentFormat;
  className?: string;
}

/**
 * ContentRenderer Component
 *
 * Renders content based on its format (PLAIN_TEXT, MARKDOWN, HTML).
 * For markdown, uses a simple rendering approach.
 * For HTML, sanitizes with DOMPurify before rendering.
 */
export function ContentRenderer({ content, format, className = "" }: ContentRendererProps) {
  if (format === "MARKDOWN") {
    return (
      <div className={`prose prose-sm sm:prose-base dark:prose-invert max-w-none ${className}`}>
        <MarkdownContent content={content} />
      </div>
    );
  }

  if (format === "HTML") {
    // Sanitize HTML content with DOMPurify to prevent XSS attacks
    const sanitizedHTML = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'code', 'pre', 'blockquote', 'hr', 'img', 'div', 'span'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id'],
      ALLOW_DATA_ATTR: false,
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    });

    return (
      <div
        className={`prose prose-sm sm:prose-base dark:prose-invert max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />
    );
  }

  // PLAIN_TEXT
  return (
    <pre className={`whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200 leading-relaxed ${className}`}>
      {content}
    </pre>
  );
}

/**
 * Simple Markdown Renderer
 *
 * Converts basic markdown to HTML elements.
 * Supports: headers, bold, italic, links, code blocks, lists, blockquotes.
 */
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";

    // Code blocks
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      const language = line.slice(3).trim();
      i++;
      while (i < lines.length && !lines[i]?.startsWith("```")) {
        codeLines.push(lines[i] ?? "");
        i++;
      }
      elements.push(
        <pre key={key++} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto my-4">
          <code className={`language-${language || "text"}`}>
            {codeLines.join("\n")}
          </code>
        </pre>
      );
      i++;
      continue;
    }

    // Headers
    if (line.startsWith("### ")) {
      elements.push(<h3 key={key++} className="text-lg font-semibold mt-4 mb-2">{parseInline(line.slice(4))}</h3>);
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++} className="text-xl font-semibold mt-6 mb-3">{parseInline(line.slice(3))}</h2>);
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      elements.push(<h1 key={key++} className="text-2xl font-bold mt-6 mb-4">{parseInline(line.slice(2))}</h1>);
      i++;
      continue;
    }

    // Blockquotes
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i]?.startsWith("> ")) {
        quoteLines.push((lines[i] ?? "").slice(2));
        i++;
      }
      elements.push(
        <blockquote key={key++} className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-700 dark:text-gray-300">
          {quoteLines.map((ql, idx) => <p key={idx}>{parseInline(ql)}</p>)}
        </blockquote>
      );
      continue;
    }

    // Unordered lists
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i]?.startsWith("- ") || lines[i]?.startsWith("* "))) {
        listItems.push((lines[i] ?? "").slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className="list-disc list-inside my-4 space-y-1">
          {listItems.map((item, idx) => <li key={idx}>{parseInline(item)}</li>)}
        </ul>
      );
      continue;
    }

    // Ordered lists
    if (/^\d+\.\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i] ?? "")) {
        listItems.push((lines[i] ?? "").replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={key++} className="list-decimal list-inside my-4 space-y-1">
          {listItems.map((item, idx) => <li key={idx}>{parseInline(item)}</li>)}
        </ol>
      );
      continue;
    }

    // Horizontal rule
    if (line === "---" || line === "***" || line === "___") {
      elements.push(<hr key={key++} className="my-6 border-gray-300 dark:border-gray-600" />);
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(<p key={key++} className="my-3">{parseInline(line)}</p>);
    i++;
  }

  return <>{elements}</>;
}

/**
 * Parse inline markdown elements (bold, italic, code, links)
 */
function parseInline(text: string): React.ReactNode {
  // Split text into segments based on markdown patterns
  let segmentKey = 0;

  // First, handle links which have a different capture group structure
  const linkRegex = /\[(.+?)\]\((.+?)\)/g;
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Validate URL to prevent javascript: and data: URLs (XSS protection)
    const linkText = match[1] ?? "";
    const linkUrl = match[2] ?? "";
    const isValidUrl = linkUrl.startsWith("http://") || linkUrl.startsWith("https://") || linkUrl.startsWith("/");

    if (isValidUrl) {
      parts.push(
        <a key={segmentKey++} href={linkUrl} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
          {linkText}
        </a>
      );
    } else {
      // If URL is invalid, render as plain text
      parts.push(`[${linkText}](${linkUrl})`);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // Now process each string part for bold, italic, code
  const processedParts = parts.map((part) => {
    if (typeof part !== "string") return part;

    let result: (string | React.ReactNode)[] = [part];

    // Bold
    result = result.flatMap((p) => {
      if (typeof p !== "string") return [p];
      const boldParts: (string | React.ReactNode)[] = [];
      const boldRegex = /\*\*(.+?)\*\*/g;
      let lastIdx = 0;
      let m;
      while ((m = boldRegex.exec(p)) !== null) {
        if (m.index > lastIdx) boldParts.push(p.slice(lastIdx, m.index));
        boldParts.push(<strong key={segmentKey++}>{m[1]}</strong>);
        lastIdx = m.index + m[0].length;
      }
      if (lastIdx < p.length) boldParts.push(p.slice(lastIdx));
      return boldParts.length > 0 ? boldParts : [p];
    });

    // Italic
    result = result.flatMap((p) => {
      if (typeof p !== "string") return [p];
      const italicParts: (string | React.ReactNode)[] = [];
      const italicRegex = /\*(.+?)\*/g;
      let lastIdx = 0;
      let m;
      while ((m = italicRegex.exec(p)) !== null) {
        if (m.index > lastIdx) italicParts.push(p.slice(lastIdx, m.index));
        italicParts.push(<em key={segmentKey++}>{m[1]}</em>);
        lastIdx = m.index + m[0].length;
      }
      if (lastIdx < p.length) italicParts.push(p.slice(lastIdx));
      return italicParts.length > 0 ? italicParts : [p];
    });

    // Inline code
    result = result.flatMap((p) => {
      if (typeof p !== "string") return [p];
      const codeParts: (string | React.ReactNode)[] = [];
      const codeRegex = /`(.+?)`/g;
      let lastIdx = 0;
      let m;
      while ((m = codeRegex.exec(p)) !== null) {
        if (m.index > lastIdx) codeParts.push(p.slice(lastIdx, m.index));
        codeParts.push(
          <code key={segmentKey++} className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">
            {m[1]}
          </code>
        );
        lastIdx = m.index + m[0].length;
      }
      if (lastIdx < p.length) codeParts.push(p.slice(lastIdx));
      return codeParts.length > 0 ? codeParts : [p];
    });

    return result;
  });

  return <>{processedParts.flat()}</>;
}
