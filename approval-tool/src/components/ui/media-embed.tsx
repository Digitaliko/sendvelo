"use client";

import { cn } from "@/lib/utils";
import { Play, Figma, ExternalLink, FileText, Presentation, Table2, Layout, Pencil } from "lucide-react";
import { useState } from "react";

interface EmbedProps {
  url: string;
  title?: string;
  className?: string;
}

// ============ URL DETECTION HELPERS ============

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match?.[1] ?? null;
}

function getLoomId(url: string): string | null {
  const match = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
  return match?.[1] ?? null;
}

function getFigmaUrl(url: string): string | null {
  // Figma file, prototype, or design URLs
  const match = url.match(/figma\.com\/(file|proto|design|board)\/([a-zA-Z0-9]+)/);
  if (match) return url;
  return null;
}

function getMiroId(url: string): string | null {
  // Miro board URLs
  const match = url.match(/miro\.com\/app\/board\/([a-zA-Z0-9_=-]+)/);
  return match?.[1] ?? null;
}

function getCanvaUrl(url: string): string | null {
  // Canva design URLs
  const match = url.match(/canva\.com\/design\/([a-zA-Z0-9_-]+)/);
  if (match) return url;
  return null;
}

function getGoogleDocsInfo(url: string): { type: "doc" | "sheet" | "slide" | "form"; id: string } | null {
  const patterns = [
    { type: "doc" as const, regex: /docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/ },
    { type: "sheet" as const, regex: /docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/ },
    { type: "slide" as const, regex: /docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/ },
    { type: "form" as const, regex: /docs\.google\.com\/forms\/d\/([a-zA-Z0-9_-]+)/ },
  ];
  for (const { type, regex } of patterns) {
    const match = url.match(regex);
    if (match?.[1]) return { type, id: match[1] };
  }
  return null;
}

function getNotionId(url: string): string | null {
  // Notion page URLs
  const match = url.match(/notion\.(?:so|site)\/(?:[^/]+\/)?([a-f0-9]{32}|[a-zA-Z0-9-]+-[a-f0-9]{32})/);
  return match?.[1] ?? null;
}

function getAirtableInfo(url: string): { baseId: string; tableId?: string } | null {
  const match = url.match(/airtable\.com\/(?:app)?([a-zA-Z0-9]+)(?:\/([a-zA-Z0-9]+))?/);
  if (match?.[1]) {
    return { baseId: match[1], tableId: match[2] };
  }
  return null;
}

function getFramerUrl(url: string): string | null {
  const match = url.match(/framer\.com\/(projects|share)\/([a-zA-Z0-9]+)/);
  if (match) return url;
  return null;
}

function getPitchUrl(url: string): string | null {
  const match = url.match(/pitch\.com\/(?:public\/)?([a-zA-Z0-9-]+)/);
  if (match) return url;
  return null;
}

// ============ EMBED TYPE DETECTION ============

export type EmbedType =
  | "youtube"
  | "vimeo"
  | "loom"
  | "figma"
  | "miro"
  | "canva"
  | "google-doc"
  | "google-sheet"
  | "google-slide"
  | "google-form"
  | "notion"
  | "airtable"
  | "framer"
  | "pitch"
  | null;

export function getEmbedType(url: string): EmbedType {
  if (getYouTubeId(url)) return "youtube";
  if (getVimeoId(url)) return "vimeo";
  if (getLoomId(url)) return "loom";
  if (getFigmaUrl(url)) return "figma";
  if (getMiroId(url)) return "miro";
  if (getCanvaUrl(url)) return "canva";
  const googleInfo = getGoogleDocsInfo(url);
  if (googleInfo) return `google-${googleInfo.type}` as EmbedType;
  if (getNotionId(url)) return "notion";
  if (getAirtableInfo(url)) return "airtable";
  if (getFramerUrl(url)) return "framer";
  if (getPitchUrl(url)) return "pitch";
  return null;
}

export function isEmbeddableUrl(url: string): boolean {
  return getEmbedType(url) !== null;
}

// ============ EMBED COMPONENTS ============

// Reusable placeholder for click-to-load embeds
function EmbedPlaceholder({
  onClick,
  icon: Icon,
  label,
  bgColor,
  iconBgColor,
  iconColor = "text-white",
  className,
}: {
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  bgColor: string;
  iconBgColor: string;
  iconColor?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full aspect-video rounded-lg overflow-hidden group cursor-pointer",
        "hover:opacity-90 transition-opacity flex items-center justify-center",
        bgColor,
        className
      )}
    >
      <div className={cn("w-16 h-16 rounded-full flex items-center justify-center shadow-lg", iconBgColor)}>
        <Icon className={cn("w-8 h-8", iconColor)} />
      </div>
      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        {label}
      </div>
      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
        <ExternalLink className="w-3 h-3" />
        Click to load
      </div>
    </button>
  );
}

