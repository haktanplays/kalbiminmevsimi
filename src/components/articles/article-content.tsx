import sanitizeHtml from "sanitize-html";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  const cleanHtml = sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "mark",
      "u",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height", "loading"],
      a: ["href", "target", "rel"],
      "*": ["style", "class"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
      },
    },
  });

  return (
    <div
      className="prose font-serif text-foreground"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
