import React from "react";

interface TextPart {
  type: "text" | "hashtag" | "mention" | "url";
  content: string;
}

export function parsePostText(text: string): TextPart[] {
  const parts: TextPart[] = [];
  const regex = /(#\w+)|(@\w+)|(https?:\/\/[^\s]+)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }

    if (match[1]) {
      parts.push({ type: "hashtag", content: match[1] });
    } else if (match[2]) {
      parts.push({ type: "mention", content: match[2] });
    } else if (match[3]) {
      parts.push({ type: "url", content: match[3] });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  return parts;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}