// YouTube Embed
export function YouTubeEmbed({ url, title, className }: EmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (!isLoaded) {
    return (
      <button
        type="button"
        onClick={() => setIsLoaded(true)}
        className={cn(
          "relative w-full aspect-video rounded-lg overflow-hidden group cursor-pointer",
          "bg-gray-900 hover:opacity-90 transition-opacity",
          className
        )}
      >
        <img
          src={thumbnailUrl}
          alt={title || "YouTube video"}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          YouTube
        </div>
      </button>
    );
  }

  return (
    <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden", className)}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title || "YouTube video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

// Vimeo Embed
export function VimeoEmbed({ url, title, className }: EmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoId = getVimeoId(url);
  if (!videoId) return null;

  if (!isLoaded) {
    return (
      <EmbedPlaceholder
        onClick={() => setIsLoaded(true)}
        icon={Play}
        label="Vimeo"
        bgColor="bg-gray-900"
        iconBgColor="bg-[#1ab7ea]"
        className={className}
      />
    );
  }

  return (
    <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden", className)}>
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?autoplay=1`}
        title={title || "Vimeo video"}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

// Loom Embed
export function LoomEmbed({ url, title, className }: EmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoId = getLoomId(url);
  if (!videoId) return null;

  if (!isLoaded) {
    return (
      <EmbedPlaceholder
        onClick={() => setIsLoaded(true)}
        icon={Play}
        label="Loom"
        bgColor="bg-gradient-to-br from-purple-600 to-pink-500"
        iconBgColor="bg-white"
        iconColor="text-purple-600"
        className={className}
      />
    );
  }

  return (
    <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden", className)}>
      <iframe
        src={`https://www.loom.com/embed/${videoId}?autoplay=1`}
        title={title || "Loom video"}
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

// Figma Embed
export function FigmaEmbed({ url, title, className }: EmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const figmaUrl = getFigmaUrl(url);
  if (!figmaUrl) return null;

  if (!isLoaded) {
    return (
      <EmbedPlaceholder
        onClick={() => setIsLoaded(true)}
        icon={Figma}
        label="Figma"
        bgColor="bg-[#1e1e1e]"
        iconBgColor="bg-white"
        iconColor="text-black"
        className={className}
      />
    );
  }

  // Convert to embed URL
  const embedUrl = `https://www.figma.com/embed?embed_host=thumbway&url=${encodeURIComponent(figmaUrl)}`;

  return (
    <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden bg-white", className)}>
      <iframe
        src={embedUrl}
        title={title || "Figma design"}
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

// Miro Embed
export function MiroEmbed({ url, title, className }: EmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const boardId = getMiroId(url);
  if (!boardId) return null;

  if (!isLoaded) {
    return (
      <EmbedPlaceholder
        onClick={() => setIsLoaded(true)}
        icon={Layout}
        label="Miro"
        bgColor="bg-[#ffd02f]"
        iconBgColor="bg-[#050038]"
        iconColor="text-white"
        className={className}
      />
    );
  }

  return (
    <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden", className)}>
      <iframe
        src={`https://miro.com/app/live-embed/${boardId}/`}
        title={title || "Miro board"}
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

// Canva Embed
export function CanvaEmbed({ url, title, className }: EmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const canvaUrl = getCanvaUrl(url);
  if (!canvaUrl) return null;

  if (!isLoaded) {
    return (
      <EmbedPlaceholder
        onClick={() => setIsLoaded(true)}
        icon={Pencil}
        label="Canva"
        bgColor="bg-gradient-to-br from-[#00c4cc] to-[#7d2ae8]"
        iconBgColor="bg-white"
        iconColor="text-[#7d2ae8]"
        className={className}
      />
    );
  }

  // Canva embed URL format
  const embedUrl = canvaUrl.replace("/design/", "/design/embed/");

  return (
    <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden", className)}>
      <iframe
        src={embedUrl}
        title={title || "Canva design"}
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

// Google Docs/Sheets/Slides Embed
export function GoogleDocsEmbed({ url, title, className }: EmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const info = getGoogleDocsInfo(url);
  if (!info) return null;

  const labels = {
    doc: { label: "Google Docs", icon: FileText, color: "bg-[#4285f4]" },
    sheet: { label: "Google Sheets", icon: Table2, color: "bg-[#0f9d58]" },
    slide: { label: "Google Slides", icon: Presentation, color: "bg-[#f4b400]" },
    form: { label: "Google Forms", icon: FileText, color: "bg-[#673ab7]" },
  };

  const config = labels[info.type];

  if (!isLoaded) {
    return (
      <EmbedPlaceholder
        onClick={() => setIsLoaded(true)}
        icon={config.icon}
        label={config.label}
        bgColor={config.color}
        iconBgColor="bg-white"
        iconColor="text-gray-700"
        className={className}
      />
    );
  }

  const embedUrls = {
    doc: `https://docs.google.com/document/d/${info.id}/preview`,
    sheet: `https://docs.google.com/spreadsheets/d/${info.id}/preview`,
    slide: `https://docs.google.com/presentation/d/${info.id}/embed`,
    form: `https://docs.google.com/forms/d/${info.id}/viewform?embedded=true`,
  };

  return (
    <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden", className)}>
      <iframe
        src={embedUrls[info.type]}
        title={title || config.label}
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

// Notion Embed
export function NotionEmbed({ url, title, className }: EmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const pageId = getNotionId(url);
  if (!pageId) return null;

  if (!isLoaded) {
    return (
      <EmbedPlaceholder
        onClick={() => setIsLoaded(true)}
        icon={FileText}
        label="Notion"
        bgColor="bg-[#191919]"
        iconBgColor="bg-white"
        iconColor="text-black"
        className={className}
      />
    );
  }

  // Clean page ID (remove hyphens if present)
  const cleanId = pageId.replace(/-/g, "").slice(-32);

  return (
    <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden", className)}>
      <iframe
        src={`https://notion.so/embed/${cleanId}`}
        title={title || "Notion page"}
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

// Airtable Embed
export function AirtableEmbed({ url, title, className }: EmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const info = getAirtableInfo(url);
  if (!info) return null;

  if (!isLoaded) {
    return (
      <EmbedPlaceholder
        onClick={() => setIsLoaded(true)}
        icon={Table2}
        label="Airtable"
        bgColor="bg-[#fcb400]"
        iconBgColor="bg-[#18bfff]"
        iconColor="text-white"
        className={className}
      />
    );
  }

  const embedUrl = info.tableId
    ? `https://airtable.com/embed/${info.baseId}/${info.tableId}`
    : `https://airtable.com/embed/${info.baseId}`;

  return (
    <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden", className)}>
      <iframe
        src={embedUrl}
        title={title || "Airtable base"}
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

// Framer Embed
export function FramerEmbed({ url, title, className }: EmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const framerUrl = getFramerUrl(url);
  if (!framerUrl) return null;

  if (!isLoaded) {
    return (
      <EmbedPlaceholder
        onClick={() => setIsLoaded(true)}
        icon={Layout}
        label="Framer"
        bgColor="bg-black"
        iconBgColor="bg-[#0055ff]"
        iconColor="text-white"
        className={className}
      />
    );
  }

  return (
    <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden", className)}>
      <iframe
        src={framerUrl}
        title={title || "Framer prototype"}
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

// Pitch Embed
export function PitchEmbed({ url, title, className }: EmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const pitchUrl = getPitchUrl(url);
  if (!pitchUrl) return null;

  if (!isLoaded) {
    return (
      <EmbedPlaceholder
        onClick={() => setIsLoaded(true)}
        icon={Presentation}
        label="Pitch"
        bgColor="bg-gradient-to-br from-[#7b68ee] to-[#9370db]"
        iconBgColor="bg-white"
        iconColor="text-[#7b68ee]"
        className={className}
      />
    );
  }

  // Convert to embed URL
  const embedUrl = pitchUrl.includes("/public/")
    ? pitchUrl.replace("/public/", "/embed/")
    : pitchUrl + "/embed";

  return (
    <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden", className)}>
      <iframe
        src={embedUrl}
        title={title || "Pitch presentation"}
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

// ============ MAIN EMBED COMPONENT ============

export function MediaEmbed({ url, title, className }: EmbedProps) {
  const embedType = getEmbedType(url);

  switch (embedType) {
    case "youtube":
      return <YouTubeEmbed url={url} title={title} className={className} />;
    case "vimeo":
      return <VimeoEmbed url={url} title={title} className={className} />;
    case "loom":
      return <LoomEmbed url={url} title={title} className={className} />;
    case "figma":
      return <FigmaEmbed url={url} title={title} className={className} />;
    case "miro":
      return <MiroEmbed url={url} title={title} className={className} />;
    case "canva":
      return <CanvaEmbed url={url} title={title} className={className} />;
    case "google-doc":
    case "google-sheet":
    case "google-slide":
    case "google-form":
      return <GoogleDocsEmbed url={url} title={title} className={className} />;
    case "notion":
      return <NotionEmbed url={url} title={title} className={className} />;
    case "airtable":
      return <AirtableEmbed url={url} title={title} className={className} />;
    case "framer":
      return <FramerEmbed url={url} title={title} className={className} />;
    case "pitch":
      return <PitchEmbed url={url} title={title} className={className} />;
    default:
      return null;
  }
}

// Legacy export for backward compatibility
export { MediaEmbed as VideoEmbed, isEmbeddableUrl as isVideoUrl };
