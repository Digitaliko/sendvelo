import DOMPurify from "isomorphic-dompurify";

export const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "a", "code", "pre", "blockquote",
  "hr", "img", "div", "span",
];

export const BASE_ALLOWED_ATTR = ["href", "src", "alt", "title"];

export const EXTENDED_ALLOWED_ATTR = [...BASE_ALLOWED_ATTR, "class", "id"];

export const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i;

function createSanitizeConfig(allowClassAndId = false) {
  return {
    ALLOWED_TAGS: [...ALLOWED_TAGS],
    ALLOWED_ATTR: allowClassAndId ? [...EXTENDED_ALLOWED_ATTR] : [...BASE_ALLOWED_ATTR],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP,
  };
}

export function sanitizeHtml(html: string, allowClassAndId = false): string {
  return DOMPurify.sanitize(html, createSanitizeConfig(allowClassAndId));
}

export function sanitizeForStorage(content: string, format: "PLAIN_TEXT" | "MARKDOWN" | "HTML"): string {
  const trimmed = content.trim().slice(0, 50000);

  if (format === "HTML") {
    return sanitizeHtml(trimmed, false);
  }

  return trimmed;
}
