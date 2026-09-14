import sanitizeHtml from "sanitize-html";

// The rich text editor runs in the browser, so it cannot be trusted: the action
// that stores article content is a public endpoint and can be called directly.
// Everything below is an allowlist — anything not named here is dropped.

const ALLOWED_TAGS = [
  "p",
  "br",
  "hr",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "blockquote",
  "ul",
  "ol",
  "li",
  "pre",
  "code",
  "a",
  "img",
];

const options: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
  },
  // No data: anywhere. An SVG delivered as a data URL can carry script.
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesAppliedToAttributes: ["href", "src"],
  allowProtocolRelative: false,
  // Drop the contents of these, not just the tags, so script bodies never
  // survive as visible text.
  nonTextTags: ["style", "script", "textarea", "option", "noscript"],
  transformTags: {
    // A link the editor produced may still point off-site; make that safe
    // rather than refusing the link.
    a: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, rel: "noopener noreferrer nofollow", target: "_blank" },
    }),
  },
};

export function sanitizeArticleHtml(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, options);
}

/**
 * Serialise data for a <script type="application/ld+json"> block.
 *
 * JSON.stringify alone is not enough: a closing script tag inside any string
 * value ends the block early and everything after it is parsed as markup.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
