import { describe, expect, it } from "vitest";
import { sanitizeArticleHtml, jsonLdScript } from "@/lib/sanitize";

describe("XSS Prevention", () => {
  describe("sanitizeArticleHtml", () => {
    it("strips script tags", () => {
      const result = sanitizeArticleHtml('<script>alert("xss")</script>');
      expect(result).not.toContain("<script");
      expect(result).not.toContain("alert");
    });

    it("strips event handlers", () => {
      const result = sanitizeArticleHtml('<img src="x" onerror="alert(1)">');
      expect(result).not.toContain("onerror");
    });

    it("strips javascript: URLs", () => {
      const result = sanitizeArticleHtml('<a href="javascript:alert(1)">click</a>');
      expect(result).not.toContain("javascript:");
    });

    it("strips data: URLs", () => {
      const result = sanitizeArticleHtml('<a href="data:text/html,<script>alert(1)</script>">click</a>');
      expect(result).not.toContain("data:");
    });

    it("strips iframe tags", () => {
      const result = sanitizeArticleHtml('<iframe src="https://evil.com"></iframe>');
      expect(result).not.toContain("<iframe");
    });

    it("strips style tags", () => {
      const result = sanitizeArticleHtml("<style>body{display:none}</style>");
      expect(result).not.toContain("<style");
    });

    it("strips embed and object tags", () => {
      const result = sanitizeArticleHtml('<embed src="evil.swf"><object data="evil.swf"></object>');
      expect(result).not.toContain("<embed");
      expect(result).not.toContain("<object");
    });

    it("preserves safe HTML", () => {
      const result = sanitizeArticleHtml('<p>Hello <strong>world</strong></p>');
      expect(result).toContain("<p>");
      expect(result).toContain("<strong>");
    });

    it("adds rel=noopener noreferrer nofollow to links", () => {
      const result = sanitizeArticleHtml('<a href="https://example.com">link</a>');
      expect(result).toContain("noopener");
      expect(result).toContain("noreferrer");
      expect(result).toContain("nofollow");
    });

    it("handles null input", () => {
      expect(sanitizeArticleHtml(null)).toBe("");
    });

    it("handles undefined input", () => {
      expect(sanitizeArticleHtml(undefined)).toBe("");
    });
  });

  describe("jsonLdScript escaping", () => {
    it("escapes < characters to prevent script injection", () => {
      const result = jsonLdScript({ name: "</script><script>alert(1)</script>" });
      expect(result).not.toContain("</script>");
      expect(result).toContain("\\u003c");
    });
  });
});
